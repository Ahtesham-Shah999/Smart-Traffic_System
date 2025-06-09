import pytest
import networkx as nx
from app.services.network_service import NetworkService
from pydantic import BaseModel

class BoundingBox(BaseModel):
    min_x: float
    min_y: float
    max_x: float
    max_y: float

def test_get_sample_network():
    """Test that the sample network is created correctly"""
    service = NetworkService()
    network = service.get_sample_network()
    
    # Check that the network is a GeoJSON FeatureCollection
    assert network is not None
    assert 'features' in network
    assert isinstance(network['features'], list)
    
    # Check that there are nodes and edges
    nodes = [f for f in network['features'] if f['properties']['type'] == 'intersection']
    edges = [f for f in network['features'] if f['properties']['type'] == 'road']
    
    assert len(nodes) > 0
    assert len(edges) > 0

def test_get_intersections():
    """Test that intersections are returned correctly"""
    service = NetworkService()
    service.get_sample_network()  # Load the sample network first
    
    intersections = service.get_intersections()
    
    assert intersections is not None
    assert isinstance(intersections, list)
    assert len(intersections) > 0
    
    # Check that each intersection has the required fields
    for intersection in intersections:
        assert 'id' in intersection
        assert 'latitude' in intersection
        assert 'longitude' in intersection
        assert 'degree' in intersection

def test_get_roads():
    """Test that roads are returned correctly"""
    service = NetworkService()
    service.get_sample_network()  # Load the sample network first
    
    roads = service.get_roads()
    
    assert roads is not None
    assert isinstance(roads, list)
    assert len(roads) > 0
    
    # Check that each road has the required fields
    for road in roads:
        assert 'id' in road
        assert 'source' in road
        assert 'target' in road
        assert 'length' in road
        assert 'travel_time' in road
