import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-gray-800">Chore Manager</h1>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              List View
            </Link>
            <Link
              to="/calendar"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/calendar'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Calendar View
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation