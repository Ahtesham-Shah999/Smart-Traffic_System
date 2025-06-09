import { useRef, useEffect, useState } from 'react'
import Map, { Source, Layer } from 'react-map-gl'

// Note: You'll need to get a Mapbox token and replace 'YOUR_MAPBOX_TOKEN' below
// For development, we'll use a fallback rendering when token is not available
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNrbTUwbnAyNjBrMnAyb3BsajlsOGRlNmIifQ.xFwkYMx3V-7QVZ1Z4-zNrA'

const MapView = ({ networkData }) => {
  const mapRef = useRef(null)
  const [viewState, setViewState] = useState({
    longitude: -74.0060,
    latitude: 40.7128,
    zoom: 14
  })

  useEffect(() => {
    if (networkData && networkData.features && networkData.features.length > 0) {
      // Find the first node to center the map
      const nodeFeature = networkData.features.find(f => f.properties.type === 'intersection')

      if (nodeFeature && nodeFeature.geometry && nodeFeature.geometry.coordinates) {
        const [longitude, latitude] = nodeFeature.geometry.coordinates

        setViewState({
          longitude,
          latitude,
          zoom: 15
        })
      }
    }
  }, [networkData])

  // Layer styles - updated for dark theme
  const nodeLayer = {
    id: 'nodes',
    type: 'circle',
    paint: {
      'circle-radius': 6,
      'circle-color': '#3B82F6', // Bright blue for better visibility on dark
      'circle-stroke-width': 2,
      'circle-stroke-color': '#1F2937' // Dark stroke
    },
    filter: ['==', ['get', 'type'], 'intersection']
  }

  const edgeLayer = {
    id: 'edges',
    type: 'line',
    paint: {
      'line-width': 3,
      'line-color': '#60A5FA' // Slightly lighter blue for roads
    },
    filter: ['==', ['get', 'type'], 'road']
  }

  // Simple fallback rendering of the network when Mapbox is not available
  const renderNetworkFallback = () => {
    if (!networkData || !networkData.features) return null;

    const width = 800;
    const height = 600;
    const padding = 50;

    // Extract nodes and edges
    const nodes = networkData.features.filter(f => f.properties.type === 'intersection');
    const edges = networkData.features.filter(f => f.properties.type === 'road');

    // Calculate bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    nodes.forEach(node => {
      const [x, y] = node.geometry.coordinates;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });

    // Scale factor
    const scaleX = (width - 2 * padding) / (maxX - minX || 1);
    const scaleY = (height - 2 * padding) / (maxY - minY || 1);

    // Transform coordinates
    const transformX = x => padding + (x - minX) * scaleX;
    const transformY = y => height - padding - (y - minY) * scaleY;

    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-100">Network Visualization</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs text-gray-300">Intersection</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-blue-400 mr-2"></div>
              <span className="text-xs text-gray-300">Road</span>
            </div>
          </div>
        </div>

        <svg width={width} height={height} className="border border-gray-700 rounded-lg bg-gray-900 shadow-inner">
          {/* Background grid */}
          <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)"/>
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Render edges */}
          {edges.map((edge, i) => {
            const sourceId = edge.properties.source;
            const targetId = edge.properties.target;

            const sourceNode = nodes.find(n => n.properties.id === sourceId);
            const targetNode = nodes.find(n => n.properties.id === targetId);

            if (!sourceNode || !targetNode) return null;

            const [x1, y1] = sourceNode.geometry.coordinates;
            const [x2, y2] = targetNode.geometry.coordinates;

            return (
              <g key={`edge-${i}`}>
                <line
                  x1={transformX(x1)}
                  y1={transformY(y1)}
                  x2={transformX(x2)}
                  y2={transformY(y2)}
                  stroke="#60A5FA"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <text
                  x={(transformX(x1) + transformX(x2)) / 2}
                  y={(transformY(y1) + transformY(y2)) / 2 - 5}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#D1D5DB"
                >
                  {edge.properties.name || `Road ${i+1}`}
                </text>
              </g>
            );
          })}

          {/* Render nodes */}
          {nodes.map((node, i) => {
            const [x, y] = node.geometry.coordinates;

            return (
              <g key={`node-${i}`}>
                <circle
                  cx={transformX(x)}
                  cy={transformY(y)}
                  r="8"
                  fill="#3B82F6"
                  stroke="#1F2937"
                  strokeWidth="2"
                />
                <text
                  x={transformX(x)}
                  y={transformY(y) + 20}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#D1D5DB"
                >
                  {node.properties.id}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Showing {nodes.length} intersections and {edges.length} roads</p>
        </div>
      </div>
    );
  };

  // Try to use Mapbox if token is valid, otherwise fall back to simple SVG rendering
  const useMapboxFallback = MAPBOX_TOKEN === 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNrbTUwbnAyNjBrMnAyb3BsajlsOGRlNmIifQ.xFwkYMx3V-7QVZ1Z4-zNrA';

  return (
    <div className="w-full h-full flex items-center justify-center">
      {useMapboxFallback ? (
        renderNetworkFallback()
      ) : (
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/dark-v11" // Using dark map style
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {networkData && (
            <Source type="geojson" data={networkData}>
              <Layer {...nodeLayer} />
              <Layer {...edgeLayer} />
            </Source>
          )}
        </Map>
      )}
    </div>
  )
}

export default MapView