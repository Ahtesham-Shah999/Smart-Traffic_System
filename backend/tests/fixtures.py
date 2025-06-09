"""
Test fixtures for the Smart Traffic Management System.
These fixtures provide test data for the three main test scenarios:
1. Basic Functionality Test
2. Dynamic Traffic & Rerouting Test
3. Complexity & Optimization Test
"""

import networkx as nx
import pytest
from app.api.simulation import Incident

class TestFixtures:
    """
    Test fixtures for the Smart Traffic Management System.
    """
    
    @staticmethod
    def create_basic_test_graph():
        """
        Create a small test graph for basic functionality testing.
        This graph has 3 intersections connected in a triangle.
        """
        G = nx.Graph()
        
        # Add nodes (intersections)
        nodes = [
            (1, {"y": 40.7128, "x": -74.0060}),  # Node 1
            (2, {"y": 40.7142, "x": -74.0050}),  # Node 2
            (3, {"y": 40.7150, "x": -74.0070})   # Node 3
        ]
        G.add_nodes_from(nodes)
        
        # Add edges (roads)
        edges = [
            (1, 2, {"length": 200, "travel_time": 20, "name": "Road 1-2"}),
            (2, 3, {"length": 150, "travel_time": 15, "name": "Road 2-3"}),
            (3, 1, {"length": 300, "travel_time": 30, "name": "Road 3-1"})
        ]
        G.add_edges_from(edges)
        
        return G
    
    @staticmethod
    def create_dynamic_test_graph():
        """
        Create a medium-sized test graph for dynamic traffic testing.
        This graph has 6 intersections with multiple paths between nodes.
        """
        G = nx.Graph()
        
        # Add nodes (intersections)
        nodes = [
            (1, {"y": 40.7128, "x": -74.0060}),  # Node 1
            (2, {"y": 40.7142, "x": -74.0050}),  # Node 2
            (3, {"y": 40.7150, "x": -74.0070}),  # Node 3
            (4, {"y": 40.7135, "x": -74.0080}),  # Node 4
            (5, {"y": 40.7160, "x": -74.0065}),  # Node 5
            (6, {"y": 40.7145, "x": -74.0055})   # Node 6
        ]
        G.add_nodes_from(nodes)
        
        # Add edges (roads)
        edges = [
            (1, 2, {"length": 200, "travel_time": 20, "name": "Road 1-2"}),
            (1, 3, {"length": 300, "travel_time": 30, "name": "Road 1-3"}),
            (1, 4, {"length": 250, "travel_time": 25, "name": "Road 1-4"}),
            (2, 3, {"length": 150, "travel_time": 15, "name": "Road 2-3"}),
            (2, 6, {"length": 220, "travel_time": 22, "name": "Road 2-6"}),
            (3, 5, {"length": 180, "travel_time": 18, "name": "Road 3-5"}),
            (4, 5, {"length": 230, "travel_time": 23, "name": "Road 4-5"}),
            (5, 6, {"length": 210, "travel_time": 21, "name": "Road 5-6"})
        ]
        G.add_edges_from(edges)
        
        return G
    
    @staticmethod
    def create_complex_test_graph():
        """
        Create a large test graph for complex traffic testing.
        This graph has 10 intersections with multiple paths and potential bottlenecks.
        """
        G = nx.Graph()
        
        # Add nodes (intersections)
        nodes = [
            (1, {"y": 40.7128, "x": -74.0060}),  # Node 1
            (2, {"y": 40.7142, "x": -74.0050}),  # Node 2
            (3, {"y": 40.7150, "x": -74.0070}),  # Node 3
            (4, {"y": 40.7135, "x": -74.0080}),  # Node 4
            (5, {"y": 40.7160, "x": -74.0065}),  # Node 5
            (6, {"y": 40.7145, "x": -74.0055}),  # Node 6
            (7, {"y": 40.7155, "x": -74.0075}),  # Node 7
            (8, {"y": 40.7130, "x": -74.0090}),  # Node 8
            (9, {"y": 40.7170, "x": -74.0045}),  # Node 9
            (10, {"y": 40.7125, "x": -74.0030})  # Node 10
        ]
        G.add_nodes_from(nodes)
        
        # Add edges (roads)
        edges = [
            (1, 2, {"length": 200, "travel_time": 20, "name": "Road 1-2"}),
            (1, 3, {"length": 300, "travel_time": 30, "name": "Road 1-3"}),
            (1, 4, {"length": 250, "travel_time": 25, "name": "Road 1-4"}),
            (2, 3, {"length": 150, "travel_time": 15, "name": "Road 2-3"}),
            (2, 6, {"length": 220, "travel_time": 22, "name": "Road 2-6"}),
            (2, 10, {"length": 280, "travel_time": 28, "name": "Road 2-10"}),
            (3, 5, {"length": 180, "travel_time": 18, "name": "Road 3-5"}),
            (3, 7, {"length": 160, "travel_time": 16, "name": "Road 3-7"}),
            (4, 5, {"length": 230, "travel_time": 23, "name": "Road 4-5"}),
            (4, 8, {"length": 190, "travel_time": 19, "name": "Road 4-8"}),
            (5, 6, {"length": 210, "travel_time": 21, "name": "Road 5-6"}),
            (5, 9, {"length": 240, "travel_time": 24, "name": "Road 5-9"}),
            (6, 9, {"length": 270, "travel_time": 27, "name": "Road 6-9"}),
            (6, 10, {"length": 260, "travel_time": 26, "name": "Road 6-10"}),
            (7, 9, {"length": 200, "travel_time": 20, "name": "Road 7-9"}),
            (8, 10, {"length": 310, "travel_time": 31, "name": "Road 8-10"})
        ]
        G.add_edges_from(edges)
        
        return G
    
    @staticmethod
    def get_basic_test_incident():
        """
        Create a test incident for the basic test graph.
        """
        return Incident(
            road_id="1-2",
            severity=0.5,
            description="Test incident on Road 1-2"
        )
    
    @staticmethod
    def get_dynamic_test_incidents():
        """
        Create test incidents for the dynamic test graph.
        """
        return [
            Incident(
                road_id="1-2",
                severity=0.7,
                description="Major accident on Road 1-2"
            )
        ]
    
    @staticmethod
    def get_complex_test_incidents():
        """
        Create multiple test incidents for the complex test graph.
        """
        return [
            Incident(
                road_id="1-2",
                severity=0.8,
                description="Major accident on Road 1-2"
            ),
            Incident(
                road_id="5-6",
                severity=0.5,
                description="Construction on Road 5-6"
            ),
            Incident(
                road_id="3-7",
                severity=0.3,
                description="Minor incident on Road 3-7"
            )
        ]

@pytest.fixture
def basic_test_graph():
    """Fixture for basic test graph"""
    return TestFixtures.create_basic_test_graph()

@pytest.fixture
def dynamic_test_graph():
    """Fixture for dynamic test graph"""
    return TestFixtures.create_dynamic_test_graph()

@pytest.fixture
def complex_test_graph():
    """Fixture for complex test graph"""
    return TestFixtures.create_complex_test_graph()

@pytest.fixture
def basic_test_incident():
    """Fixture for basic test incident"""
    return TestFixtures.get_basic_test_incident()

@pytest.fixture
def dynamic_test_incidents():
    """Fixture for dynamic test incidents"""
    return TestFixtures.get_dynamic_test_incidents()

@pytest.fixture
def complex_test_incidents():
    """Fixture for complex test incidents"""
    return TestFixtures.get_complex_test_incidents()
