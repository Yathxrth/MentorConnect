import { useState } from 'react';
import { Plus, X } from 'lucide-react';

// Mentor Task Create Component - Create new tasks for students
function MentorTaskCreate({ setCurrentPage }) {
  // Form state
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    deadline: '',
    totalPoints: 100,
    tags: [],
    newTag: ''
  });

  // Handle input change
  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value
    });
  };

  // Add tag
  const handleAddTag = () => {
    if (taskData.newTag.trim() && taskData.tags.length < 5) {
      setTaskData({
        ...taskData,
        tags: [...taskData.tags, taskData.newTag.trim()],
        newTag: ''
      });
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setTaskData({
      ...taskData,
      tags: taskData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!taskData.title.trim()) {
      alert('Please enter a task title');
      return;
    }
    if (!taskData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (!taskData.deadline) {
      alert('Please select a deadline');
      return;
    }

    // Here you would send data to backend
    console.log('Creating task:', taskData);
    alert('Task created successfully!');
    setCurrentPage('mentor-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Task</h1>
          <p className="text-gray-600">Post a new project for students to work on</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              placeholder="e.g., Build a REST API with Node.js"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe what students need to build and any specific requirements..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
              required
            />
          </div>

          {/* Deadline and Total Points Row */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={taskData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                required
              />
            </div>

            {/* Total Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Points
              </label>
              <input
                type="number"
                name="totalPoints"
                value={taskData.totalPoints}
                onChange={handleChange}
                min="1"
                placeholder="e.g., 100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technology Tags (Max 5)
            </label>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {taskData.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm flex items-center gap-2">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-300"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            {taskData.tags.length < 5 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  name="newTag"
                  value={taskData.newTag}
                  onChange={handleChange}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="e.g., React, Node.js, Python"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium"
            >
              Create Task
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('mentor-dashboard')}
              className="flex-1 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MentorTaskCreate;