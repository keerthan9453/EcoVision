import os

# Google Earth Engine Configuration
GEE_SA_KEY = os.environ.get(
    "GEE_SA_KEY", "/Users/keerthan/Downloads/ecovision-474106-2398ea14fe49.json")
GEE_PROJECT = os.environ.get("GEE_PROJECT", "ecovision-474105")

# Google Gemini API Configuration
GEMINI_API_KEY = os.environ.get(
    "GOOGLE_API_KEY", "AIzaSyDFd62L_a1khPa575aQa3i7dfdmhzBfge4")
