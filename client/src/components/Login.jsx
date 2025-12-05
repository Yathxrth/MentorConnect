import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

// Login component for existing users
function Login({ setCurrentPage, onLogin }) {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you would validate with your backend
    // For now, we'll just simulate a successful login
    console.log('Login data:', formData);

    // Mock user data
    const mockUserData = {
      name: 'John Doe',
      email: formData.email,
      role: formData.role,
      id: '123456'
    };

    // Call the login handler from parent
    onLogin(formData.role, mockUserData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Login to your account</p>

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
                placeholder="student@college.edu"
                required
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
            >
              <option value="student">Student</option>
              <option value="mentor">Alumni / Mentor</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentPage('signup')}
            className="text-gray-800 font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;