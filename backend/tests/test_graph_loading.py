"""
Tests for graph loading and weighting functionality.
"""

import pytest
import networkx as nx
from app.services.network_service import NetworkService
from tests.fixtures import TestFixtures

def test_sample_network_creation():
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
    
    # Check that the current graph is stored
    assert service.current_graph is not None
    assert isinstance(service.current_graph, nx.Graph)

def test_graph_has_travel_time_weights():
    """Test that the graph has travel time weights on edges"""
    service = NetworkService()
    service.get_sample_network()
    
    # Check that all edges have travel_time attribute
    for u, v, data in service.current_graph.edges(data=True):
        assert 'travel_time' in data
        assert isinstance(data['travel_time'], (int, float))
        assert data['travel_time'] > 0

def test_graph_to_geojson_conversion():
    """Test conversion of graph to GeoJSON"""
    service = NetworkService()
    
    # Create a test graph
    G = TestFixtures.create_basic_test_graph()
    
    # Convert to GeoJSON
    geojson = service._graph_to_geojson(G)
    
    # Check GeoJSON structure
    assert geojson is not None
    assert 'type' in geojson
    assert geojson['type'] == 'FeatureCollection'
    assert 'features' in geojson
    
    # Check that nodes and edges are converted
    nodes = [f for f in geojson['features'] if f['properties']['type'] == 'intersection']
    edges = [f for f in geojson['features'] if f['properties']['type'] == 'road']
    
    assert len(nodes) == 3  # Basic test graph has 3 nodes
    assert len(edges) == 3  # Basic test graph has 3 edges

def test_get_roads():
    """Test getting all roads from the network"""
    service = NetworkService()
    
    # Use the basic test graph
    service.current_graph = TestFixtures.create_basic_test_graph()
    
    # Get roads
    roads = service.get_roads()
    
    # Check roads
    assert len(roads) == 3  # Basic test graph has 3 edges
    
    # Check road properties
    for road in roads:
        assert 'id' in road
        assert 'source' in road
        assert 'target' in road
        assert 'length' in road
        assert 'travel_time' in road
        assert 'name' in road

def test_graph_with_different_sizes():
    """Test creating graphs of different sizes"""
    basic_graph = TestFixtures.create_basic_test_graph()
    dynamic_graph = TestFixtures.create_dynamic_test_graph()
    complex_graph = TestFixtures.create_complex_test_graph()
    
    # Check node counts
    assert len(basic_graph.nodes) == 3
    assert len(dynamic_graph.nodes) == 6
    assert len(complex_graph.nodes) == 10
    
    # Check edge counts
    assert len(basic_graph.edges) == 3
    assert len(dynamic_graph.edges) == 8
    assert len(complex_graph.edges) == 16

def test_graph_coordinates():
    """Test that nodes have proper coordinates"""
    service = NetworkService()
    
    # Use the basic test graph
    G = TestFixtures.create_basic_test_graph()
    service.current_graph = G
    
    # Check coordinates
    for node_id, data in G.nodes(data=True):
        assert 'x' in data
        assert 'y' in data
        assert isinstance(data['x'], float)
        assert isinstance(data['y'], float)
