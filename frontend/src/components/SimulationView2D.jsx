import { useState, useEffect, useMemo } from 'react'

const SimulationView2D = ({ simulationData, isPaused, speed }) => {
  const [simulationTime, setSimulationTime] = useState(0)

  // Update simulation time based on speed and pause state
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setSimulationTime(prev => prev + 0.1 * speed)
    }, 100)

    return () => clearInterval(interval)
  }, [isPaused, speed])

  // Reset simulation time when data changes
  useEffect(() => {
    setSimulationTime(0)
  }, [simulationData])

  // Calculate traffic light states based on simulation time
  const trafficLightStates = useMemo(() => {
    if (!simulationData || !simulationData.traffic_lights) return new Map();

    const states = new Map();

    simulationData.traffic_lights.forEach(light => {
      const intersectionId = light.intersection_id;
      const cycles = light.cycles;
      const totalCycleTime = light.total_cycle_time;

      // Calculate current time within the cycle
      const cycleTime = simulationTime % totalCycleTime;

      // Determine which road has green/yellow/red light
      cycles.forEach(cycle => {
        const roadId = cycle.road_id;
        const greenStart = cycle.green_start;
        const greenEnd = greenStart + cycle.green_duration;
        const yellowEnd = greenEnd + cycle.yellow_duration;

        let state = 'red';
        if (cycleTime >= greenStart && cycleTime < greenEnd) {
          state = 'green';
        } else if (cycleTime >= greenEnd && cycleTime < yellowEnd) {
          state = 'yellow';
        }

        // Store the state for this road at this intersection
        if (!states.has(intersectionId)) {
          states.set(intersectionId, new Map());
        }
        states.get(intersectionId).set(roadId, state);
      });
    });

    return states;
  }, [simulationData, simulationTime]);

  if (!simulationData || !simulationData.routes || simulationData.routes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Simulation Data</h3>
          <p className="text-gray-600 mb-4">Run a simulation using the controls on the right.</p>
          <div className="flex justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have valid routes with waypoints
  const hasValidRoutes = simulationData.routes &&
                        simulationData.routes.length > 0 &&
                        simulationData.routes.some(r => r.waypoints && r.waypoints.length > 0);

  if (!hasValidRoutes) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Invalid Simulation Data</h3>
          <p className="text-gray-600 mb-4">The simulation data doesn't contain valid routes with waypoints.</p>
          <pre className="text-left text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(simulationData, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  // Extract nodes and edges from routes
  const nodes = new Map();
  const edges = [];

  // Process routes to extract nodes and edges
  simulationData.routes.forEach(route => {
    if (route.waypoints) {
      route.waypoints.forEach(waypoint => {
        if (waypoint.node_id && waypoint.latitude !== undefined && waypoint.longitude !== undefined) {
          nodes.set(waypoint.node_id, {
            id: waypoint.node_id,
            x: waypoint.longitude,
            y: waypoint.latitude
          });
        }
      });
    }

    if (route.path && route.path.length > 1) {
      for (let i = 0; i < route.path.length - 1; i++) {
        const source = route.path[i];
        const target = route.path[i + 1];
        // Add a unique index to each edge
        const edgeIndex = edges.length;
        edges.push({
          id: `${source}-${target}`,
          source,
          target,
          index: edgeIndex, // Add index for unique key generation
          hasIncident: simulationData.incidents?.some(inc => inc.road_id === `${source}-${target}`) || false
        });
      }
    }
  });

  // Calculate bounds for scaling
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodes.forEach(node => {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x);
    maxY = Math.max(maxY, node.y);
  });

  const width = 800;
  const height = 600;
  const padding = 40;

  // Scale factors
  const scaleX = (width - 2 * padding) / (maxX - minX || 1);
  const scaleY = (height - 2 * padding) / (maxY - minY || 1);

  // Transform functions
  const transformX = x => padding + (x - minX) * scaleX;
  const transformY = y => height - padding - (y - minY) * scaleY;

  // Calculate vehicle positions based on simulation time and traffic lights
  const getVehiclePosition = (route) => {
    if (!route.waypoints || route.waypoints.length < 2) return null;

    // Find the waypoints before and after the current time
    let startIndex = 0;
    for (let i = 0; i < route.waypoints.length - 1; i++) {
      if (
        simulationTime >= route.waypoints[i].arrival_time &&
        simulationTime < route.waypoints[i + 1].arrival_time
      ) {
        startIndex = i;
        break;
      }
    }

    // If we're past the last waypoint, stay at the last position
    if (simulationTime >= route.waypoints[route.waypoints.length - 1].arrival_time) {
      const lastWaypoint = route.waypoints[route.waypoints.length - 1];
      return {
        x: lastWaypoint.longitude,
        y: lastWaypoint.latitude,
        stopped: false
      };
    }

    // Interpolate between waypoints
    const startWaypoint = route.waypoints[startIndex];
    const endWaypoint = route.waypoints[startIndex + 1];

    const startTime = startWaypoint.arrival_time;
    const endTime = endWaypoint.arrival_time;

    // Check if there's a red light on this road segment
    let stopped = false;
    const roadId = `${startWaypoint.node_id}-${endWaypoint.node_id}`;

    // Check if there's a traffic light at the start node and if it's red for this road
    if (trafficLightStates.has(startWaypoint.node_id)) {
      const lightState = trafficLightStates.get(startWaypoint.node_id).get(roadId);

      // If the light is red, stop the vehicle near the intersection
      if (lightState === 'red') {
        // Calculate position 10% along the path from start to end
        const stopT = 0.1;
        const x = startWaypoint.longitude + (endWaypoint.longitude - startWaypoint.longitude) * stopT;
        const y = startWaypoint.latitude + (endWaypoint.latitude - startWaypoint.latitude) * stopT;
        stopped = true;
        return { x, y, stopped };
      }
    }

    // Prevent division by zero
    const timeDiff = endTime - startTime;
    const t = timeDiff > 0 ? (simulationTime - startTime) / timeDiff : 0;

    // Linear interpolation between waypoints
    const x = startWaypoint.longitude + (endWaypoint.longitude - startWaypoint.longitude) * t;
    const y = startWaypoint.latitude + (endWaypoint.latitude - startWaypoint.latitude) * t;

    return { x, y, stopped };
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-700">Traffic Simulation View</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-xs text-gray-600">Intersection</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-blue-300 mr-1"></div>
              <span className="text-xs text-gray-600">Road</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded bg-red-500 mr-1"></div>
              <span className="text-xs text-gray-600">Incident</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
              <span className="text-xs text-gray-600">Vehicle</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-gray-600">Green Light</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-xs text-gray-600">Yellow Light</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span className="text-xs text-gray-600">Red Light</span>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-hidden">
          <svg width={width} height={height} className="border border-gray-200 rounded bg-gray-50 mx-auto">
            {/* Background grid */}
            <defs>
              <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5"/>
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)"/>
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Render edges */}
            {edges.map(edge => {
              const sourceNode = nodes.get(edge.source);
              const targetNode = nodes.get(edge.target);

              if (!sourceNode || !targetNode) return null;

              // Create a unique key for each edge
              const edgeKey = `edge-${edge.source}-${edge.target}-${edge.index}`;

              // Get traffic light state for this edge
              let trafficLightState = null;
              if (trafficLightStates.has(edge.source)) {
                trafficLightState = trafficLightStates.get(edge.source).get(edge.id);
              }

              // Calculate midpoint for traffic light
              const midX = (transformX(sourceNode.x) + transformX(targetNode.x)) / 2;
              const midY = (transformY(sourceNode.y) + transformY(targetNode.y)) / 2;

              // Calculate direction vector for positioning the traffic light
              const dx = transformX(targetNode.x) - transformX(sourceNode.x);
              const dy = transformY(targetNode.y) - transformY(sourceNode.y);
              const length = Math.sqrt(dx * dx + dy * dy);
              const normalizedDx = dx / length;
              const normalizedDy = dy / length;

              // Position traffic light slightly offset from the midpoint
              const trafficLightX = midX - normalizedDy * 10;
              const trafficLightY = midY + normalizedDx * 10;

              // Determine traffic light color
              let trafficLightColor = "#60A5FA"; // Default blue
              if (trafficLightState === 'green') {
                trafficLightColor = "#10B981"; // Green
              } else if (trafficLightState === 'yellow') {
                trafficLightColor = "#F59E0B"; // Yellow
              } else if (trafficLightState === 'red') {
                trafficLightColor = "#EF4444"; // Red
              }

              return (
                <g key={edgeKey}>
                  <line
                    x1={transformX(sourceNode.x)}
                    y1={transformY(sourceNode.y)}
                    x2={transformX(targetNode.x)}
                    y2={transformY(targetNode.y)}
                    stroke={edge.hasIncident ? "#EF4444" : "#60A5FA"}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <text
                    x={(transformX(sourceNode.x) + transformX(targetNode.x)) / 2}
                    y={(transformY(sourceNode.y) + transformY(targetNode.y)) / 2 - 5}
                    fontSize="10"
                    textAnchor="middle"
                    fill="#4B5563"
                  >
                    {edge.id}
                  </text>

                  {/* Traffic Light */}
                  {trafficLightState && (
                    <circle
                      cx={trafficLightX}
                      cy={trafficLightY}
                      r="5"
                      fill={trafficLightColor}
                      stroke="#FFFFFF"
                      strokeWidth="1"
                    />
                  )}
                </g>
              );
            })}

            {/* Render nodes */}
            {Array.from(nodes.values()).map(node => (
              <g key={node.id}>
                <circle
                  cx={transformX(node.x)}
                  cy={transformY(node.y)}
                  r="8"
                  fill="#3B82F6"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x={transformX(node.x)}
                  y={transformY(node.y) + 20}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#4B5563"
                >
                  {node.id}
                </text>
              </g>
            ))}

            {/* Render vehicles */}
            {simulationData.routes.map((route, index) => {
              const position = getVehiclePosition(route);
              if (!position) return null;

              // Use different color for stopped vehicles
              const vehicleColor = position.stopped ? "#DC2626" : "#F97316";

              return (
                <g key={`vehicle-${index}`}>
                  <circle
                    cx={transformX(position.x)}
                    cy={transformY(position.y)}
                    r="6"
                    fill={vehicleColor}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                  <text
                    x={transformX(position.x)}
                    y={transformY(position.y) - 10}
                    fontSize="8"
                    textAnchor="middle"
                    fill="#4B5563"
                  >
                    {route.id || `Vehicle ${index + 1}`}
                    {position.stopped && " (stopped)"}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Showing {nodes.size} intersections, {edges.length} roads, and {simulationData.routes.length} vehicles</p>
          <p className="text-xs mt-1">Simulation Time: {simulationTime.toFixed(1)}s</p>

          {/* Traffic Light Stats */}
          <div className="mt-2 flex justify-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <span>
                {Array.from(trafficLightStates.values()).reduce((count, intersection) => {
                  return count + Array.from(intersection.values()).filter(state => state === 'green').length;
                }, 0)} Green
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
              <span>
                {Array.from(trafficLightStates.values()).reduce((count, intersection) => {
                  return count + Array.from(intersection.values()).filter(state => state === 'yellow').length;
                }, 0)} Yellow
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
              <span>
                {Array.from(trafficLightStates.values()).reduce((count, intersection) => {
                  return count + Array.from(intersection.values()).filter(state => state === 'red').length;
                }, 0)} Red
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationView2D;
