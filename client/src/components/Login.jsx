import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { login } from '../utils/api';

// Login component with backend integration - FIXED VERSION
function Login({ setCurrentPage, onLogin }) {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });

  // Loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  // Handle form submission with API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the login API
      const response = await login(formData);
      
      if (response.success) {
        // Call parent handler with user data
        onLogin(response.user.role, response.user);
      }
    } catch (err) {
      // Handle error
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Login to your account</p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                placeholder="student@mnnit.ac.in"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login as
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
              disabled={isLoading}
            >
              <option value="student">Student</option>
              <option value="mentor">Alumni / Mentor</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentPage('signup')}
            className="text-gray-800 font-medium hover:underline"
            disabled={isLoading}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;