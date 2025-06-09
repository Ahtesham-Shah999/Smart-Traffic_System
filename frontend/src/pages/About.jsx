import React from 'react'

const About = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white shadow-sm border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">About Smart Traffic Management System</h1>
        <p className="text-gray-600">Learn about the project, features, and technology stack</p>
      </div>

      <div className="flex-grow p-6 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-blue-100 mr-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Project Overview</h2>
            </div>
            <p className="mb-4 text-gray-700 leading-relaxed">
              The Smart Traffic Management System is designed to model real-world city street networks,
              compute and adapt optimal routes and traffic-light timings in real time, and visualize
              both 2D graphs and 3D animations in a clean, minimalistic modern UI.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This system can be used by traffic engineers, urban planners, and researchers to simulate
              and optimize traffic flow in urban environments.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-green-100 mr-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Key Features</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex">
                <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Data Acquisition & Graph Modeling:</span>
                  <span className="text-gray-700"> Download real city data via OSMnx and model road networks as weighted graphs.</span>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Core Algorithms:</span>
                  <span className="text-gray-700"> Implementation of shortest/fastest path algorithms, traffic-light timing optimization, and rerouting logic.</span>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-gray-800">2D & 3D Visualization:</span>
                  <span className="text-gray-700"> View the network in both 2D map view and 3D simulation.</span>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Dynamic Traffic Management:</span>
                  <span className="text-gray-700"> Adapt to traffic incidents and congestion in real-time.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-purple-100 mr-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Technology Stack</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-xl font-medium mb-3 text-blue-800 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                  Backend
                </h3>
                <ul className="space-y-2">
                  {['Python 3.11+', 'FastAPI for HTTP API', 'Uvicorn as ASGI server', 'OSMnx for OpenStreetMap street networks', 'NetworkX for graph algorithms'].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <h3 className="text-xl font-medium mb-3 text-indigo-800 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Frontend
                </h3>
                <ul className="space-y-2">
                  {['React (v18+)', 'Tailwind CSS', 'Three.js for 3D simulation', 'Vite as build tool', 'Axios for API calls'].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="h-4 w-4 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
