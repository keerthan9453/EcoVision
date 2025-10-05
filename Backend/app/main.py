import google.generativeai as genai
import os
import ee
from typing import Union, List, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ml import get_satellite_image
from sam import segment_image

import sys
from config import GEMINI_API_KEY, GEE_PROJECT


sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# --- Configuration & Initialization ---
try:
    genai.configure(api_key=GEMINI_API_KEY)
except Exception as e:
    raise RuntimeError(
        f"Failed to configure Gemini API. Please check GEMINI_API_KEY in config.py: {e}")

try:
    ee.Initialize(project=GEE_PROJECT)
except Exception as e:
    raise RuntimeError(f"Failed to initialize Earth Engine: {e}")

app = FastAPI()

# --- CORS Configuration ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---


class CityCoordinates(BaseModel):
    lat: float
    lon: float
    name: Optional[str] = None


class AOI(BaseModel):
    type: str
    coordinates: Union[List[float], List[List[float]]]


class AnalysisParams(BaseModel):
    soil_type_weight: float = 1.0
    population_density_weight: float = 1.0
    water_proximity_weight: float = 1.0
    slope_preference: str = "moderate"
    min_ndvi: float = 0.0
    max_ndvi: float = 0.2


class AnalysisRequest(BaseModel):
    aoi: AOI
    selected_layers: List[str]
    analysis_params: AnalysisParams


class Recommendation(BaseModel):
    location_id: str
    latitude: float
    longitude: float
    reasoning: str
    suggested_action: str
    current_ndvi: Optional[float] = None
    land_cover: Optional[str] = None


class AnalysisResponse(BaseModel):
    most_effective_way: str
    recommendations_table: List[Recommendation]
    raw_gemini_output: str
    map_id: Optional[dict] = None


class ProcessRequest(BaseModel):
    lat: float
    lon: float
    radius: float = 700.0  # Default radius in meters


class ProcessResponse(BaseModel):
    segmented_area_m2: float
    coordinates: tuple
    gemini_analysis: str
    image_path: str
# --- Helper Functions ---


def get_land_cover_name(code: int) -> str:
    worldcover_map = {
        10: 'Tree Cover', 20: 'Shrubland', 30: 'Grassland', 40: 'Cropland',
        50: 'Built-up', 60: 'Bare/sparse vegetation', 70: 'Snow and Ice',
        80: 'Permanent Water bodies', 90: 'Herbaceous wetland', 95: 'Mangroves', 100: 'Moss and Lichen',
    }
    return worldcover_map.get(code, 'Other/Unknown')


def parse_gemini_output(text_output: str) -> List[Recommendation]:
    recommendations = []
    lines = text_output.split('\n')
    current_rec = {}
    for line in lines:
        line = line.strip()
        if line.startswith("Location"):
            if current_rec:
                recommendations.append(Recommendation(**current_rec))
            current_rec = {}
            try:
                parts = line.split('(Lat:')[1].split('Lon:')
                lat_str = parts[0].strip().replace(',', '')
                lon_str = parts[1].split('):')[0].strip()
                current_rec['latitude'] = float(lat_str)
                current_rec['longitude'] = float(lon_str)
                current_rec['location_id'] = line.split(' ')[1]
            except (IndexError, ValueError):
                current_rec['latitude'] = 0.0
                current_rec['longitude'] = 0.0
                current_rec['location_id'] = "Unknown"
            current_rec['reasoning'] = ""
            current_rec['suggested_action'] = ""
        elif line.startswith("Reasoning:"):
            current_rec['reasoning'] += line.replace(
                "Reasoning:", "").strip() + " "
        elif line.startswith("Suggested Action:") or line.startswith("Actions:"):
            current_rec['suggested_action'] += line.replace(
                "Suggested Action:", "").replace("Actions:", "").strip() + " "
        elif current_rec and 'reasoning' in current_rec and not current_rec['suggested_action']:
            current_rec['reasoning'] += line + " "
        elif current_rec and 'suggested_action' in current_rec:
            current_rec['suggested_action'] += line + " "
    if current_rec:
        recommendations.append(Recommendation(**current_rec))
    return recommendations

# --- GEE & Gemini Analysis ---


async def perform_gee_and_gemini_analysis(aoi_data: AOI, selected_layers: List[str], analysis_params: AnalysisParams) -> AnalysisResponse:
    if aoi_data.type == "Point":
        lon, lat = aoi_data.coordinates
        urban_aoi = ee.Geometry.Point(lon, lat).buffer(1000)
    elif aoi_data.type == "Polygon":
        urban_aoi = ee.Geometry.Polygon(aoi_data.coordinates)
    else:
        raise ValueError("Unsupported AOI type. Must be 'Point' or 'Polygon'.")

    elevation = ee.Image(
        'USGS/SRTMGL1_003').select('elevation').clip(urban_aoi)
    slope = ee.Terrain.slope(elevation).clip(urban_aoi)
    land_cover = ee.Image('ESA/WorldCover/v100/2020').clip(urban_aoi)
    combined_bands = [elevation.rename('Elevation'), slope.rename(
        'Slope'), land_cover.rename('LandCover')]

    s2_collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
        .filterBounds(urban_aoi) \
        .filterDate('2023-01-01', '2023-12-31') \
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
    s2_image = s2_collection.median()
    ndvi = s2_image.normalizedDifference(
        ['B8', 'B4']).rename('NDVI').clip(urban_aoi)
    combined_bands.append(ndvi.rename('NDVI'))

    population_density = ee.Image(
        'WorldPop/GP/100m/pop').clip(urban_aoi).rename('PopulationDensity')
    combined_bands.append(population_density)

    if 'water_bodies' in selected_layers:
        jrc_water = ee.Image(
            'JRC/GSW1_1/GlobalSurfaceWater').select('occurrence').clip(urban_aoi)
        permanent_water = jrc_water.gt(90)
        distance_to_water = permanent_water.fastDistanceTransform(
        ).sqrt().rename('DistanceToWater')
        combined_bands.append(distance_to_water)
    if 'soil_type' in selected_layers:
        soil_texture_class = ee.Image('OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA_M/v02').select(
            'b0').clip(urban_aoi).rename('SoilTextureClass')
        combined_bands.append(soil_texture_class)

    combined_image = ee.Image.cat(combined_bands)
    sample_scale = 30
    num_samples = 200
    sampled_points = combined_image.sample(
        region=urban_aoi,
        scale=sample_scale,
        numPixels=num_samples,
        seed=0,
        geometries=True
    )
    data_for_gemini_full_features = sampled_points.getInfo()['features']

    location_descriptions = []
    for i, feature in enumerate(data_for_gemini_full_features):
        props = feature['properties']
        coords = feature['geometry']['coordinates']
        lc_code = props.get('LandCover')
        lc_name = get_land_cover_name(lc_code)
        description_parts = [
            f"Location {i+1} (Lat: {coords[1]:.4f}, Lon: {coords[0]:.4f}):",
            f"  Elevation={props.get('Elevation', 'N/A')}m,",
            f"  Slope={props.get('Slope', 'N/A'):.2f} degrees,",
            f"  Land Cover='{lc_name}',",
            f"  NDVI={props.get('NDVI', 'N/A'):.2f},",
            f"  Population Density={props.get('PopulationDensity', 'N/A'):.2f} people/km^2,"
        ]
        if 'DistanceToWater' in props:
            description_parts.append(
                f"  Distance to Permanent Water={props.get('DistanceToWater', 'N/A'):.0f}m,")
        if 'SoilTextureClass' in props:
            description_parts.append(
                f"  Soil Texture Class={props.get('SoilTextureClass', 'N/A')},")
        location_descriptions.append(" ".join(description_parts))

    criteria_list = [
        f"1. **Low Existing Vegetation (Afforestation):** NDVI should be low (e.g., less than {analysis_params.max_ndvi:.2f}) for efficient new planting.",
        "2. **Suitable Land Cover (Afforestation):** Prioritize 'Bare/sparse vegetation', 'Grassland', or 'Cropland'. Avoid 'Built-up' or 'Tree Cover' areas.",
        f"3. **Slope Preference:** Consider {analysis_params.slope_preference} slopes.",
        "4. **Population Density:** Consider the population density."
    ]
    if 'water_bodies' in selected_layers:
        criteria_list.append(
            f"5. **Proximity to Water Bodies:** Areas closer to permanent water bodies might be more suitable.")
    if 'soil_type' in selected_layers:
        criteria_list.append(
            "6. **Soil Type:** Prefer soil types suitable for vegetation growth.")

    model = genai.GenerativeModel('gemini-2.5-pro')
    prompt = (
        "I have an urban locations with their environmental data within a defined Area of Interest (AOI). "
        "I need to identify the most efficient locations for environmental interventions, specifically focusing on the selected layers. "
        "Please analyze the following data the location and recommend the top 3-5 most suitable method of sustainability, "
        "explaining your reasoning based on the provided criteria. "
        "For each recommendation, clearly state the location's approximate latitude and longitude, "
        "the primary reason for its suitability, and a suggested action. "
        "\n\nHere are the general criteria for 'efficient interventions' based on user selection:\n"
        + "\n".join(criteria_list) +
        "\n\nHere is the data for each location. Each line represents a sampled point:\n"
        + "\n".join(location_descriptions) +
        "\n\nPlease provide your top recommendations (3-5), their coordinates, detailed explanations, and suggested actions."
    )
    try:
        response = model.generate_content(prompt)
        raw_gemini_output = response.text
        recommendations_parsed = parse_gemini_output(raw_gemini_output)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An error occurred with the Gemini API: {e}")

    try:
        map_id = ee.Image(0).visualize(opacity=0).getMapId({'bands': []})
    except ee.EEException as e:
        map_id = None

    most_effective_way_summary = "Based on the analysis, prioritize areas with low vegetation, suitable land cover, and moderate slopes for afforestation. Consider population density and proximity to water for ecological enhancements."

    return AnalysisResponse(
        most_effective_way=most_effective_way_summary,
        recommendations_table=recommendations_parsed,
        raw_gemini_output=raw_gemini_output,
        map_id=map_id
    )

# --- API Endpoints ---


@app.get("/city-coords", response_model=Union[CityCoordinates, str])
async def get_city_coords(city_name: str):
    city_data = {
        "San Francisco": {"lat": 37.7749, "lon": -122.4194, "name": "San Francisco"},
        "New York": {"lat": 40.7128, "lon": -74.0060, "name": "New York"},
        "Los Angeles": {"lat": 34.0522, "lon": -118.2437, "name": "Los Angeles"},
        "Chicago": {"lat": 41.8781, "lon": -87.6298, "name": "Chicago"},
        "Houston": {"lat": 29.7604, "lon": -95.3698, "name": "Houston"},
        "London": {"lat": 51.5074, "lon": -0.1278, "name": "London"},
        "Paris": {"lat": 48.8566, "lon": 2.3522, "name": "Paris"},
        "Tokyo": {"lat": 35.6895, "lon": 139.6917, "name": "Tokyo"},
        # Added Toronto from GEE Inspector
        "Toronto": {"lat": 43.66115, "lon": -79.3575, "name": "Toronto"},
        # Add more cities as needed
    }
    result = city_data.get(city_name)
    if result:
        return CityCoordinates(**result)
    else:
        raise HTTPException(
            status_code=404, detail=f"City '{city_name}' not found.")


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_area(request: AnalysisRequest):
    try:
        response_data = await perform_gee_and_gemini_analysis(
            request.aoi,
            request.selected_layers,
            request.analysis_params
        )
        return response_data
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal server error during analysis: {e}")


@app.post("/process", response_model=ProcessResponse)
async def process_area(request: ProcessRequest):
    """
    Complete processing pipeline:
    1. Fetch satellite image from GEE
    2. Segment area using SAM
    3. Analyze with Gemini
    """
    try:
        # Step 1: Get satellite image
        print(f"Fetching satellite image for ({request.lat}, {request.lon})")
        image_path = await get_satellite_image(request.lat, request.lon, request.radius)

        if not image_path or not os.path.exists(image_path):
            raise HTTPException(
                status_code=500, detail="Failed to fetch satellite image")

        # Step 2: Run segmentation
        print(f"Running segmentation on {image_path}")
        segmented_area, coords = await segment_image(image_path)

        if not segmented_area or not coords:
            raise HTTPException(status_code=500, detail="Segmentation failed")

        # Step 3: Analyze with Gemini
        prompt = f"""
        Analyze this urban area for tree planting potential:
        - Location: {coords}
        - Area: {segmented_area:.2f} m²
        
        Provide:
        1. Number of trees that could be planted
        2. Expected environmental impact
        3. Recommended tree species
        4. Implementation timeline
        """

        response = model.generate_content(prompt)

        return ProcessResponse(
            segmented_area_m2=segmented_area,
            coordinates=coords,
            gemini_analysis=response.text,
            image_path=image_path
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
