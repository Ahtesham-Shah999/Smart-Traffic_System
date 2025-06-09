import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Smart Traffic Management System API"}

def test_get_sample_network():
    """Test the sample network endpoint"""
    response = client.get("/network/sample")
    assert response.status_code == 200
    
    data = response.json()
    assert 'features' in data
    assert isinstance(data['features'], list)
    assert len(data['features']) > 0

def test_get_intersections():
    """Test the intersections endpoint"""
    # First, load a network
    client.get("/network/sample")
    
    # Then get intersections
    response = client.get("/network/intersections")
    assert response.status_code == 200
    
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_get_roads():
    """Test the roads endpoint"""
    # First, load a network
    client.get("/network/sample")
    
    # Then get roads
    response = client.get("/network/roads")
    assert response.status_code == 200
    
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_run_basic_simulation():
    """Test the basic simulation endpoint"""
    response = client.post("/simulate/basic")
    assert response.status_code == 200
    
    data = response.json()
    assert 'traffic_lights' in data
    assert 'routes' in data
    assert 'incidents' in data
    
    assert len(data['traffic_lights']) > 0
    assert len(data['routes']) > 0
    assert len(data['incidents']) == 0

def test_run_dynamic_simulation():
    """Test the dynamic simulation endpoint"""
    incident = {
        "road_id": "1-2",
        "severity": 0.5,
        "description": "Test incident"
    }
    
    response = client.post("/simulate/dynamic", json=incident)
    assert response.status_code == 200
    
    data = response.json()
    assert 'traffic_lights' in data
    assert 'routes' in data
    assert 'incidents' in data
    
    assert len(data['traffic_lights']) > 0
    assert len(data['routes']) > 0
    assert len(data['incidents']) == 1
    
    assert data['incidents'][0]['road_id'] == "1-2"
    assert data['incidents'][0]['severity'] == 0.5
    assert data['incidents'][0]['description'] == "Test incident"

def test_run_complex_simulation():
    """Test the complex simulation endpoint"""
    request = {
        "duration": 600,
        "incidents": [
            {
                "road_id": "1-2",
                "severity": 0.5,
                "description": "Test incident 1"
            },
            {
                "road_id": "3-5",
                "severity": 0.8,
                "description": "Test incident 2"
            }
        ],
        "vehicles_count": 20
    }
    
    response = client.post("/simulate/complex", json=request)
    assert response.status_code == 200
    
    data = response.json()
    assert 'traffic_lights' in data
    assert 'routes' in data
    assert 'incidents' in data
    assert 'duration' in data
    
    assert len(data['traffic_lights']) > 0
    assert len(data['routes']) > 0
    assert len(data['incidents']) == 2
    assert data['duration'] == 600
