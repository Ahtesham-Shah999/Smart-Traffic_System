import networkx as nx
import random
from typing import Dict, List, Any, Optional
import heapq
import numpy as np
from app.services.network_service import NetworkService

class SimulationService:
    def __init__(self):
        self.network_service = NetworkService()
        self.current_simulation = None

    def run_basic_simulation(self):
        """
        Run a basic simulation with default timings & routes for static light traffic
        """
        # Ensure we have a network
        if self.network_service.current_graph is None:
            self.network_service.get_sample_network()

        G = self.network_service.current_graph

        # Generate traffic light timings for each intersection
        traffic_lights = self._generate_default_traffic_light_timings(G)

        # Generate a few random routes
        routes = self._generate_random_routes(G, 5)

        # Store the current simulation
        self.current_simulation = {
            "traffic_lights": traffic_lights,
            "routes": routes,
            "incidents": []
        }

        return self.current_simulation

    def run_dynamic_simulation(self, incident):
        """
        Run a dynamic simulation with an incident, returning updated timings & alternative routes
        """
        # Ensure we have a network
        if self.network_service.current_graph is None:
            self.network_service.get_sample_network()

        G = self.network_service.current_graph.copy()

        # Apply the incident to the graph
        self._apply_incident(G, incident)

        # Generate adaptive traffic light timings
        traffic_lights = self._generate_adaptive_traffic_light_timings(G, [incident])

        # Generate routes that avoid the incident
        routes = self._generate_routes_avoiding_incidents(G, 5, [incident])

        # Store the current simulation
        self.current_simulation = {
            "traffic_lights": traffic_lights,
            "routes": routes,
            "incidents": [incident.dict()]
        }

        return self.current_simulation

    def run_complex_simulation(self, duration, incidents, vehicles_count):
        """
        Run a complex simulation with multiple incidents & concurrent vehicles
        """
        # Ensure we have a network
        if self.network_service.current_graph is None:
            self.network_service.get_sample_network()

        G = self.network_service.current_graph.copy()

        # Apply all incidents to the graph
        for incident in incidents:
            self._apply_incident(G, incident)

        # Generate adaptive traffic light timings
        traffic_lights = self._generate_adaptive_traffic_light_timings(G, incidents)

        # Generate routes for multiple vehicles
        routes = self._generate_routes_avoiding_incidents(G, vehicles_count, incidents)

        # Store the current simulation
        self.current_simulation = {
            "traffic_lights": traffic_lights,
            "routes": routes,
            "incidents": [incident.dict() for incident in incidents],
            "duration": duration
        }

        return self.current_simulation

    def run_square_intersection_simulation(self, vehicles_count=10, with_incident=False):
        """
        Run a simulation with a square intersection (chock) with traffic signals
        """
        # Get the square intersection network
        self.network_service.get_square_intersection_network()
        G = self.network_service.current_graph.copy()

        # Create an incident if requested
        incidents = []
        if with_incident:
            # Create an incident on one of the square edges (e.g., the north road)
            from app.api.simulation import Incident
            incident = Incident(
                road_id="1-2",  # North road of the square
                severity=0.8,   # High severity to force rerouting
                description="Traffic accident on North Road"
            )
            incidents.append(incident)
            self._apply_incident(G, incident)

        # Generate traffic light timings for the square intersection
        # For a square intersection, we want coordinated traffic lights
        traffic_lights = self._generate_square_intersection_traffic_lights(G, incidents)

        # Generate routes through the square
        routes = self._generate_square_intersection_routes(G, vehicles_count, incidents)

        # Store the current simulation
        self.current_simulation = {
            "traffic_lights": traffic_lights,
            "routes": routes,
            "incidents": [incident.dict() for incident in incidents] if incidents else [],
            "duration": 300  # 5 minutes simulation
        }

        return self.current_simulation

    def _generate_square_intersection_traffic_lights(self, G, incidents):
        """
        Generate coordinated traffic light timings for a square intersection
        """
        traffic_lights = []

        # For a square intersection, we want to coordinate the traffic lights
        # to create a green wave in one direction and then the other

        # First, identify the square nodes (1, 2, 3, 4 in our case)
        square_nodes = [1, 2, 3, 4]

        # Check if there are incidents affecting the square
        affected_roads = []
        for incident in incidents:
            road_parts = incident.road_id.split("-")
            if int(road_parts[0]) in square_nodes and int(road_parts[1]) in square_nodes:
                affected_roads.append(incident.road_id)

        # For each node in the square
        for node in square_nodes:
            # Get all edges connected to this node
            edges = list(G.edges(node))

            # Separate square edges from external edges
            square_edges = []
            external_edges = []

            for edge in edges:
                if edge[1] in square_nodes:
                    square_edges.append(edge)
                else:
                    external_edges.append(edge)

            # Combine all edges
            all_edges = square_edges + external_edges

            # Create light cycles
            light_cycles = []
            current_time = 0

            # First, give green to square edges
            for edge in square_edges:
                road_id = f"{edge[0]}-{edge[1]}"

                # Check if this road has an incident
                if road_id in affected_roads:
                    green_time = 15  # Shorter green time for affected roads
                else:
                    green_time = 30  # Normal green time

                light_cycles.append({
                    "road_id": road_id,
                    "green_start": current_time,
                    "green_duration": green_time,
                    "yellow_duration": 5
                })
                current_time += green_time + 5  # green + yellow

            # Then, give green to external edges
            for edge in external_edges:
                road_id = f"{edge[0]}-{edge[1]}"

                light_cycles.append({
                    "road_id": road_id,
                    "green_start": current_time,
                    "green_duration": 20,  # Shorter green time for external roads
                    "yellow_duration": 5
                })
                current_time += 20 + 5  # green + yellow

            # Add the traffic light for this intersection
            traffic_lights.append({
                "intersection_id": str(node),
                "cycles": light_cycles,
                "total_cycle_time": current_time
            })

        return traffic_lights

    def _generate_square_intersection_routes(self, G, count, incidents):
        """
        Generate routes through the square intersection
        """
        # For a square intersection, we want to generate routes that:
        # 1. Go straight through the square
        # 2. Turn at the square
        # 3. Go around the square

        routes = []

        # Define some common paths through the square
        common_paths = [
            # Straight through paths
            [5, 1, 2, 6],  # North to East
            [6, 2, 3, 7],  # East to South
            [7, 3, 4, 8],  # South to West
            [8, 4, 1, 5],  # West to North

            # Turning paths
            [5, 1, 4, 8],  # North to West
            [6, 2, 1, 5],  # East to North
            [7, 3, 2, 6],  # South to East
            [8, 4, 3, 7],  # West to South

            # Around the square paths
            [5, 1, 2, 3, 7],  # North to South via East
            [6, 2, 3, 4, 8],  # East to West via South
            [7, 3, 4, 1, 5],  # South to North via West
            [8, 4, 1, 2, 6]   # West to East via North
        ]

        # Create a routing graph with incidents applied
        G_routing = G.copy()

        # Generate routes based on common paths
        for i, path in enumerate(common_paths):
            if i >= count:
                break

            # Convert path to strings for consistency
            path_str = [str(node) for node in path]

            # Calculate travel time
            travel_time = 0
            for j in range(len(path) - 1):
                u, v = path[j], path[j+1]
                edge_time = G[u][v]['travel_time']

                # Check if this edge has an incident
                edge_id = f"{u}-{v}"
                for incident in incidents:
                    if incident.road_id == edge_id:
                        # Apply incident effect to travel time
                        if incident.severity >= 0.99:
                            # Find alternative path around the incident
                            try:
                                # Remove the edge with the incident
                                G_temp = G_routing.copy()
                                G_temp.remove_edge(u, v)

                                # Find alternative path
                                alt_path = nx.shortest_path(G_temp, source=u, target=v, weight='travel_time')

                                # Calculate alternative path time
                                alt_time = sum(G_temp[alt_path[k]][alt_path[k+1]]['travel_time'] for k in range(len(alt_path)-1))
                                edge_time = alt_time
                            except:
                                edge_time = float('inf')
                        else:
                            edge_time = edge_time / (1 - incident.severity)
                        break

                travel_time += edge_time

            # Create waypoints
            waypoints = []
            cumulative_time = 0

            for j, node_id in enumerate(path):
                node_data = G.nodes[node_id]

                # Get coordinates
                latitude = node_data.get("y")
                longitude = node_data.get("x")

                # Calculate arrival time
                if j > 0:
                    u, v = path[j-1], path[j]
                    edge_time = G[u][v]['travel_time']

                    # Check for incidents
                    edge_id = f"{u}-{v}"
                    for incident in incidents:
                        if incident.road_id == edge_id:
                            if incident.severity >= 0.99:
                                edge_time = float('inf')
                            else:
                                edge_time = edge_time / (1 - incident.severity)
                            break

                    cumulative_time += edge_time

                waypoints.append({
                    "node_id": str(node_id),
                    "latitude": latitude,
                    "longitude": longitude,
                    "arrival_time": cumulative_time
                })

            # Add the route
            routes.append({
                "id": f"route-{i+1}",
                "source": path_str[0],
                "target": path_str[-1],
                "path": path_str,
                "travel_time": travel_time,
                "waypoints": waypoints
            })

        # If we need more routes, generate some random ones
        if len(routes) < count:
            additional_routes = self._generate_routes_avoiding_incidents(
                G, count - len(routes), incidents
            )
            routes.extend(additional_routes)

        return routes

    def _generate_default_traffic_light_timings(self, G):
        """
        Generate default traffic light timings for each intersection
        """
        traffic_lights = []

        for node, degree in G.degree():
            if degree > 1:  # Only intersections with multiple roads need traffic lights
                # Default timing: 30 seconds green, 5 seconds yellow, 30 seconds red
                # For each incoming road
                incoming_roads = list(G.edges(node))

                light_cycles = []
                cycle_time = 35  # 30 green + 5 yellow

                for i, road in enumerate(incoming_roads):
                    start_time = i * cycle_time
                    light_cycles.append({
                        "road_id": f"{road[0]}-{road[1]}",
                        "green_start": start_time,
                        "green_duration": 30,
                        "yellow_duration": 5
                    })

                traffic_lights.append({
                    "intersection_id": str(node),
                    "cycles": light_cycles,
                    "total_cycle_time": len(incoming_roads) * cycle_time
                })

        return traffic_lights

    def _generate_adaptive_traffic_light_timings(self, G, incidents):
        """
        Generate adaptive traffic light timings based on incidents
        """
        traffic_lights = []

        # Get affected intersections (those connected to roads with incidents)
        affected_intersections = set()
        for incident in incidents:
            road_parts = incident.road_id.split("-")
            affected_intersections.add(road_parts[0])
            affected_intersections.add(road_parts[1])

        for node, degree in G.degree():
            if degree > 1:  # Only intersections with multiple roads need traffic lights
                incoming_roads = list(G.edges(node))

                light_cycles = []

                # Check if this intersection is affected by an incident
                is_affected = str(node) in affected_intersections

                # Adjust cycle times based on whether the intersection is affected
                if is_affected:
                    # Prioritize roads that don't have incidents
                    incident_roads = [inc.road_id for inc in incidents]

                    # Sort roads: non-incident roads first
                    sorted_roads = []
                    for road in incoming_roads:
                        road_id = f"{road[0]}-{road[1]}"
                        if road_id not in incident_roads:
                            sorted_roads.append((road, 45))  # Longer green time for non-incident roads
                        else:
                            sorted_roads.append((road, 15))  # Shorter green time for incident roads

                    # Create light cycles
                    current_time = 0
                    for road, green_time in sorted_roads:
                        light_cycles.append({
                            "road_id": f"{road[0]}-{road[1]}",
                            "green_start": current_time,
                            "green_duration": green_time,
                            "yellow_duration": 5
                        })
                        current_time += green_time + 5  # green + yellow

                    total_cycle_time = current_time
                else:
                    # Default timing for non-affected intersections
                    cycle_time = 35  # 30 green + 5 yellow

                    for i, road in enumerate(incoming_roads):
                        start_time = i * cycle_time
                        light_cycles.append({
                            "road_id": f"{road[0]}-{road[1]}",
                            "green_start": start_time,
                            "green_duration": 30,
                            "yellow_duration": 5
                        })

                    total_cycle_time = len(incoming_roads) * cycle_time

                traffic_lights.append({
                    "intersection_id": str(node),
                    "cycles": light_cycles,
                    "total_cycle_time": total_cycle_time
                })

        return traffic_lights

    def _generate_random_routes(self, G, count):
        """
        Generate random routes in the graph
        """
        routes = []
        nodes = list(G.nodes())

        for _ in range(count):
            if len(nodes) < 2:
                continue

            source = random.choice(nodes)
            target = random.choice([n for n in nodes if n != source])

            try:
                # Find shortest path
                path = nx.shortest_path(G, source=source, target=target, weight='travel_time')

                # Calculate total travel time
                travel_time = sum(G[path[i]][path[i+1]]['travel_time'] for i in range(len(path)-1))

                # Create route with waypoints
                waypoints = []
                cumulative_time = 0

                for i in range(len(path)):
                    node_data = G.nodes[path[i]]

                    # Ensure we have valid coordinates
                    latitude = node_data.get("y")
                    longitude = node_data.get("x")

                    # If coordinates are missing, generate some based on the node index
                    if latitude is None or longitude is None:
                        # Generate deterministic coordinates based on node ID
                        # This ensures the same node always gets the same coordinates
                        node_id_num = int(path[i]) if str(path[i]).isdigit() else hash(str(path[i])) % 1000
                        latitude = 40.7128 + (node_id_num % 10) * 0.01  # Around NYC latitude
                        longitude = -74.0060 + (node_id_num // 10) * 0.01  # Around NYC longitude

                    # Calculate arrival time
                    if i > 0:
                        edge_time = G[path[i-1]][path[i]]['travel_time']
                        cumulative_time += edge_time

                    waypoints.append({
                        "node_id": str(path[i]),
                        "latitude": latitude,
                        "longitude": longitude,
                        "arrival_time": cumulative_time
                    })

                routes.append({
                    "id": f"route-{len(routes)+1}",
                    "source": str(source),
                    "target": str(target),
                    "path": [str(node) for node in path],
                    "travel_time": travel_time,
                    "waypoints": waypoints
                })
            except nx.NetworkXNoPath:
                # No path exists, try another pair
                continue

        return routes

    def _generate_routes_avoiding_incidents(self, G, count, incidents):
        """
        Generate routes that avoid roads with incidents
        """
        G_routing = G.copy()
        for incident in incidents:
            road_parts = incident.road_id.split("-")
            u, v = int(road_parts[0]), int(road_parts[1])
            if G_routing.has_edge(u, v):
                G_routing.remove_edge(u, v)
        routes = []
        nodes = list(G.nodes())
        for _ in range(count):
            if len(nodes) < 2:
                continue
            source = random.choice(nodes)
            target = random.choice([n for n in nodes if n != source])
            try:
                path = nx.shortest_path(G_routing, source=source, target=target, weight='travel_time')
                travel_time = 0
                for i in range(len(path)-1):
                    u, v = path[i], path[i+1]
                    edge_time = G[u][v]['travel_time']
                    travel_time += edge_time
                waypoints = []
                cumulative_time = 0
                for i in range(len(path)):
                    node_data = G.nodes[path[i]]
                    latitude = node_data.get("y")
                    longitude = node_data.get("x")
                    if latitude is None or longitude is None:
                        node_id_num = int(path[i]) if str(path[i]).isdigit() else hash(str(path[i])) % 1000
                        latitude = 40.7128 + (node_id_num % 10) * 0.01
                        longitude = -74.0060 + (node_id_num // 10) * 0.01
                    if i > 0:
                        u, v = path[i-1], path[i]
                        edge_time = G[u][v]['travel_time']
                        cumulative_time += edge_time
                    waypoints.append({
                        "node_id": str(path[i]),
                        "latitude": latitude,
                        "longitude": longitude,
                        "arrival_time": cumulative_time
                    })
                routes.append({
                    "id": f"route-{len(routes)+1}",
                    "source": str(source),
                    "target": str(target),
                    "path": [str(node) for node in path],
                    "travel_time": travel_time,
                    "waypoints": waypoints
                })
            except nx.NetworkXNoPath:
                continue
        return routes

    def _apply_incident(self, G, incident):
        """
        Apply an incident to the graph by updating edge weights
        """
        road_parts = incident.road_id.split("-")
        u, v = int(road_parts[0]), int(road_parts[1])
        if G.has_edge(u, v):
            original_time = G[u][v]['travel_time']
            if incident.severity >= 0.99:
                G[u][v]['travel_time'] = float('inf')
            else:
                G[u][v]['travel_time'] = original_time / (1 - incident.severity)
            G[u][v]['has_incident'] = True
            G[u][v]['incident_severity'] = incident.severity
            G[u][v]['incident_description'] = incident.description
