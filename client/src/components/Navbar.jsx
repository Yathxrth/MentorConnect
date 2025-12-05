import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';

// Navigation bar component that shows different options based on login status
function Navbar({ isLoggedIn, userRole, setCurrentPage, onLogout }) {
  // State to handle mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand Name */}
          <div 
            className="text-xl font-bold text-gray-800 cursor-pointer"
            onClick={() => setCurrentPage(isLoggedIn ? (userRole === 'student' ? 'student-dashboard' : 'mentor-dashboard') : 'home')}
          >
            Obsidian Circle
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                {/* Student Navigation */}
                {userRole === 'student' && (
                  <>
                    <button 
                      onClick={() => setCurrentPage('student-dashboard')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => setCurrentPage('browse-tasks')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Browse Tasks
                    </button>
                    <button 
                      onClick={() => setCurrentPage('team-management')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      My Team
                    </button>
                    <button 
                      onClick={() => setCurrentPage('student-profile')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Profile
                    </button>
                  </>
                )}

                {/* Mentor Navigation */}
                {userRole === 'mentor' && (
                  <>
                    <button 
                      onClick={() => setCurrentPage('mentor-dashboard')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => setCurrentPage('mentor-create-task')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Create Task
                    </button>
                    <button 
                      onClick={() => setCurrentPage('mentor-profile')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Profile
                    </button>
                  </>
                )}

                {/* Logout Button */}
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Not logged in navigation */}
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Login
                </button>
                <button 
                  onClick={() => setCurrentPage('signup')}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                {userRole === 'student' && (
                  <>
                    <button 
                      onClick={() => {
                        setCurrentPage('student-dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentPage('browse-tasks');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Browse Tasks
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentPage('team-management');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      My Team
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentPage('student-profile');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Profile
                    </button>
                  </>
                )}
                
                {userRole === 'mentor' && (
                  <>
                    <button 
                      onClick={() => {
                        setCurrentPage('mentor-dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentPage('mentor-create-task');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Create Task
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentPage('mentor-profile');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Profile
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 mx-4"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setCurrentPage('login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Login
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 mx-4"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;