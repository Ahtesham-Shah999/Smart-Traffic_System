import osmnx as ox
import networkx as nx
import geojson
from types import SimpleNamespace

class NetworkService:
    def __init__(self):
        self.current_graph = None
        self.current_geojson = None

    def get_network(self, bbox):
        north = bbox.max_y
        south = bbox.min_y
        east = bbox.max_x
        west = bbox.min_x
        G = ox.graph_from_bbox(bbox=(north, south, east, west), network_type="drive")
        G_undirected = ox.utils_graph.get_undirected(G)
        for u, v, data in G_undirected.edges(data=True):
            speed_kph = data.get("speed_kph", 50)
            length_m = data.get("length", 100)
            travel_time = (length_m / 1000) / (speed_kph / 60)  # in minutes
            data["travel_time"] = travel_time
        self.current_graph = G_undirected
        self.current_geojson = self._graph_to_geojson(G_undirected)
        return self.current_geojson

    def get_sample_network(self):
        # Return a small, hardcoded sample network (no OSMnx, always fast)
        G = nx.Graph()
        nodes = [
            (1, {"y": 31.5200, "x": 74.3587}),
            (2, {"y": 31.5210, "x": 74.3592}),
            (3, {"y": 31.5215, "x": 74.3600}),
            (4, {"y": 31.5220, "x": 74.3607}),
        ]
        G.add_nodes_from(nodes)
        edges = [
            (1, 2, {"length": 100, "travel_time": 10, "name": "Satyana Road"}),
            (2, 3, {"length": 120, "travel_time": 12, "name": "Salemi Chowk Road"}),
            (3, 4, {"length": 140, "travel_time": 14, "name": "Satyana Road"}),
            (1, 3, {"length": 160, "travel_time": 16, "name": "Link Road"}),
        ]
        G.add_edges_from(edges)
        self.current_graph = G
        self.current_geojson = self._graph_to_geojson(G)
        return self.current_geojson

    def get_faisalabad_satyana_road_map(self):
        G = nx.Graph()
        nodes = [
            (1, {"y": 31.4220, "x": 73.0730}),
            (2, {"y": 31.4230, "x": 73.0750}),
            (3, {"y": 31.4240, "x": 73.0770}),
            (4, {"y": 31.4235, "x": 73.0780}),
        ]
        G.add_nodes_from(nodes)
        edges = [
            (1, 2, {"length": 150, "travel_time": 15, "name": "Satyana Road"}),
            (2, 3, {"length": 120, "travel_time": 12, "name": "Salemi Chowk Road"}),
            (3, 4, {"length": 100, "travel_time": 10, "name": "Satyana Road"}),
            (2, 4, {"length": 80, "travel_time": 8, "name": "Link Road"}),
        ]
        G.add_edges_from(edges)
        self.current_graph = G
        self.current_geojson = self._graph_to_geojson(G)
        return self.current_geojson

    def _graph_to_geojson(self, G):
        features = []
        for node, data in G.nodes(data=True):
            point = geojson.Point((data.get("x", 0), data.get("y", 0)))
            features.append(geojson.Feature(geometry=point, properties={
                "id": str(node), "type": "intersection"
            }))
        for u, v, data in G.edges(data=True):
            u_data = G.nodes[u]
            v_data = G.nodes[v]
            coords = [
                (u_data.get("x", 0), u_data.get("y", 0)),
                (v_data.get("x", 0), v_data.get("y", 0))
            ]
            features.append(geojson.Feature(geometry=geojson.LineString(coords), properties={
                "id": f"{u}-{v}",
                "source": str(u),
                "target": str(v),
                "length": data.get("length", 0),
                "travel_time": data.get("travel_time", 0),
                "name": data.get("name", "Unknown Road"),
                "type": "road"
            }))
        return geojson.FeatureCollection(features)

# Initialize the service (singleton style)
network_service = NetworkService()
