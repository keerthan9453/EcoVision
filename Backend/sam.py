import os
import rasterio
import numpy as np
import matplotlib.pyplot as plt
import cv2
from ultralytics import SAM
import sys
import matplotlib

# Use an interactive Matplotlib backend
import matplotlib
matplotlib.use('Qt5Agg')

# point to the new location where ml.py saves the file
file_path = 'satellite_images/Toronto_RGB_700.tif'

# Load the SAM model once
model = SAM('sam_b.pt')

# Global variables to store geospatial metadata and results
geo_transform = None
crs = None
segmented_area_m2 = None  # This will store your area value

# a function to calculate the area of segmented portion on the map


def calculate_area_m2(mask):
    """
    Calculate the real-world area of a segmented mask in square meters.

    Args:
        mask: Binary mask (numpy array)

    Returns:
        area_m2: Area in square meters
    """
    # Count the number of pixels in the mask
    pixel_count = np.sum(mask)

    # Since you set scale=10 in GEE export, each pixel is 10m x 10m = 100 m²
    pixel_area_m2 = 10 * 10  # 100 m² per pixel

    # Calculate total area
    area_m2 = pixel_count * pixel_area_m2

    return area_m2

# Function to handle the click event and perform segmentation


def on_click(event):
    global geo_transform, crs, segmented_area_m2

    if event.inaxes:
        # Get the click coordinates from the event
        point = np.array([[event.xdata, event.ydata]])

        print(f"Clicked at: ({event.xdata:.2f}, {event.ydata:.2f})")

        print("Segmenting the selected point...")

        # Run inference on the image with the point prompt
        # The 'labels' argument tells SAM that this is a positive prompt (1)
        results = model(image_np, points=point, labels=[1])

        # Process the results
        masks = results[0].masks.data
        if masks.shape[0] > 0:
            # Create a semi-transparent overlay of the mask
            segmented_mask = masks[0].cpu().numpy().astype(np.uint8)

            # Calculate and store the area in m²
            segmented_area_m2 = calculate_area_m2(segmented_mask)

            # Print the area
            print(f"\nSegmented area: {segmented_area_m2:.2f} m²")

            segmented_image = cv2.addWeighted(image_np, 0.7, cv2.cvtColor(
                segmented_mask * 255, cv2.COLOR_GRAY2BGR), 0.3, 0)

            fig_seg, ax_seg = plt.subplots(figsize=(12, 10))
            ax_seg.imshow(segmented_image)
            ax_seg.set_title(
                f"Segmented Area: {segmented_area_m2:.2f} m²", fontsize=12, pad=20)
            ax_seg.axis('off')

            # Close the original plot
            plt.close(fig)
            plt.show()

            print("Segmentation complete.")

            # You can now use segmented_area_m2 variable
            # Example: Send to frontend or calculate tree capacity
            print(f"\n>>> Area available for frontend: {segmented_area_m2} m²")

        else:
            print("No object found at the clicked location.")


try:
    # Open the TIFF file
    with rasterio.open(file_path) as src:
        # Store geospatial metadata
        geo_transform = src.transform
        crs = src.crs
        # Read the first three bands (B4, B3, B2) and transpose
        if src.count < 3:
            print("Error: The image must have at least 3 bands (RGB).")
            sys.exit()

        image_data = src.read([1, 2, 3])
        image_np = np.transpose(image_data, (1, 2, 0))

        # Convert to 8-bit for SAM and Matplotlib
        if image_np.dtype != np.uint8:
            image_np = (image_np / np.max(image_np) * 255).astype(np.uint8)

        # Display the image and allow for interactive zooming
        fig, ax = plt.subplots(figsize=(10, 10))
        ax.imshow(image_np)
        ax.set_title("Click to segment and calculate area")
        ax.axis('off')

        # Connect the click event
        cid = fig.canvas.mpl_connect('button_press_event', on_click)

        # Show the plot with the toolbar for interaction
        plt.show()

        # After matplotlib closes, you can access the area
        if segmented_area_m2 is not None:
            print(f"\n=== FINAL RESULT ===")
            print(f"Area: {segmented_area_m2} m²")
            print(f"Ready to send to frontend!")

except rasterio.errors.RasterioIOError as e:
    print(
        f"Error: Could not open or read the file at {file_path}. Please check the path and filename.")
    print(f"Details: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
