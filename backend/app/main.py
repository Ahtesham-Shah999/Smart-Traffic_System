# --- main.py ---
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.network import router as network_router
from app.api.simulation import router as simulation_router  # Optional if you don't use it

app = FastAPI(
    title="Smart Traffic Management System",
    description="API for modeling, optimizing, and visualizing traffic flow in urban environments",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Routes
app.include_router(network_router, prefix="/network", tags=["Network"])
app.include_router(simulation_router, prefix="/simulate", tags=["Simulation"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Smart Traffic Management System API"}

@app.get("/status")
async def get_status():
    return {"status": "operational", "lights": [], "routes": []}

@app.get("/debug")
async def debug():
    return {
        "status": "ok",
        "message": "API is working correctly",
        "timestamp": import_time(),
        "cors": "enabled",
        "version": "1.0.0"
    }

def import_time():
    from datetime import datetime
    return datetime.now().isoformat()

# Optional CLI test
if __name__ == "__main__":
    from app.services.network_service import NetworkService
    import geojson

    service = NetworkService()
    geojson_data = service.get_faisalabad_satyana_road_map()
    print(geojson.dumps(geojson_data, indent=2))