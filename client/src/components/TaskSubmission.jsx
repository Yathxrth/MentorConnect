import TaskChat from './TaskChat';
import { useState, useEffect } from 'react';
import { Upload, Github, Link2, FileText } from 'lucide-react';
import { getTaskById, submitTask } from '../utils/api';

function TaskSubmission({ setCurrentPage, taskId }) {
  const [submissionData, setSubmissionData] = useState({
    githubUrl: '',
    demoUrl: '',
    notes: ''
  });
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const response = await getTaskById(taskId);
      if (response.success) {
        setTask(response.task);
      }
    } catch (err) {
      setError('Failed to load task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setSubmissionData({
      ...submissionData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await submitTask(taskId, submissionData);
      if (response.success) {
        setSuccess('Submitted successfully!');
        alert('Submission successful!');
        setCurrentPage('student-dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading task...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setCurrentPage('student-dashboard')} 
          className="mb-6 text-gray-600 hover:text-gray-800">
          ← Back to Dashboard
        </button>

        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{task?.title}</h1>
          <p className="text-gray-600 mb-4">{task?.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <TaskChat taskId={task._id} userData={userData} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Submit Your Work</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository URL</label>
              <div className="relative">
                <Github className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="url"
                  name="githubUrl"
                  value={submissionData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Demo URL (Optional)</label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="url"
                  name="demoUrl"
                  value={submissionData.demoUrl}
                  onChange={handleChange}
                  placeholder="https://your-demo-site.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Submission Notes</label>
              <textarea
                name="notes"
                value={submissionData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Add any notes about your submission..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskSubmission;