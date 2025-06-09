import React from 'react'

const SimulationControls = ({
  simulationType,
  setSimulationType,
  incidentData,
  onIncidentChange,
  onRunSimulation,
  isPaused,
  onPauseToggle,
  speed,
  onSpeedChange,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg">
        <div className="flex items-center mb-3">
          <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="font-medium text-gray-200">Scenario Type</h3>
        </div>
        <select
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={simulationType}
          onChange={(e) => setSimulationType(e.target.value)}
          disabled={isLoading}
        >
          <option value="basic">Basic (Static Traffic)</option>
          <option value="dynamic">Dynamic (With Incident)</option>
          <option value="complex">Complex (Multiple Vehicles)</option>
        </select>
      </div>

      {simulationType !== 'basic' && (
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg">
          <div className="flex items-center mb-3">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-medium text-gray-200">Incident Configuration</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1 font-medium">Road ID <span className="text-red-400">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <input
                  type="text"
                  className={`w-full pl-10 p-2 border ${!incidentData.road_id ? 'border-red-500 bg-red-900 bg-opacity-30' : 'border-gray-600'} rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  value={incidentData.road_id}
                  onChange={(e) => onIncidentChange('road_id', e.target.value)}
                  placeholder="e.g. 1-2"
                  disabled={isLoading}
                />
              </div>
              <div className="mt-2 flex items-center">
                <svg className="h-4 w-4 text-blue-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-300">
                  For the sample network, try using one of these road IDs: <span className="font-mono bg-gray-700 px-1 py-0.5 rounded">1-2</span>, <span className="font-mono bg-gray-700 px-1 py-0.5 rounded">1-3</span>, <span className="font-mono bg-gray-700 px-1 py-0.5 rounded">2-3</span>, <span className="font-mono bg-gray-700 px-1 py-0.5 rounded">2-4</span>, <span className="font-mono bg-gray-700 px-1 py-0.5 rounded">3-5</span>, or <span className="font-mono bg-gray-700 px-1 py-0.5 rounded">4-5</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1 font-medium">
                Severity: {incidentData.severity.toFixed(2)}
              </label>
              <input
                type="range"
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                min="0"
                max="1"
                step="0.01"
                value={incidentData.severity}
                onChange={(e) => onIncidentChange('severity', parseFloat(e.target.value))}
                disabled={isLoading}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Minor</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1 font-medium">Description</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full pl-10 p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={incidentData.description}
                  onChange={(e) => onIncidentChange('description', e.target.value)}
                  placeholder="Description"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg">
        <button
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center font-medium mb-3"
          onClick={onRunSimulation}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running...
            </>
          ) : (
            <>
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run Simulation
            </>
          )}
        </button>

        <div className="text-center">
          <button
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors flex items-center mx-auto"
            onClick={() => {
              // Force 2D view by setting a localStorage flag
              localStorage.setItem('use2DFallback', 'true');
              // Reload the page to apply the setting
              window.location.reload();
            }}
          >
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Having trouble? Try 2D mode
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg">
        <div className="flex items-center mb-3">
          <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-medium text-gray-200">Playback Controls</h3>
        </div>

        <div className="flex space-x-3">
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-colors flex items-center justify-center ${
              isPaused
                ? 'bg-green-800 text-green-200 hover:bg-green-700'
                : 'bg-yellow-800 text-yellow-200 hover:bg-yellow-700'
            }`}
            onClick={onPauseToggle}
            disabled={isLoading}
          >
            {isPaused ? (
              <>
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                Play
              </>
            ) : (
              <>
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pause
              </>
            )}
          </button>
        </div>

        <div className="mt-3">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-300 font-medium">Speed</label>
            <span className="text-sm font-medium text-indigo-400">{speed}x</span>
          </div>
          <input
            type="range"
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-1"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimulationControls