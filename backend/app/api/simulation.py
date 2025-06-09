from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from app.services.simulation_service import SimulationService

router = APIRouter()
simulation_service = SimulationService()

class Incident(BaseModel):
    road_id: str
    severity: float  # 0.0 to 1.0, where 1.0 is completely blocked
    description: Optional[str] = None

class SimulationRequest(BaseModel):
    duration: int = 300  # simulation duration in seconds
    incidents: Optional[List[Incident]] = None
    vehicles_count: int = 10

@router.post("/basic")
async def simulate_basic():
    """
    Run a basic simulation with default timings & routes for static light traffic
    """
    try:
        result = simulation_service.run_basic_simulation()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dynamic")
async def simulate_dynamic(incident: Incident = Body(...)):
    """
    Run a dynamic simulation with an incident, returning updated timings & alternative routes
    """
    try:
        result = simulation_service.run_dynamic_simulation(incident)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/complex")
async def simulate_complex(request: SimulationRequest = Body(...)):
    """
    Run a complex simulation with multiple incidents & concurrent vehicles
    """
    try:
        result = simulation_service.run_complex_simulation(
            duration=request.duration,
            incidents=request.incidents or [],
            vehicles_count=request.vehicles_count
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class SquareIntersectionRequest(BaseModel):
    vehicles_count: int = 10
    with_incident: bool = False

@router.post("/square-intersection")
async def simulate_square_intersection(request: SquareIntersectionRequest = Body(...)):
    """
    Run a simulation with a square intersection (chock) with traffic signals
    """
    try:
        result = simulation_service.run_square_intersection_simulation(
            vehicles_count=request.vehicles_count,
            with_incident=request.with_incident
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
