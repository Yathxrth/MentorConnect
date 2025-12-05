import { useState } from 'react';
import { Menu, X } from 'lucide-react';

// Import all components
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import MentorDashboard from './components/MentorDashboard';
import StudentProfile from './components/StudentProfile';
import MentorProfile from './components/MentorProfile';
import BrowseTasks from './components/BrowseTasks';
import TeamManagement from './components/TeamManagement';
import TaskSubmission from './components/TaskSubmission';
import MentorTaskCreate from './components/MentorTaskCreate';
import MentorEvaluation from './components/MentorEvaluation';

function App() {
  // State to track which page to show
  const [currentPage, setCurrentPage] = useState('home');
  
  // State to track if user is logged in and their role
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(''); // 'student' or 'mentor'
  const [userData, setUserData] = useState(null);

  // Handle successful login
  const handleLogin = (role, data) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserData(data);
    
    // Navigate to appropriate dashboard
    if (role === 'student') {
      setCurrentPage('student-dashboard');
    } else {
      setCurrentPage('mentor-dashboard');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setUserData(null);
    setCurrentPage('home');
  };

  // Render the current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <Signup setCurrentPage={setCurrentPage} />;
      case 'login':
        return <Login setCurrentPage={setCurrentPage} onLogin={handleLogin} />;
      case 'student-dashboard':
        return <StudentDashboard setCurrentPage={setCurrentPage} userData={userData} />;
      case 'mentor-dashboard':
        return <MentorDashboard setCurrentPage={setCurrentPage} userData={userData} />;
      case 'student-profile':
        return <StudentProfile setCurrentPage={setCurrentPage} userData={userData} />;
      case 'mentor-profile':
        return <MentorProfile setCurrentPage={setCurrentPage} userData={userData} />;
      case 'browse-tasks':
        return <BrowseTasks setCurrentPage={setCurrentPage} />;
      case 'team-management':
        return <TeamManagement setCurrentPage={setCurrentPage} />;
      case 'task-submission':
        return <TaskSubmission setCurrentPage={setCurrentPage} />;
      case 'mentor-create-task':
        return <MentorTaskCreate setCurrentPage={setCurrentPage} />;
      case 'mentor-evaluation':
        return <MentorEvaluation setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar 
        isLoggedIn={isLoggedIn} 
        userRole={userRole}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="pt-16">
        {renderPage()}
      </div>
    </div>
  );
}

// Home Page Component
function HomePage({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            The Obsidian Circle
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with alumni mentors, work on real-world projects, and build your career
          </p>
          
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('signup')}
              className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Get Started
            </button>
            <button 
              onClick={() => setCurrentPage('login')}
              className="px-8 py-3 bg-white text-gray-800 border-2 border-gray-800 rounded-lg hover:bg-gray-100"
            >
              Login
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">For Students</h3>
            <p className="text-gray-600">
              Work on real projects, collaborate in teams, and get mentorship from industry professionals
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">For Mentors</h3>
            <p className="text-gray-600">
              Post tasks, evaluate submissions, and help students grow with your expertise
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Track Progress</h3>
            <p className="text-gray-600">
              Monitor contributions, earn badges, and build a portfolio of completed work
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;