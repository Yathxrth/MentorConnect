import { useState } from 'react';
import { Upload, Github, Link2, FileText, MessageCircle } from 'lucide-react';

// Task Submission Component - Submit work and communicate with mentor
function TaskSubmission({ setCurrentPage }) {
  // State for submission form
  const [submissionData, setSubmissionData] = useState({
    githubUrl: '',
    demoUrl: '',
    notes: '',
    files: []
  });

  // State for comments
  const [newComment, setNewComment] = useState('');

  // Mock task data
  const taskData = {
    id: 1,
    title: 'Build a REST API with Node.js',
    description: 'Create a RESTful API for a blog platform with CRUD operations for posts, users, and comments.',
    mentor: 'Dr. Sarah Johnson',
    deadline: '2025-12-20',
    rubric: [
      { criteria: 'API endpoints working correctly', points: 30 },
      { criteria: 'Database integration', points: 25 },
      { criteria: 'Error handling', points: 20 },
      { criteria: 'Code quality and documentation', points: 15 },
      { criteria: 'Testing', points: 10 }
    ]
  };

  // Mock comments/messages
  const comments = [
    {
      id: 1,
      author: 'Dr. Sarah Johnson',
      role: 'Mentor',
      text: 'Looking forward to your submission! Make sure to include proper error handling.',
      time: '2 days ago'
    },
    {
      id: 2,
      author: 'You',
      role: 'Student',
      text: 'Thank you! Will make sure to cover all the rubric points.',
      time: '1 day ago'
    }
  ];

  // Handle input change
  const handleChange = (e) => {
    setSubmissionData({
      ...submissionData,
      [e.target.name]: e.target.value
    });
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSubmissionData({
      ...submissionData,
      files: [...submissionData.files, ...files]
    });
  };

  // Remove file
  const removeFile = (index) => {
    const newFiles = submissionData.files.filter((_, i) => i !== index);
    setSubmissionData({
      ...submissionData,
      files: newFiles
    });
  };

  // Handle submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    if (!submissionData.githubUrl && submissionData.files.length === 0) {
      alert('Please provide either a GitHub URL or upload files');
      return;
    }

    // Here you would send data to backend
    console.log('Submitting:', submissionData);
    alert('Submission successful! Your mentor will review it soon.');
  };

  // Handle add comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // Here you would send comment to backend
    console.log('Adding comment:', newComment);
    alert('Comment posted!');
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('student-dashboard')}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Back to Dashboard
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Column - Task Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Task Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-3">{taskData.title}</h1>
              <p className="text-gray-600 mb-4">{taskData.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>👨‍🏫 Mentor: {taskData.mentor}</span>
                <span>📅 Deadline: {taskData.deadline}</span>
              </div>
            </div>

            {/* Rubric */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Evaluation Rubric</h2>
              <div className="space-y-3">
                {taskData.rubric.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{item.criteria}</span>
                    <span className="font-semibold text-gray-800">{item.points} pts</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-gray-800 text-white rounded-lg font-bold">
                  <span>Total</span>
                  <span>{taskData.rubric.reduce((sum, item) => sum + item.points, 0)} pts</span>
                </div>
              </div>
            </div>

            {/* Submission Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Submit Your Work</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* GitHub URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Repository URL
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="url"
                      name="githubUrl"
                      value={submissionData.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/username/repo"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                    />
                  </div>
                </div>

                {/* Demo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demo URL (Optional)
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="url"
                      name="demoUrl"
                      value={submissionData.demoUrl}
                      onChange={handleChange}
                      placeholder="https://your-demo-site.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Files (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>
                  
                  {/* Display uploaded files */}
                  {submissionData.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {submissionData.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Notes
                  </label>
                  <textarea
                    name="notes"
                    value={submissionData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Add any notes about your submission..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium"
                >
                  Submit for Review
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Comments */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="text-gray-600" size={20} />
                <h2 className="text-xl font-bold text-gray-800">Discussion</h2>
              </div>

              {/* Comments List */}
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {comments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{comment.author}</p>
                        <p className="text-xs text-gray-500">{comment.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 ml-10">{comment.text}</p>
                    <p className="text-xs text-gray-500 ml-10 mt-1">{comment.time}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="border-t border-gray-200 pt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ask a question..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 text-sm"
                />
                <button
                  onClick={handleAddComment}
                  className="w-full mt-2 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskSubmission;