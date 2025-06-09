import React, { useMemo } from 'react'

const NetworkStats = ({ networkData, loading }) => {
  const stats = useMemo(() => {
    if (!networkData || !networkData.features) {
      return {
        intersections: 0,
        roads: 0,
        totalRoadLength: 0,
        avgRoadLength: 0
      }
    }

    const intersections = networkData.features.filter(f => f.properties.type === 'intersection')
    const roads = networkData.features.filter(f => f.properties.type === 'road')

    const totalRoadLength = roads.reduce((sum, road) => {
      return sum + (road.properties.length || 0)
    }, 0)

    const avgRoadLength = roads.length > 0 ? totalRoadLength / roads.length : 0

    return {
      intersections: intersections.length,
      roads: roads.length,
      totalRoadLength: totalRoadLength.toFixed(2),
      avgRoadLength: avgRoadLength.toFixed(2)
    }
  }, [networkData])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  const StatCard = ({ title, value, icon, color = "blue" }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-start">
      <div className={`rounded-full p-2 mr-3 bg-${color}-100 text-${color}-500`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <StatCard
        title="Intersections"
        value={stats.intersections}
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
        color="blue"
      />

      <StatCard
        title="Roads"
        value={stats.roads}
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        }
        color="green"
      />

      <StatCard
        title="Total Road Length (m)"
        value={stats.totalRoadLength}
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
        color="indigo"
      />

      <StatCard
        title="Average Road Length (m)"
        value={stats.avgRoadLength}
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
        color="purple"
      />
    </div>
  )
}

export default NetworkStats
