from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from app.services.network_service import NetworkService

router = APIRouter()
network_service = NetworkService()

class BoundingBox(BaseModel):
    min_x: float
    min_y: float
    max_x: float
    max_y: float

@router.get("/")
async def get_network(
    min_x: float = Query(..., description="Minimum longitude"),
    min_y: float = Query(..., description="Minimum latitude"),
    max_x: float = Query(..., description="Maximum longitude"),
    max_y: float = Query(..., description="Maximum latitude"),
):
    """
    Get a road network within the specified bounding box
    """
    try:
        bbox = BoundingBox(min_x=min_x, min_y=min_y, max_x=max_x, max_y=max_y)
        network = network_service.get_network(bbox)
        return network
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sample")
async def get_sample_network():
    """
    Get a sample road network for testing
    """
    try:
        # This will return a small predefined network for testing
        network = network_service.get_sample_network()
        return network
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/square-intersection")
async def get_square_intersection():
    """
    Get a square intersection (chock) network with traffic signals
    """
    try:
        # This will return a square intersection network with traffic signals
        network = network_service.get_square_intersection_network()
        return network
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/debug")
async def debug_network():
    """
    Get debug information about the current network
    """
    try:
        if network_service.current_graph is None:
            return {"status": "no_network", "message": "No network loaded"}

        G = network_service.current_graph
        nodes = list(G.nodes())
        edges = list(G.edges())

        # Get a sample of node and edge data
        sample_node = None
        if nodes:
            sample_node = {
                "id": str(nodes[0]),
                "data": dict(G.nodes[nodes[0]])
            }

        sample_edge = None
        if edges:
            u, v = edges[0]
            sample_edge = {
                "id": f"{u}-{v}",
                "data": dict(G[u][v])
            }

        return {
            "status": "ok",
            "node_count": len(nodes),
            "edge_count": len(edges),
            "sample_node": sample_node,
            "sample_edge": sample_edge,
            "has_geojson": network_service.current_geojson is not None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/intersections")
async def get_intersections():
    """
    Get all intersections (nodes) in the current network
    """
    try:
        intersections = network_service.get_intersections()
        return intersections
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/roads")
async def get_roads():
    """
    Get all roads (edges) in the current network
    """
    try:
        roads = network_service.get_roads()
        return roads
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
