import { useState } from 'react';
import { Mail, Github, Linkedin, Award, Edit2 } from 'lucide-react';

// Student Profile Component - View and edit student information
function StudentProfile({ setCurrentPage, userData }) {
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: userData?.name || 'John Doe',
    email: userData?.email || 'john@college.edu',
    bio: 'Computer Science student passionate about web development and AI',
    skills: ['React', 'JavaScript', 'Python', 'Node.js', 'MongoDB'],
    education: 'B.Tech Computer Science, XYZ College',
    githubUrl: 'https://github.com/johndoe',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    newSkill: ''
  });

  // Mock badges
  const badges = [
    { id: 1, name: 'First Task Completed', icon: '🎯' },
    { id: 2, name: 'Team Player', icon: '👥' },
    { id: 3, name: 'Quick Learner', icon: '⚡' }
  ];

  // Mock completed tasks
  const completedTasks = [
    { id: 1, title: 'Build a Todo App', score: 95, date: '2025-11-15' },
    { id: 2, title: 'API Integration Project', score: 88, date: '2025-11-20' },
    { id: 3, title: 'Database Design', score: 92, date: '2025-11-25' }
  ];

  // Handle input change
  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  // Add new skill
  const handleAddSkill = () => {
    if (profileData.newSkill.trim()) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, profileData.newSkill.trim()],
        newSkill: ''
      });
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Save profile
  const handleSave = () => {
    // Here you would send data to backend
    console.log('Saving profile:', profileData);
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            <Edit2 size={18} />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Column - Basic Info */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                {/* Profile initial circle */}
                <div className="w-24 h-24 mx-auto bg-gray-800 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                  {profileData.name.charAt(0)}
                </div>
                
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="text-xl font-bold text-gray-800 w-full text-center border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-gray-800">{profileData.name}</h2>
                )}
                
                <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
                  <Mail size={16} />
                  <span className="text-sm">{profileData.email}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Github size={18} className="text-gray-600" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="githubUrl"
                      value={profileData.githubUrl}
                      onChange={handleChange}
                      className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                      placeholder="GitHub URL"
                    />
                  ) : (
                    <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      GitHub Profile
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Linkedin size={18} className="text-gray-600" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="linkedinUrl"
                      value={profileData.linkedinUrl}
                      onChange={handleChange}
                      className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                      placeholder="LinkedIn URL"
                    />
                  ) : (
                    <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="text-gray-600" size={20} />
                <h3 className="text-lg font-bold text-gray-800">Badges</h3>
              </div>
              
              <div className="space-y-3">
                {badges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-sm text-gray-800">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Bio */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">About Me</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-800"
                />
              ) : (
                <p className="text-gray-600">{profileData.bio}</p>
              )}
            </div>

            {/* Education */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Education</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="education"
                  value={profileData.education}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-800"
                />
              ) : (
                <p className="text-gray-600">{profileData.education}</p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2">
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    name="newSkill"
                    value={profileData.newSkill}
                    onChange={handleChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-800"
                    placeholder="Add a skill"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Completed Tasks */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Completed Tasks</h3>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.date}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Score: {task.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <button
                onClick={handleSave}
                className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;