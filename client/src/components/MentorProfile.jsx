import { useState } from 'react';
import { Mail, Briefcase, Building, Edit2 } from 'lucide-react';

// Mentor Profile Component - View and edit mentor information
function MentorProfile({ setCurrentPage, userData }) {
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: userData?.name || 'Dr. Sarah Johnson',
    email: userData?.email || 'sarah@company.com',
    company: 'Tech Corp',
    role: 'Senior Software Engineer',
    expertise: ['Web Development', 'Cloud Architecture', 'Node.js', 'React', 'MongoDB'],
    bio: 'Experienced software engineer with 10+ years in the industry. Passionate about mentoring the next generation of developers.',
    yearsOfExperience: '10+',
    newExpertise: ''
  });

  // Mock tasks created
  const tasksCreated = [
    { id: 1, title: 'Build a REST API', teams: 3, completed: 2 },
    { id: 2, title: 'Frontend Design Challenge', teams: 4, completed: 3 },
    { id: 3, title: 'Database Optimization', teams: 2, completed: 1 }
  ];

  // Mock mentoring stats
  const mentoringStats = {
    totalTasks: 5,
    teamsmentored: 9,
    studentsHelped: 32
  };

  // Handle input change
  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  // Add new expertise
  const handleAddExpertise = () => {
    if (profileData.newExpertise.trim()) {
      setProfileData({
        ...profileData,
        expertise: [...profileData.expertise, profileData.newExpertise.trim()],
        newExpertise: ''
      });
    }
  };

  // Remove expertise
  const handleRemoveExpertise = (itemToRemove) => {
    setProfileData({
      ...profileData,
      expertise: profileData.expertise.filter(item => item !== itemToRemove)
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

              {/* Professional Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Building size={18} className="text-gray-600" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="company"
                      value={profileData.company}
                      onChange={handleChange}
                      className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                      placeholder="Company"
                    />
                  ) : (
                    <span className="text-sm text-gray-700">{profileData.company}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-gray-600" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="role"
                      value={profileData.role}
                      onChange={handleChange}
                      className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                      placeholder="Role"
                    />
                  ) : (
                    <span className="text-sm text-gray-700">{profileData.role}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Mentoring Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Mentoring Impact</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold text-gray-800">{mentoringStats.totalTasks}</p>
                  <p className="text-sm text-gray-600">Tasks Created</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{mentoringStats.teamsmentored}</p>
                  <p className="text-sm text-gray-600">Teams Mentored</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{mentoringStats.studentsHelped}</p>
                  <p className="text-sm text-gray-600">Students Helped</p>
                </div>
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

            {/* Experience */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Years of Experience</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="yearsOfExperience"
                  value={profileData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-800"
                />
              ) : (
                <p className="text-gray-600">{profileData.yearsOfExperience} years</p>
              )}
            </div>

            {/* Expertise */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.expertise.map((item, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2">
                    {item}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveExpertise(item)}
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
                    name="newExpertise"
                    value={profileData.newExpertise}
                    onChange={handleChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddExpertise()}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-800"
                    placeholder="Add expertise area"
                  />
                  <button
                    onClick={handleAddExpertise}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Tasks Created */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Tasks Created</h3>
              <div className="space-y-3">
                {tasksCreated.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-600">
                        {task.teams} teams • {task.completed} completed
                      </p>
                    </div>
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

export default MentorProfile;