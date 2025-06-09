"""
Script to run the three test cases and capture screenshots.
"""

import os
import sys
import time
import json
import requests
from pathlib import Path
import matplotlib.pyplot as plt
import networkx as nx
import numpy as np

# Add the parent directory to the path so we can import the app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from fastapi.testclient import TestClient

# Create a test client
client = TestClient(app)

# Create a directory for screenshots
screenshots_dir = Path("docs/screenshots")
screenshots_dir.mkdir(parents=True, exist_ok=True)

def plot_network(data, title, filename):
    """Plot a network from simulation data and save as an image."""
    # Create a new figure
    plt.figure(figsize=(12, 8))
    
    # Create a graph
    G = nx.Graph()
    
    # Extract nodes and edges from routes
    nodes = {}
    edges = []
    
    # Process routes to extract nodes and edges
    for route in data['routes']:
        if route.get('waypoints'):
            for waypoint in route['waypoints']:
                if waypoint.get('node_id') and waypoint.get('latitude') and waypoint.get('longitude'):
                    node_id = waypoint['node_id']
                    nodes[node_id] = {
                        'id': node_id,
                        'pos': (waypoint['longitude'], waypoint['latitude'])
                    }
        
        if route.get('path') and len(route['path']) > 1:
            for i in range(len(route['path']) - 1):
                source = route['path'][i]
                target = route['path'][i + 1]
                edge_id = f"{source}-{target}"
                edges.append({
                    'id': edge_id,
                    'source': source,
                    'target': target,
                    'has_incident': False
                })
    
    # Mark edges with incidents
    for incident in data['incidents']:
        for edge in edges:
            if edge['id'] == incident['road_id'] or edge['id'] == f"{incident['road_id'].split('-')[1]}-{incident['road_id'].split('-')[0]}":
                edge['has_incident'] = True
    
    # Add nodes to the graph
    for node_id, node_data in nodes.items():
        G.add_node(node_id, pos=node_data['pos'])
    
    # Add edges to the graph
    for edge in edges:
        G.add_edge(edge['source'], edge['target'], has_incident=edge['has_incident'])
    
    # Get node positions
    pos = nx.get_node_attributes(G, 'pos')
    
    # Draw the network
    plt.title(title)
    
    # Draw edges
    normal_edges = [(u, v) for u, v, d in G.edges(data=True) if not d['has_incident']]
    incident_edges = [(u, v) for u, v, d in G.edges(data=True) if d['has_incident']]
    
    nx.draw_networkx_edges(G, pos, edgelist=normal_edges, width=1.5, alpha=0.7, edge_color='blue')
    nx.draw_networkx_edges(G, pos, edgelist=incident_edges, width=2.5, alpha=0.9, edge_color='red')
    
    # Draw nodes
    nx.draw_networkx_nodes(G, pos, node_size=100, node_color='lightblue', alpha=0.8)
    
    # Draw labels
    nx.draw_networkx_labels(G, pos, font_size=8, font_family='sans-serif')
    
    # Draw routes
    for i, route in enumerate(data['routes']):
        if route.get('path') and len(route['path']) > 1:
            route_edges = []
            for j in range(len(route['path']) - 1):
                route_edges.append((route['path'][j], route['path'][j + 1]))
            
            # Use a different color for each route
            colors = ['green', 'orange', 'purple', 'brown', 'pink', 'gray', 'olive', 'cyan']
            color = colors[i % len(colors)]
            
            nx.draw_networkx_edges(G, pos, edgelist=route_edges, width=2.0, alpha=0.6, edge_color=color, style='dashed')
    
    # Add a legend
    plt.plot([], [], 'b-', linewidth=1.5, label='Normal Road')
    plt.plot([], [], 'r-', linewidth=2.5, label='Incident Road')
    plt.plot([], [], 'g--', linewidth=2.0, label='Route')
    plt.legend(loc='best')
    
    # Remove axis
    plt.axis('off')
    
    # Save the figure
    plt.savefig(screenshots_dir / filename, dpi=300, bbox_inches='tight')
    plt.close()

def capture_basic_test():
    """Run the basic test and capture a screenshot."""
    print("Running Basic Functionality Test...")
    
    # Run the basic simulation
    response = client.post("/simulate/basic")
    assert response.status_code == 200
    
    # Save the response data
    data = response.json()
    with open(screenshots_dir / "basic_test_data.json", "w") as f:
        json.dump(data, f, indent=2)
    
    # Plot the network
    plot_network(data, "Basic Functionality Test", "basic_test.png")
    
    print("Basic Functionality Test completed and screenshot saved.")

def capture_dynamic_test():
    """Run the dynamic test and capture a screenshot."""
    print("Running Dynamic Traffic & Rerouting Test...")
    
    # Create an incident
    incident = {
        "road_id": "1-2",
        "severity": 0.7,
        "description": "Major accident on Road 1-2"
    }
    
    # Run the dynamic simulation
    response = client.post("/simulate/dynamic", json=incident)
    assert response.status_code == 200
    
    # Save the response data
    data = response.json()
    with open(screenshots_dir / "dynamic_test_data.json", "w") as f:
        json.dump(data, f, indent=2)
    
    # Plot the network
    plot_network(data, "Dynamic Traffic & Rerouting Test", "dynamic_test.png")
    
    print("Dynamic Traffic & Rerouting Test completed and screenshot saved.")

def capture_complex_test():
    """Run the complex test and capture a screenshot."""
    print("Running Complexity & Optimization Test...")
    
    # Create multiple incidents
    request = {
        "duration": 600,
        "incidents": [
            {
                "road_id": "1-2",
                "severity": 0.8,
                "description": "Major accident on Road 1-2"
            },
            {
                "road_id": "3-5",
                "severity": 0.5,
                "description": "Construction on Road 3-5"
            },
            {
                "road_id": "6-10",
                "severity": 0.3,
                "description": "Minor incident on Road 6-10"
            }
        ],
        "vehicles_count": 20
    }
    
    # Run the complex simulation
    response = client.post("/simulate/complex", json=request)
    assert response.status_code == 200
    
    # Save the response data
    data = response.json()
    with open(screenshots_dir / "complex_test_data.json", "w") as f:
        json.dump(data, f, indent=2)
    
    # Plot the network
    plot_network(data, "Complexity & Optimization Test", "complex_test.png")
    
    print("Complexity & Optimization Test completed and screenshot saved.")

if __name__ == "__main__":
    print("Capturing screenshots for the three test cases...")
    
    # Run the tests and capture screenshots
    capture_basic_test()
    capture_dynamic_test()
    capture_complex_test()
    
    print("All screenshots captured and saved to the 'docs/screenshots' directory.")
