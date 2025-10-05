import os
import rasterio
import numpy as np
import matplotlib.pyplot as plt
import cv2
from ultralytics import SAM
import matplotlib
from typing import Tuple, Optional
from fastapi import HTTPException


async def segment_image(image_path: str) -> Tuple[float, Tuple[float, float]]:
    """
    Segment the image and return the area and coordinates.

    Args:
        image_path: Path to the satellite image

    Returns:
        Tuple of (segmented_area_m2, (latitude, longitude))

    Raises:
        HTTPException: If segmentation fails
    """
    global Point
    matplotlib.use('Qt5Agg')

    # Load the SAM model
    try:
        model = SAM('sam_b.pt')
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to load SAM model: {str(e)}")

    # Global variables
    geo_transform = None
    crs = None
    segmented_area_m2 = None

    # ... existing calculate_area_m2 function ...

    def on_click(event):
        # ... existing on_click function ...
        pass

    try:
        if not os.path.exists(image_path):
            raise HTTPException(
                status_code=404,
                detail=f"Image file not found at {image_path}"
            )

        with rasterio.open(image_path) as src:
            # ... existing rasterio processing code ...
            pass

        if segmented_area_m2 is None or Point is None:
            raise HTTPException(
                status_code=400,
                detail="No area was segmented. Please click on the image."
            )

        return segmented_area_m2, (Point[0][1], Point[0][0])

    except rasterio.errors.RasterioIOError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to read image file: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Segmentation failed: {str(e)}"
        )
