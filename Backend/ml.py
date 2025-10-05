import ee
import requests
import os

# Initialize Earth Engine
ee.Initialize(project='ecovision-474105')

# Define the coordinates of Toronto city for example
toronto_city = ee.Geometry.Point(-79.3832, 43.6532)
# to define the radius of the city, in m.
toronto_aoi = toronto_city.buffer(700)

# Access the Sentinel-2 Surface Reflectance Image Collection.
s2_collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
filtered_collection = s2_collection.filterBounds(
    toronto_aoi).filterDate('2023-01-01', '2023-12-31')
cloud_filtered = filtered_collection.filter(
    ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 5))

# Get the best image (least cloudy)
best_image = cloud_filtered.sort('CLOUDY_PIXEL_PERCENTAGE').first()
image = best_image

# Get the bands needed for a natural color (RGB) image.
# Sentinel-2 bands are named differently:
# B4: Red, B3: Green, B2: Blue
rgb_image = image.select('B4', 'B3', 'B2')

print("Generating download URL...")

# Get download URL directly (NO GOOGLE DRIVE NEEDED!)
url = rgb_image.getDownloadURL({
    'region': toronto_aoi.bounds(),
    'scale': 10,
    'crs': 'EPSG:4326',
    'format': 'GEO_TIFF'
})

print(f"Download URL generated: {url[:50]}...")
print("Downloading image...")

# Download the image directly to your project folder
response = requests.get(url, timeout=300)  # 5 minute timeout

if response.status_code == 200:
    # Create folder if it doesn't exist
    os.makedirs('satellite_images', exist_ok=True)

    # Save the file
    output_filename = 'satellite_images/Toronto_RGB_700.tif'
    with open(output_filename, 'wb') as f:
        f.write(response.content)

    print(f"✓ Image downloaded successfully!")
    print(f"✓ Saved to: {output_filename}")
    print(f"✓ File size: {len(response.content) / 1024 / 1024:.2f} MB")
else:
    print(f"✗ Download failed. Status code: {response.status_code}")
print("Process completed.")
