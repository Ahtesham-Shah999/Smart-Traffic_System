import React from 'react'

const SimulationStats = ({ simulationData }) => {
  if (!simulationData) {
    return (
      <div className="text-center p-6">
        <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500">No simulation data available</p>
        <p className="text-sm text-gray-400 mt-1">Run a simulation to see statistics</p>
      </div>
    )
  }

  const { routes, traffic_lights, incidents } = simulationData

  // Calculate average travel time
  const avgTravelTime = routes && routes.length > 0
    ? (routes.reduce((sum, route) => sum + route.travel_time, 0) / routes.length).toFixed(2)
    : 0;

  // Calculate total distance
  const totalDistance = routes && routes.length > 0
    ? routes.reduce((sum, route) => {
        // Calculate distance from waypoints if available
        if (route.waypoints && route.waypoints.length > 1) {
          let distance = 0;
          for (let i = 0; i < route.waypoints.length - 1; i++) {
            const wp1 = route.waypoints[i];
            const wp2 = route.waypoints[i + 1];
            // Simple Euclidean distance as an approximation
            const dx = wp2.longitude - wp1.longitude;
            const dy = wp2.latitude - wp1.latitude;
            distance += Math.sqrt(dx * dx + dy * dy);
          }
          return sum + distance;
        }
        return sum;
      }, 0).toFixed(2)
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500">Routes</h3>
              <p className="text-xl font-bold text-gray-800">{routes ? routes.length : 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500">Avg Travel Time</h3>
              <p className="text-xl font-bold text-gray-800">{avgTravelTime}s</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 mr-3">
              <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500">Traffic Lights</h3>
              <p className="text-xl font-bold text-gray-800">{traffic_lights ? traffic_lights.length : 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-indigo-100 mr-3">
              <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500">Incidents</h3>
              <p className="text-xl font-bold text-gray-800">{incidents ? incidents.length : 0}</p>
            </div>
          </div>
        </div>
      </div>

      {incidents && incidents.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <svg className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Incident Details
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {incidents.map((incident, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Road: {incident.road_id}</span>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    Severity: {(incident.severity * 100).toFixed(0)}%
                  </span>
                </div>
                {incident.description && (
                  <p className="text-xs text-gray-600 mt-2 border-t border-red-100 pt-2">{incident.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {routes && routes.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <svg className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Route Summary
          </h3>
          <div className="text-sm text-gray-600">
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span>Total Routes:</span>
              <span className="font-medium">{routes.length}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span>Average Travel Time:</span>
              <span className="font-medium">{avgTravelTime} seconds</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Total Distance:</span>
              <span className="font-medium">{totalDistance} units</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimulationStats
