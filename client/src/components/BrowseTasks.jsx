import { useState, useEffect } from 'react';
import { Search, Calendar, Tag } from 'lucide-react';
import { getAllTasks, applyToTask } from '../utils/api';

// Browse Tasks Component with backend integration
function BrowseTasks({ setCurrentPage }) {
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingTask, setApplyingTask] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getAllTasks();
      if (response.success) {
        setTasks(response.tasks);
      }
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Tasks error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tasks based on search and difficulty
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || task.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  // Handle apply to task with API call
  const handleApply = async (taskId) => {
    setApplyingTask(taskId);
    setError('');

    try {
      const response = await applyToTask(taskId);
      
      if (response.success) {
        alert('Application submitted! The mentor will review your request.');
        // Refresh tasks to update applicant count
        fetchTasks();
      }
    } catch (err) {
      setError(err.message || 'Failed to apply to task');
      alert(err.message || 'Failed to apply to task');
    } finally {
      setApplyingTask(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Tasks</h1>
          <p className="text-gray-600">Find and apply to tasks that match your skills</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div key={task._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              
              {/* Task Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h3>
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  {/* Mentor Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>👨‍🏫 {task.mentorId?.name || 'Mentor'}</span>
                    <span>🏢 {task.mentorId?.company || 'Company'}</span>
                  </div>
                </div>

                {/* Difficulty Badge */}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.difficulty === 'Easy' 
                    ? 'bg-green-100 text-green-800' 
                    : task.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {task.difficulty}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {task.tags && task.tags.map((tag, index) => (
                  <span key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </span>
                  <span>{task.applicants || 0} teams applied</span>
                </div>

                <button
                  onClick={() => handleApply(task._id)}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={applyingTask === task._id}
                >
                  {applyingTask === task._id ? 'Applying...' : 'Apply'}
                </button>
              </div>
            </div>
          ))}

          {/* No Results */}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No tasks found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrowseTasks;