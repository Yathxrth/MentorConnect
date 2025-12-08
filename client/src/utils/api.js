// API utility file for making backend calls
// Place this in: src/utils/api.js

const API_BASE_URL = 'http://localhost:3000';

// Helper function for making API calls
async function apiCall(endpoint, options = {}) {
  const config = {
    ...options,
    credentials: 'include', // Important for cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ========== AUTHENTICATION APIs ==========

export const signup = async (formData) => {
  return apiCall('/signup', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

export const login = async (formData) => {
  return apiCall('/login', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

export const logout = async () => {
  return apiCall('/logout');
};

// ========== STUDENT APIs ==========

export const getStudentProfile = async () => {
  return apiCall('/student/profile');
};

export const updateStudentProfile = async (profileData) => {
  return apiCall('/student/profile/update', {
    method: 'POST',
    body: JSON.stringify(profileData),
  });
};

export const getStudentDashboard = async () => {
  return apiCall('/student/dashboard');
};

// ========== TASK APIs ==========

export const getAllTasks = async () => {
  return apiCall('/tasks');
};

export const getTaskById = async (taskId) => {
  return apiCall(`/tasks/${taskId}`);
};

export const applyToTask = async (taskId, teamId = null) => {
  return apiCall(`/tasks/${taskId}/apply`, {
    method: 'POST',
    body: JSON.stringify({ teamId }),
  });
};

export const submitTask = async (taskId, submissionData) => {
  return apiCall(`/tasks/${taskId}/submit`, {
    method: 'POST',
    body: JSON.stringify(submissionData),
  });
};

// ========== TEAM APIs ==========

export const createTeam = async (teamName) => {
  return apiCall('/team/create', {
    method: 'POST',
    body: JSON.stringify({ name: teamName }),
  });
};

export const joinTeam = async (teamCode) => {
  return apiCall('/team/join', {
    method: 'POST',
    body: JSON.stringify({ code: teamCode }),
  });
};

export const getTeamDetails = async (teamId) => {
  return apiCall(`/team/${teamId}`);
};

export const leaveTeam = async (teamId) => {
  return apiCall(`/team/${teamId}/leave`, {
    method: 'POST',
  });
};

// ========== MENTOR APIs ==========

export const createTask = async (taskData) => {
  return apiCall('/mentor/task/create', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
};

export const getMentorTasks = async () => {
  return apiCall('/mentor/tasks');
};

export const getMentorSubmissions = async () => {
  return apiCall('/mentor/submissions');
};

export const evaluateSubmission = async (submissionId, evaluationData) => {
  return apiCall(`/mentor/evaluate/${submissionId}`, {
    method: 'POST',
    body: JSON.stringify(evaluationData),
  });
};