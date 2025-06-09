import { useState, useEffect } from 'react'
import SimulationControls from '../components/SimulationControls'
import SimulationView2D from '../components/SimulationView2D'
import SimulationStats from '../components/SimulationStats'
import {
  runBasicSimulation,
  runDynamicSimulation,
  runComplexSimulation
} from '../services/api'

const Simulation = () => {
  const [simulationData, setSimulationData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [simulationType, setSimulationType] = useState('basic')
  const [isPaused, setIsPaused] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [incidentData, setIncidentData] = useState({
    road_id: '',
    severity: 0.5,
    description: 'Traffic accident'
  })

  const handleRunSimulation = async () => {
    try {
      setLoading(true)
      setError(null)
      setSimulationData(null) // Clear previous simulation data

      // Validate input for dynamic and complex simulations
      if ((simulationType === 'dynamic' || simulationType === 'complex') &&
          (!incidentData.road_id || incidentData.road_id.trim() === '')) {
        throw new Error('Please enter a valid Road ID for the incident (e.g., "1-2")');
      }

      console.log(`Running ${simulationType} simulation...`);
      let data;

      switch (simulationType) {
        case 'basic':
          data = await runBasicSimulation()
          break
        case 'dynamic':
          data = await runDynamicSimulation(incidentData)
          break
        case 'complex':
          data = await runComplexSimulation({
            duration: 600,
            incidents: [incidentData],
            vehicles_count: 20
          })
          break
        default:
          throw new Error('Invalid simulation type')
      }

      // Validate the simulation data
      if (!data || !data.routes || data.routes.length === 0) {
        throw new Error('No routes returned from simulation');
      }

      // Check if routes have waypoints
      const hasWaypoints = data.routes.some(route => route.waypoints && route.waypoints.length > 0);
      if (!hasWaypoints) {
        throw new Error('Routes missing waypoints data');
      }

      console.log('Simulation data received successfully:', data);
      setSimulationData(data)
      setIsPaused(false)
    } catch (err) {
      console.error('Simulation error:', err);
      setError(err.message)
      setSimulationData(null)
    } finally {
      setLoading(false)
    }
  }

  const handlePauseToggle = () => {
    setIsPaused(!isPaused)
  }

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed)
  }

  const handleIncidentChange = (field, value) => {
    setIncidentData({
      ...incidentData,
      [field]: value
    })
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      {/* Header Bar with gradient background */}
      <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Traffic Simulation</h1>
            <p className="text-gray-400">Run and visualize traffic simulations</p>
          </div>
          <div className="hidden md:block">
            {simulationData && !isPaused && (
              <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                <span className="text-emerald-400">Simulation Running</span>
                <span className="ml-2 text-gray-300">Speed: {speed}x</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row flex-grow p-6 gap-6 bg-gray-900">
        {/* Main visualization area */}
        <div className="w-full lg:w-3/4 h-full order-1 visualization-container">
          <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700 h-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-400">Running simulation...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 bg-gray-900 rounded-lg max-w-md border border-red-900">
                  <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-400 font-medium mb-2">Error Running Simulation</p>
                  <p className="text-red-300 text-sm">{error}</p>
                  <button
                    className="mt-4 px-4 py-2 bg-red-900 text-red-100 rounded-md hover:bg-red-800 transition-colors"
                    onClick={() => setError(null)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : (
              <SimulationView2D
                simulationData={simulationData}
                isPaused={isPaused}
                speed={speed}
              />
            )}
          </div>
        </div>

        {/* Controls sidebar */}
        <div className="w-full lg:w-1/4 order-2 overflow-y-auto space-y-6">
          <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100 border-b border-gray-700 pb-3">Simulation Controls</h2>
            <SimulationControls
              simulationType={simulationType}
              setSimulationType={setSimulationType}
              incidentData={incidentData}
              onIncidentChange={handleIncidentChange}
              onRunSimulation={handleRunSimulation}
              isPaused={isPaused}
              onPauseToggle={handlePauseToggle}
              speed={speed}
              onSpeedChange={handleSpeedChange}
              isLoading={loading}
            />
          </div>

          {simulationData && (
            <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-100 border-b border-gray-700 pb-3">Simulation Results</h2>
              <SimulationStats simulationData={simulationData} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Simulation