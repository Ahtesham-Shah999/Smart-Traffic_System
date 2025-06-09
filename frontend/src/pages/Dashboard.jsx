import { useState, useEffect } from 'react'
import MapView from '../components/MapView'
import NetworkStats from '../components/NetworkStats'
import { fetchSampleNetwork } from '../services/api'

const Dashboard = () => {
  const [networkData, setNetworkData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadNetworkData = async () => {
      try {
        setLoading(true)
        const data = await fetchSampleNetwork()
        setNetworkData(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    loadNetworkData()
  }, [])

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      {/* Header Bar with gradient background */}
      <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Traffic Network Dashboard</h1>
            <p className="text-gray-400">View and analyze the current traffic network</p>
          </div>
          <div className="hidden md:block">
            {!loading && networkData && (
              <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                <span className="text-emerald-400">Active Network</span>
                <span className="ml-2 text-gray-300">{new Date().toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row flex-grow p-6 gap-6 bg-gray-900">
        {/* Sidebar for desktop - Stats first on mobile */}
        <div className="w-full lg:w-1/4 order-2 lg:order-1">
          <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700 h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-100 border-b border-gray-700 pb-3">Network Statistics</h2>
            <NetworkStats networkData={networkData} loading={loading} />
          </div>
        </div>

        {/* Main visualization area */}
        <div className="w-full lg:w-3/4 h-full order-1 lg:order-2 visualization-container">
          <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700 h-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-400">Loading map data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 bg-gray-900 rounded-lg max-w-md border border-red-900">
                  <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-400 font-medium mb-2">Error Loading Data</p>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            ) : (
              <MapView networkData={networkData} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard