'use client';

import { useState, useEffect, useCallback, useId } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserGraduate, FaChalkboardTeacher, FaGoogle, FaCheck, FaTimes } from 'react-icons/fa';

export default function AuthForm({ type }) {
  const { login, register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [role, setRole] = useState('student'); // Default role
  const [loading, setLoading] = useState(false);
  
  // Validation states
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Generate stable IDs for form elements
  const nameId = useId();
  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const profilePicId = useId();
  const roleId = useId();

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };
  
  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  
  // Check username availability
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (!username || username.length < 3) {
        setUsernameAvailable(null);
        setUsernameError('Username must be at least 3 characters');
        return;
      }
      
      try {
        setCheckingUsername(true);
        const response = await fetch(`/api/auth/check-username/${username}`);
        const data = await response.json();
        
        setUsernameAvailable(data.available);
        setUsernameError(data.available ? '' : 'Username already taken');
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameError('Error checking username availability');
      } finally {
        setCheckingUsername(false);
      }
    }, 500),
    []
  );
  
  // Check email availability
  const checkEmail = useCallback(
    debounce(async (email) => {
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        setEmailAvailable(null);
        setEmailError('Please enter a valid email');
        return;
      }
      
      try {
        setCheckingEmail(true);
        const response = await fetch(`/api/auth/check-email/${email}`);
        const data = await response.json();
        
        setEmailAvailable(data.available);
        setEmailError(data.available ? '' : 'Email already in use');
      } catch (error) {
        console.error('Error checking email:', error);
        setEmailError('Error checking email availability');
      } finally {
        setCheckingEmail(false);
      }
    }, 500),
    []
  );
  
  // Trigger availability check when username/email changes
  useEffect(() => {
    if (type === 'register' && username) {
      checkUsername(username);
    }
  }, [type, username, checkUsername]);
  
  useEffect(() => {
    if (type === 'register' && email) {
      checkEmail(email);
    }
  }, [type, email, checkEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (type === 'register') {
        // Validate username and email availability before submitting
        if (username && !usernameAvailable) {
          throw new Error('Username is already taken');
        }
        
        if (email && !emailAvailable) {
          throw new Error('Email is already in use');
        }
        
        // Create user data object
        const userData = {
          name,
          username,
          email,
          password,
          role,
          profilePic
        };
        console.log("Reached here");
        // Use the register function from AuthContext
        const data = await register(userData);
        
        // Redirect based on role
        window.location.href = data.role === 'student' ? '/dashboard/student' : '/dashboard/teacher';
      } else {
        // Use the login function from AuthContext
        const data = await login(email, password);
        
        // Redirect based on user role from response
        window.location.href = data.role === 'student' ? '/dashboard/student' : '/dashboard/teacher';
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // Use a more user-friendly error message display instead of alert
      const errorMessage = error.message || 'Authentication failed';
      // You can use toast notifications if available in your project
      if (window.toast && window.toast.showErrorToast) {
        window.toast.showErrorToast(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          {type === 'login' ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p className="text-sm text-gray-700">
          {type === 'login' ? 'Enter your credentials to access your account' : 'Fill in the information to get started'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id={nameId}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-black w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              suppressHydrationWarning
            />
          </div>
        )}
        
        {type === 'register' && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id={usernameId}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`text-black w-full pl-10 pr-10 py-3 border ${usernameError ? 'border-red-500' : usernameAvailable ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
              suppressHydrationWarning
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {checkingUsername ? (
                <div className="h-5 w-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
              ) : username && usernameAvailable === true ? (
                <FaCheck className="h-5 w-5 text-green-500" />
              ) : username && usernameAvailable === false ? (
                <FaTimes className="h-5 w-5 text-red-500" />
              ) : null}
            </div>
            {usernameError && (
              <p className="mt-1 text-sm text-red-600">{usernameError}</p>
            )}
          </div>
        )}
        
        <div className="relative">
          <div className="text-black absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id={emailId}

            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`text-black w-full pl-10 pr-10 py-3 border ${emailError ? 'border-red-500' : emailAvailable ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            required
            suppressHydrationWarning
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {checkingEmail ? (
              <div className="h-5 w-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            ) : email && emailAvailable === true ? (
              <FaCheck className="h-5 w-5 text-green-500" />
            ) : email && emailAvailable === false ? (
              <FaTimes className="h-5 w-5 text-red-500" />
            ) : null}
          </div>
          {emailError && type === 'register' && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
              id={passwordId}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              suppressHydrationWarning
            />
        </div>
        
        {type === 'register' && (
          <div className="space-y-3">
            <div className="mb-2">
              <label htmlFor={profilePicId} className="block text-gray-700 text-sm font-medium mb-2">Profile Picture</label>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  {profilePic ? (
                    <img 
                      src={URL.createObjectURL(profilePic)} 
                      alt="Profile preview" 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Choose File
                  <input
                    type="file"
                    id={profilePicId}
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="sr-only"
                  />
                </label>
                <span className="ml-2 text-sm text-gray-700">
                  {profilePic ? profilePic.name : 'No file chosen'}
                </span>
              </div>
            </div>
            
            <div>
                <label htmlFor={roleId} className="block text-gray-700 text-sm font-medium mb-2">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    className={`flex items-center justify-center p-3 border ${role === 'student' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-lg cursor-pointer hover:bg-gray-50 transition-colors`}
                    onClick={() => setRole('student')}
                  >
                  <FaUserGraduate className={`h-5 w-5 mr-2 ${role === 'student' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className={`${role === 'student' ? 'font-medium text-blue-700' : 'text-gray-700'}`}>Student</span>
                </div>
                <div 
                  className={`flex items-center justify-center p-3 border ${role === 'teacher' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-lg cursor-pointer hover:bg-gray-50 transition-colors`}
                  onClick={() => setRole('teacher')}
                >
                  <FaChalkboardTeacher className={`h-5 w-5 mr-2 ${role === 'teacher' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className={`${role === 'teacher' ? 'font-medium text-blue-700' : 'text-gray-700'}`}>Teacher</span>
                </div>
              </div>
              <select 
                id={roleId}
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="sr-only"
                suppressHydrationWarning
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </div>
        )}
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || (type === 'register' && (usernameAvailable === false || emailAvailable === false))}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium transition-colors duration-200 transform shadow-md hover:shadow-lg ${(loading || (type === 'register' && (usernameAvailable === false || emailAvailable === false))) ? 'opacity-70 cursor-not-allowed' : ''}`}
            suppressHydrationWarning
          >
            {loading ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </div>
        
        {type === 'login' && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                suppressHydrationWarning
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-blue-600 hover:text-blue-500 cursor-pointer">
              Forgot password?
            </div>
          </div>
        )}
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-700">Or continue with</span>
        </div>
      </div>
      
      <div>
        <a 
          href="/api/auth/google"
          className="w-full flex items-center justify-center py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
          Sign {type === 'login' ? 'in' : 'up'} with Google
        </a>
      </div>
      
      <div className="text-center text-sm text-gray-700">
        {type === 'login' ? (
          <p>
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-blue-700 hover:text-blue-600">Sign up</a>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-700 hover:text-blue-600">Sign in</a>
          </p>
        )}
      </div>
    </div>
  );
}