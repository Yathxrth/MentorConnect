import { useState } from 'react';
import { Plus, X } from 'lucide-react';

// Mentor Task Create Component - Create new tasks for students
function MentorTaskCreate({ setCurrentPage }) {
  // Form state
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    deadline: '',
    difficulty: 'Medium',
    tags: [],
    newTag: '',
    rubricItems: [
      { criteria: '', points: 0 }
    ]
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

  // Add rubric item
  const handleAddRubricItem = () => {
    setTaskData({
      ...taskData,
      rubricItems: [...taskData.rubricItems, { criteria: '', points: 0 }]
    });
  };

  // Remove rubric item
  const handleRemoveRubricItem = (index) => {
    const newItems = taskData.rubricItems.filter((_, i) => i !== index);
    setTaskData({
      ...taskData,
      rubricItems: newItems
    });
  };

  // Handle rubric item change
  const handleRubricChange = (index, field, value) => {
    const newItems = [...taskData.rubricItems];
    newItems[index][field] = value;
    setTaskData({
      ...taskData,
      rubricItems: newItems
    });
  };

  // Calculate total points
  const totalPoints = taskData.rubricItems.reduce((sum, item) => sum + (parseInt(item.points) || 0), 0);

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
    if (taskData.rubricItems.some(item => !item.criteria.trim())) {
      alert('Please fill in all rubric criteria');
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

          {/* Deadline and Difficulty Row */}
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

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={taskData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
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

          {/* Rubric Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Evaluation Rubric *
              </label>
              <button
                type="button"
                onClick={handleAddRubricItem}
                className="flex items-center gap-1 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
              >
                <Plus size={16} />
                Add Criteria
              </button>
            </div>

            <div className="space-y-3">
              {taskData.rubricItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <input
                    type="text"
                    value={item.criteria}
                    onChange={(e) => handleRubricChange(index, 'criteria', e.target.value)}
                    placeholder="Evaluation criteria"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                    required
                  />
                  <input
                    type="number"
                    value={item.points}
                    onChange={(e) => handleRubricChange(index, 'points', e.target.value)}
                    placeholder="Points"
                    min="0"
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                    required
                  />
                  {taskData.rubricItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRubricItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Total Points Display */}
            <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
              <span className="font-medium text-gray-700">Total Points:</span>
              <span className="text-xl font-bold text-gray-800">{totalPoints}</span>
            </div>
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