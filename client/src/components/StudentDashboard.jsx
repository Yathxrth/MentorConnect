import { useState, useEffect } from 'react';
import { BookOpen, Users, Award, Bell } from 'lucide-react';
import { getStudentDashboard } from '../utils/api';

// Student Dashboard with backend integration
function StudentDashboard({ setCurrentPage, userData }) {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    stats: {
      tasksCompleted: 0,
      tasksActive: 0,
      badgesEarned: 0,
      teamMembers: 0
    },
    activeTasks: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock notifications (you can add API for this later)
  const notifications = [
    { id: 1, text: 'New task available: Mobile App Development', time: '2 hours ago' },
    { id: 2, text: 'Your submission was reviewed', time: '5 hours ago' },
    { id: 3, text: 'Team meeting scheduled for tomorrow', time: '1 day ago' }
  ];

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getStudentDashboard();
      if (response.success) {
        setDashboardData(response);
      }
    } catch (err) {
      setError('Failed to load dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {userData?.name || 'Student'}!
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your projects</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.stats.tasksCompleted}</p>
              </div>
              <BookOpen className="text-gray-400" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.stats.tasksActive}</p>
              </div>
              <BookOpen className="text-gray-400" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Badges Earned</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.stats.badgesEarned}</p>
              </div>
              <Award className="text-gray-400" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Team Members</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.stats.teamMembers || 0}</p>
              </div>
              <Users className="text-gray-400" size={32} />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Active Tasks Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Active Tasks</h2>
                <button 
                  onClick={() => setCurrentPage('browse-tasks')}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Browse All
                </button>
              </div>

              <div className="space-y-4">
                {dashboardData.activeTasks && dashboardData.activeTasks.length > 0 ? (
                  dashboardData.activeTasks.map(submission => (
                    <div key={submission._id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {submission.taskId?.title || 'Task'}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Status: {submission.status}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Applied: {new Date(submission.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          submission.status === 'submitted' 
                            ? 'bg-blue-100 text-blue-800' 
                            : submission.status === 'reviewed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                      <button 
                        onClick={() => setCurrentPage('task-submission')}
                        className="mt-3 text-sm text-gray-800 hover:underline"
                      >
                        View Details →
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No active tasks</p>
                    <button 
                      onClick={() => setCurrentPage('browse-tasks')}
                      className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                    >
                      Browse Tasks
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="text-gray-600" size={20} />
                <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
              </div>

              <div className="space-y-4">
                {notifications.map(notification => (
                  <div key={notification.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <p className="text-sm text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => setCurrentPage('browse-tasks')}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-left"
                >
                  Find New Tasks
                </button>
                <button 
                  onClick={() => setCurrentPage('team-management')}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-left"
                >
                  Manage Team
                </button>
                <button 
                  onClick={() => setCurrentPage('student-profile')}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-left"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;