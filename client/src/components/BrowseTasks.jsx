import { useState } from 'react';
import { Search, Calendar, Tag } from 'lucide-react';

// Browse Tasks Component - View and apply to available tasks
function BrowseTasks({ setCurrentPage }) {
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Mock tasks data
  const allTasks = [
    {
      id: 1,
      title: 'Build a REST API with Node.js',
      description: 'Create a RESTful API for a blog platform with CRUD operations',
      mentor: 'Dr. Sarah Johnson',
      company: 'Tech Corp',
      difficulty: 'Medium',
      deadline: '2025-12-20',
      tags: ['Node.js', 'Express', 'MongoDB'],
      applicants: 5
    },
    {
      id: 2,
      title: 'Frontend Design Challenge',
      description: 'Design and build a responsive landing page for a startup',
      mentor: 'Mike Chen',
      company: 'Design Studio',
      difficulty: 'Easy',
      deadline: '2025-12-15',
      tags: ['React', 'CSS', 'Tailwind'],
      applicants: 8
    },
    {
      id: 3,
      title: 'Machine Learning Image Classifier',
      description: 'Build an image classification model using TensorFlow',
      mentor: 'Prof. Amanda Lee',
      company: 'AI Research Lab',
      difficulty: 'Hard',
      deadline: '2026-01-05',
      tags: ['Python', 'TensorFlow', 'ML'],
      applicants: 3
    },
    {
      id: 4,
      title: 'Mobile App Development',
      description: 'Create a cross-platform mobile app for task management',
      mentor: 'John Smith',
      company: 'Mobile Inc',
      difficulty: 'Medium',
      deadline: '2025-12-30',
      tags: ['React Native', 'JavaScript', 'Firebase'],
      applicants: 6
    },
    {
      id: 5,
      title: 'Database Optimization Project',
      description: 'Optimize queries and improve database performance',
      mentor: 'Rachel Green',
      company: 'Data Systems',
      difficulty: 'Hard',
      deadline: '2026-01-10',
      tags: ['SQL', 'PostgreSQL', 'Performance'],
      applicants: 2
    }
  ];

  // Filter tasks based on search and difficulty
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || task.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  // Handle apply to task
  const handleApply = (taskId) => {
    // Here you would send application to backend
    console.log('Applying to task:', taskId);
    alert('Application submitted! The mentor will review your request.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Tasks</h1>
          <p className="text-gray-600">Find and apply to tasks that match your skills</p>
        </div>

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
            <div key={task.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              
              {/* Task Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h3>
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  {/* Mentor Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>👨‍🏫 {task.mentor}</span>
                    <span>🏢 {task.company}</span>
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
                {task.tags.map((tag, index) => (
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
                    Deadline: {task.deadline}
                  </span>
                  <span>{task.applicants} teams applied</span>
                </div>

                <button
                  onClick={() => handleApply(task.id)}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Apply
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