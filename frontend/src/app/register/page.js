import AuthForm from '../components/AuthForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative skewed background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-200 rounded-full opacity-50 transform rotate-12"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-pink-200 rounded-full opacity-40 transform -rotate-6"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-200 rounded-full opacity-30 transform rotate-45"></div>
      </div>
      
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        {/* Circular icon with SVG graphic */}
        <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        
        <AuthForm type="register" />
      </div>
    </div>
  );
}