"""
Tests for square intersection simulation.
"""

import pytest
from app.services.simulation_service import SimulationService
from app.services.network_service import NetworkService
from app.api.simulation import Incident

def test_square_intersection_network():
    """Test creation of square intersection network"""
    service = NetworkService()
    
    # Get the square intersection network
    network = service.get_square_intersection_network()
    
    # Check that the network is valid
    assert network is not None
    assert 'features' in network
    
    # Check that we have the expected number of nodes and edges
    nodes = [f for f in network['features'] if f['properties']['type'] == 'intersection']
    edges = [f for f in network['features'] if f['properties']['type'] == 'road']
    
    # We should have 8 nodes (4 for the square, 4 external)
    assert len(nodes) == 8
    
    # We should have 8 edges (4 for the square, 4 external)
    assert len(edges) == 8

def test_square_intersection_traffic_lights():
    """Test generation of traffic light timings for square intersection"""
    sim_service = SimulationService()
    network_service = NetworkService()
    
    # Get the square intersection network
    network_service.get_square_intersection_network()
    G = network_service.current_graph
    
    # Generate traffic light timings
    traffic_lights = sim_service._generate_square_intersection_traffic_lights(G, [])
    
    # Check traffic lights
    assert traffic_lights is not None
    assert len(traffic_lights) == 4  # One for each corner of the square
    
    # Check traffic light properties
    for light in traffic_lights:
        assert 'intersection_id' in light
        assert 'cycles' in light
        assert 'total_cycle_time' in light
        
        # Check cycles
        cycles = light['cycles']
        assert len(cycles) > 0
        
        for cycle in cycles:
            assert 'road_id' in cycle
            assert 'green_start' in cycle
            assert 'green_duration' in cycle
            assert 'yellow_duration' in cycle

def test_square_intersection_routes():
    """Test generation of routes through square intersection"""
    sim_service = SimulationService()
    network_service = NetworkService()
    
    # Get the square intersection network
    network_service.get_square_intersection_network()
    G = network_service.current_graph
    
    # Generate routes
    routes = sim_service._generate_square_intersection_routes(G, 10, [])
    
    # Check routes
    assert routes is not None
    assert len(routes) > 0
    
    # Check route properties
    for route in routes:
        assert 'id' in route
        assert 'source' in route
        assert 'target' in route
        assert 'path' in route
        assert 'travel_time' in route
        assert 'waypoints' in route
        
        # Check waypoints
        waypoints = route['waypoints']
        assert len(waypoints) > 0
        
        for waypoint in waypoints:
            assert 'node_id' in waypoint
            assert 'latitude' in waypoint
            assert 'longitude' in waypoint
            assert 'arrival_time' in waypoint

def test_square_intersection_simulation():
    """Test running a square intersection simulation"""
    service = SimulationService()
    
    # Run the simulation
    result = service.run_square_intersection_simulation(vehicles_count=10, with_incident=False)
    
    # Check result
    assert result is not None
    assert 'traffic_lights' in result
    assert 'routes' in result
    assert 'incidents' in result
    
    # Check traffic lights
    traffic_lights = result['traffic_lights']
    assert len(traffic_lights) == 4  # One for each corner of the square
    
    # Check routes
    routes = result['routes']
    assert len(routes) > 0
    
    # Check incidents
    incidents = result['incidents']
    assert len(incidents) == 0  # No incidents in this simulation

def test_square_intersection_simulation_with_incident():
    """Test running a square intersection simulation with an incident"""
    service = SimulationService()
    
    # Run the simulation with an incident
    result = service.run_square_intersection_simulation(vehicles_count=10, with_incident=True)
    
    # Check result
    assert result is not None
    assert 'traffic_lights' in result
    assert 'routes' in result
    assert 'incidents' in result
    
    # Check incidents
    incidents = result['incidents']
    assert len(incidents) == 1  # One incident in this simulation
    assert incidents[0]['road_id'] == "1-2"  # The incident should be on the north road
    assert incidents[0]['severity'] == 0.8
