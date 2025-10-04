# EcoVision
app democratizes environmental awareness by making complex climate data interactive and accessible to everyone


Prerequisites
Before you begin, ensure you have:

Python 3.9+ installed (https://www.python.org/downloads/)
Google Earth Engine account (Sign up)
API Keys (at least one):

OpenAI API key (Get it here)
OR Anthropic API key (Get it here)


Git (for cloning the repository)


## STEP 2

### Create virtual environment
python -m venv venv

### Activate it
#### On macOS/Linux:
source venv/bin/activate

#### On Windows:
venv\Scripts\activate

## Install core dependencies
pip install fastapi uvicorn[standard] python-dotenv pydantic-settings

## Geospatial libraries
pip install geopandas shapely rasterio rasterstats

## Google Earth Engine
pip install earthengine-api

## LLM Integration (choose one or both)
pip install openai anthropic

## Additional utilities
pip install httpx pandas numpy python-multipart

## Development tools (optional but recommended)
pip install pytest black flake8

## Save all dependencies
pip freeze > requirements.txt
