import React from 'react'

const HomepageHeader = () => {
  return (
        <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white font-bold text-xl tracking-tight">Disaster Management</span>
                </a>
              </div>
              
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="/" className="text-white hover:bg-blue-600 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Home</a>
                  <a href="#" className="text-white hover:bg-blue-600 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Resources</a>
                  <a href="#" className="text-white hover:bg-blue-600 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">About</a>
                  <a href="#" className="text-white hover:bg-blue-600 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Contact</a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <a href="/login" className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-sm">Sign In</a>
                <a href="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-sm">Register</a>
              </div>
            </div>
          </div>
        </nav>
  )
}

export default HomepageHeader
