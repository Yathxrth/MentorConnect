import { useState } from 'react';
import { Users, Copy, Check } from 'lucide-react';

// Team Management Component - Create or join teams
function TeamManagement({ setCurrentPage }) {
  // State for current view
  const [view, setView] = useState('selection'); // 'selection', 'create', 'join', 'team'
  
  // State for team code
  const [teamCode, setTeamCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  // State for team name
  const [teamName, setTeamName] = useState('');

  // Mock current team data
  const [currentTeam, setCurrentTeam] = useState(null);

  // Mock team members
  const teamMembers = [
    { id: 1, name: 'Narendra Prajapat', role: 'Leader', email: 'narendra@mnnit.ac.in' },
    { id: 2, name: 'Yatharth Singh', role: 'Member', email: 'yatharth@mnnit.ac.in' },
    { id: 3, name: 'Parth Kishan', role: 'Member', email: 'parth@mnnit.ac.in' }
  ];

  // Generate random team code
  const generateTeamCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return code;
  };

  // Handle create team
  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      alert('Please enter a team name');
      return;
    }

    const code = generateTeamCode();
    setGeneratedCode(code);
    
    // Here you would send data to backend
    console.log('Creating team:', { name: teamName, code: code });
    
    // Set current team
    setCurrentTeam({
      name: teamName,
      code: code,
      role: 'Leader'
    });
    
    setView('team');
  };

  // Handle join team
  const handleJoinTeam = () => {
    if (!teamCode.trim()) {
      alert('Please enter a team code');
      return;
    }

    // Here you would verify code with backend
    console.log('Joining team with code:', teamCode);
    
    // Mock joining team
    setCurrentTeam({
      name: 'Lost Cause',
      code: teamCode,
      role: 'Member'
    });
    
    alert('Successfully joined the team!');
    setView('team');
  };

  // Copy team code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode || currentTeam?.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Leave team
  const handleLeaveTeam = () => {
    if (window.confirm('Are you sure you want to leave this team?')) {
      setCurrentTeam(null);
      setView('selection');
      setTeamCode('');
      setTeamName('');
      setGeneratedCode('');
    }
  };

  // Render team selection view
  if (view === 'selection') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Team Management</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Create Team Card */}
            <div className="bg-white rounded-lg shadow-sm p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Create Team</h2>
              <p className="text-gray-600 mb-6">
                Start a new team and invite others to join using a team code
              </p>
              <button
                onClick={() => setView('create')}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 w-full"
              >
                Create New Team
              </button>
            </div>

            {/* Join Team Card */}
            <div className="bg-white rounded-lg shadow-sm p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Join Team</h2>
              <p className="text-gray-600 mb-6">
                Join an existing team using the code shared by your team leader
              </p>
              <button
                onClick={() => setView('join')}
                className="px-6 py-3 bg-white text-gray-800 border-2 border-gray-800 rounded-lg hover:bg-gray-100 w-full"
              >
                Join Existing Team
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render create team view
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Team</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                />
              </div>

              <button
                onClick={handleCreateTeam}
                className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                Create Team
              </button>

              <button
                onClick={() => setView('selection')}
                className="w-full py-3 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render join team view
  if (view === 'join') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Join Team</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Code
                </label>
                <input
                  type="text"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 uppercase"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Ask your team leader for the team code
                </p>
              </div>

              <button
                onClick={handleJoinTeam}
                className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                Join Team
              </button>

              <button
                onClick={() => setView('selection')}
                className="w-full py-3 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render team view (after creating or joining)
  if (view === 'team' && currentTeam) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Team Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{currentTeam.name}</h1>
                <p className="text-gray-600 mt-1">Your role: {currentTeam.role}</p>
              </div>
              <button
                onClick={handleLeaveTeam}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Leave Team
              </button>
            </div>
          </div>

          {/* Team Code */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Team Code</h2>
            <p className="text-gray-600 mb-3">Share this code with others to invite them</p>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-3 bg-gray-100 rounded-lg text-center">
                <span className="text-2xl font-bold text-gray-800 tracking-widest">
                  {currentTeam.code}
                </span>
              </div>
              <button
                onClick={copyToClipboard}
                className="px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Team Members</h2>
            
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-lg font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    member.role === 'Leader' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default TeamManagement;