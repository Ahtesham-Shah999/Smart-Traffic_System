import pytest
from app.services.simulation_service import SimulationService
from app.api.simulation import Incident

def test_run_basic_simulation():
    """Test that the basic simulation runs correctly"""
    service = SimulationService()
    result = service.run_basic_simulation()
    
    assert result is not None
    assert 'traffic_lights' in result
    assert 'routes' in result
    assert 'incidents' in result
    
    # Check that there are traffic lights and routes
    assert len(result['traffic_lights']) > 0
    assert len(result['routes']) > 0
    assert len(result['incidents']) == 0  # No incidents in basic simulation

def test_run_dynamic_simulation():
    """Test that the dynamic simulation with an incident runs correctly"""
    service = SimulationService()
    
    # Create a sample incident
    incident = Incident(
        road_id="1-2",
        severity=0.5,
        description="Test incident"
    )
    
    result = service.run_dynamic_simulation(incident)
    
    assert result is not None
    assert 'traffic_lights' in result
    assert 'routes' in result
    assert 'incidents' in result
    
    # Check that there are traffic lights, routes, and the incident
    assert len(result['traffic_lights']) > 0
    assert len(result['routes']) > 0
    assert len(result['incidents']) == 1
    
    # Check that the incident is correctly included
    assert result['incidents'][0]['road_id'] == "1-2"
    assert result['incidents'][0]['severity'] == 0.5
    assert result['incidents'][0]['description'] == "Test incident"

def test_run_complex_simulation():
    """Test that the complex simulation runs correctly"""
    service = SimulationService()
    
    # Create sample incidents
    incidents = [
        Incident(
            road_id="1-2",
            severity=0.5,
            description="Test incident 1"
        ),
        Incident(
            road_id="3-5",
            severity=0.8,
            description="Test incident 2"
        )
    ]
    
    result = service.run_complex_simulation(
        duration=600,
        incidents=incidents,
        vehicles_count=20
    )
    
    assert result is not None
    assert 'traffic_lights' in result
    assert 'routes' in result
    assert 'incidents' in result
    assert 'duration' in result
    
    # Check that there are traffic lights, routes, and incidents
    assert len(result['traffic_lights']) > 0
    assert len(result['routes']) > 0
    assert len(result['incidents']) == 2
    assert result['duration'] == 600
