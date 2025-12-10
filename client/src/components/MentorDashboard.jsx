import { useState, useEffect } from 'react';
import { ClipboardList, Users, CheckCircle, Clock } from 'lucide-react';
import { getMentorTasks, getMentorSubmissions } from '../utils/api';

// Mentor Dashboard with backend integration
function MentorDashboard({ setCurrentPage, userData }) {
  // State for dashboard data
  const [myTasks, setMyTasks] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [stats, setStats] = useState({
    activeTasks: 0,
    totalTeams: 0,
    pendingReviews: 0,
    completedReviews: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch mentor's tasks
      const tasksResponse = await getMentorTasks();
      if (tasksResponse.success) {
        setMyTasks(tasksResponse.tasks);
        
        // Calculate stats
        const activeTasks = tasksResponse.tasks.filter(t => t.status === 'active').length;
        const totalTeams = tasksResponse.tasks.reduce((sum, task) => sum + (task.activeTeams || 0), 0);
        
        setStats(prev => ({
          ...prev,
          activeTasks,
          totalTeams
        }));
      }

      // Fetch pending submissions
      const submissionsResponse = await getMentorSubmissions();
      if (submissionsResponse.success) {
        const pending = submissionsResponse.submissions.filter(s => s.status === 'submitted');
        setPendingReviews(pending);
        
        setStats(prev => ({
          ...prev,
          pendingReviews: pending.length,
          completedReviews: submissionsResponse.submissions.filter(s => s.status === 'reviewed').length
        }));
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
            Welcome back, {userData?.name || 'Mentor'}!
          </h1>
          <p className="text-gray-600 mt-2">Here's an overview of your mentorship activities</p>
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
                <p className="text-gray-600 text-sm">Active Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{stats.activeTasks}</p>
              </div>
              <ClipboardList className="text-gray-400" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Teams</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalTeams}</p>
              </div>
              <Users className="text-gray-400" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Reviews</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pendingReviews}</p>
              </div>
              <Clock className="text-gray-400" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed Reviews</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completedReviews}</p>
              </div>
              <CheckCircle className="text-gray-400" size={32} />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* My Tasks Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">My Tasks</h2>
              <button 
                onClick={() => setCurrentPage('mentor-create-task')}
                className="text-sm px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Create New
              </button>
            </div>

            <div className="space-y-4">
              {myTasks.length > 0 ? (
                myTasks.map(task => (
                  <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">{task.applicants || 0}</p>
                        <p className="text-xs">Applicants</p>
                      </div>
                      <div>
                        <p className="font-medium">{task.activeTeams || 0}</p>
                        <p className="text-xs">Active Teams</p>
                      </div>
                      <div>
                        <p className="font-medium">{new Date(task.deadline).toLocaleDateString()}</p>
                        <p className="text-xs">Deadline</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No tasks created yet</p>
                  <button 
                    onClick={() => setCurrentPage('mentor-create-task')}
                    className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                  >
                    Create Your First Task
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Pending Reviews Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Pending Reviews</h2>

            <div className="space-y-4">
              {pendingReviews.length > 0 ? (
                pendingReviews.map(review => (
                  <div key={review._id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 cursor-pointer">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-800">{review.taskId?.title || 'Task'}</h3>
                      <p className="text-sm text-gray-600">
                        Student: {review.studentId?.name || 'Student'}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Submitted: {new Date(review.submittedAt).toLocaleDateString()}
                      </span>
                      <button 
                        onClick={() => setCurrentPage('mentor-evaluation')}
                        className="px-4 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No pending reviews</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button 
              onClick={() => setCurrentPage('mentor-create-task')}
              className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 text-left"
            >
              <p className="font-semibold text-gray-800">Create New Task</p>
              <p className="text-sm text-gray-600 mt-1">Post a new project for students</p>
            </button>
            
            <button 
              onClick={() => setCurrentPage('mentor-evaluation')}
              className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 text-left"
            >
              <p className="font-semibold text-gray-800">Review Submissions</p>
              <p className="text-sm text-gray-600 mt-1">Evaluate pending work</p>
            </button>
            
            <button 
              onClick={() => setCurrentPage('mentor-profile')}
              className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 text-left"
            >
              <p className="font-semibold text-gray-800">Edit Profile</p>
              <p className="text-sm text-gray-600 mt-1">Update your information</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorDashboard;