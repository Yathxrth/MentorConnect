import { useState } from 'react';
import { Github, Link2, FileText, Users } from 'lucide-react';

// Mentor Evaluation Component - Review and grade student submissions
function MentorEvaluation({ setCurrentPage }) {
  // State for scores
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState('');

  // Mock submission data
  const submission = {
    id: 1,
    taskTitle: 'Build a REST API with Node.js',
    teamName: 'Code Warriors',
    submittedDate: '2025-12-03',
    githubUrl: 'https://github.com/team/rest-api-project',
    demoUrl: 'https://demo.example.com',
    notes: 'We implemented all CRUD operations with proper error handling and authentication. The API is fully documented with Swagger.',
    teamMembers: [
      { id: 1, name: 'John Doe', email: 'john@college.edu' },
      { id: 2, name: 'Jane Smith', email: 'jane@college.edu' },
      { id: 3, name: 'Mike Johnson', email: 'mike@college.edu' }
    ]
  };

  // Mock rubric
  const rubric = [
    { id: 1, criteria: 'API endpoints working correctly', points: 30 },
    { id: 2, criteria: 'Database integration', points: 25 },
    { id: 3, criteria: 'Error handling', points: 20 },
    { id: 4, criteria: 'Code quality and documentation', points: 15 },
    { id: 5, criteria: 'Testing', points: 10 }
  ];

  // Handle score change
  const handleScoreChange = (rubricId, value) => {
    const maxPoints = rubric.find(r => r.id === rubricId).points;
    const numValue = parseInt(value) || 0;
    
    // Ensure score doesn't exceed max points
    if (numValue <= maxPoints) {
      setScores({
        ...scores,
        [rubricId]: numValue
      });
    }
  };

  // Calculate total score
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const maxScore = rubric.reduce((sum, item) => sum + item.points, 0);

  // Handle submit review
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all rubric items are scored
    const allScored = rubric.every(item => scores[item.id] !== undefined);
    if (!allScored) {
      alert('Please score all rubric criteria');
      return;
    }

    if (!feedback.trim()) {
      alert('Please provide feedback');
      return;
    }

    // Here you would send evaluation to backend
    console.log('Submitting evaluation:', { scores, feedback, totalScore });
    alert('Evaluation submitted successfully!');
    setCurrentPage('mentor-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('mentor-dashboard')}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Back to Dashboard
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Column - Submission Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Task Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-3">{submission.taskTitle}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>Team: {submission.teamName}</span>
                <span>Submitted: {submission.submittedDate}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                
                {/* GitHub Link */}
                {submission.githubUrl && (
                  <div className="flex items-center gap-2">
                    <Github size={20} className="text-gray-600" />
                    <a 
                      href={submission.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View GitHub Repository
                    </a>
                  </div>
                )}

                {/* Demo Link */}
                {submission.demoUrl && (
                  <div className="flex items-center gap-2">
                    <Link2 size={20} className="text-gray-600" />
                    <a 
                      href={submission.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Live Demo
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={20} className="text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">Submission Notes</h2>
              </div>
              <p className="text-gray-700">{submission.notes}</p>
            </div>

            {/* Evaluation Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Evaluation</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Rubric Scoring */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Score Each Criteria</h3>
                  <div className="space-y-4">
                    {rubric.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-gray-700 mb-1">{item.criteria}</p>
                          <p className="text-sm text-gray-500">Max: {item.points} points</p>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max={item.points}
                          value={scores[item.id] || ''}
                          onChange={(e) => handleScoreChange(item.id, e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 text-center"
                          placeholder="0"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  {/* Total Score */}
                  <div className="mt-4 p-4 bg-gray-800 text-white rounded-lg flex items-center justify-between">
                    <span className="font-bold text-lg">Total Score:</span>
                    <span className="text-2xl font-bold">{totalScore} / {maxScore}</span>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback to Team *
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="6"
                    placeholder="Provide detailed feedback on the submission..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium"
                  >
                    Submit Evaluation
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

          {/* Right Column - Team Info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Users size={20} className="text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">Team Members</h2>
              </div>

              <div className="space-y-3">
                {submission.teamMembers.map(member => (
                  <div key={member.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">Evaluation Tips:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Be specific in your feedback</li>
                  <li>• Highlight both strengths and areas for improvement</li>
                  <li>• Provide actionable suggestions</li>
                  <li>• Consider effort and learning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorEvaluation;