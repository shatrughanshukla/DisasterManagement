import Image from "next/image";
import { FaShieldAlt, FaBookOpen, FaUsers, FaArrowRight } from 'react-icons/fa';

import HomepageHeader from "./components/HomepageHeader";

export default function Home() {
  return (
    <>
    <HomepageHeader/>
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen bg-cover bg-center flex flex-col items-center justify-center text-white p-8" 
           style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("/disaster-bg.jpg")' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 z-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="animate-pulse inline-flex items-center px-4 py-2 rounded-full bg-blue-600 bg-opacity-70 text-white text-sm font-medium mb-6">
            <span className="mr-2">🔔</span>
            <span>Disaster Management Training Platform</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Prepare, Respond, <span className="text-blue-400">Recover</span>
          </h1>
          
          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto text-gray-200">
            Your comprehensive solution for disaster preparedness and response training. Learn essential skills to protect yourself and others.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
            <a href="/login" className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              <span>Student Portal</span>
              <FaArrowRight className="ml-2" />
            </a>
            <a href="/login" className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              <span>Teacher Portal</span>
              <FaArrowRight className="ml-2" />
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="animate-bounce bg-white bg-opacity-20 p-2 w-10 h-10 ring-1 ring-white ring-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Comprehensive disaster management training for everyone.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <FaShieldAlt className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Safety First</h3>
                <p className="text-gray-700">Learn essential safety protocols and procedures for various disaster scenarios.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <FaBookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Content</h3>
                <p className="text-gray-700">Access courses designed by disaster management experts with real-world experience.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="p-6">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <FaUsers className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Community Focus</h3>
                <p className="text-gray-700">Build resilient communities through collaborative learning and preparation.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <a href="/register" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-300">
              Get Started Today
              <FaArrowRight className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
