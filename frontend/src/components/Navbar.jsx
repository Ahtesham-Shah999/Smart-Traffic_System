import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path 
      ? 'bg-blue-600 text-white font-medium border-b-2 border-blue-400' 
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
  }

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              
              <span className="text-xl font-bold bg-gradient-to-r from-blue-100 to-gray-100 text-transparent bg-clip-text">G8 Traffic Management</span>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="md:ml-6 flex space-x-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-md text-sm transition-colors duration-200 ${isActive('/')}`}
              >
                Dashboard
              </Link>
              <Link
                to="/simulation"
                className={`px-4 py-2 rounded-md text-sm transition-colors duration-200 ${isActive('/simulation')}`}
              >
                Simulation
              </Link>
              
            </div>
            
            {/* User profile/settings button */}
            <div className="ml-4 flex items-center">
              <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar