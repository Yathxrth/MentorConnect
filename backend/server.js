// Main server file
const express = require('express');
require('dotenv').config();
const connectDB = require('./db.js');
connectDB();
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Import models
const userModel = require('./models/user');
const taskModel = require('./models/task');
const teamModel = require('./models/team');
const submissionModel = require('./models/submission');

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-here-change-in-production';

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Please login first' });
  }
  
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ========== AUTHENTICATION ROUTES ==========

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, githubUsername } = req.body;
    
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const user = await userModel.create({
      name,
      email,
      password, // In production, hash the password with bcrypt
      role: role || 'student',
      githubUsername: githubUsername || '',
      bio: '',
      skills: [],
      education: '',
      company: '',
      expertise: []
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie
    res.cookie('token', token, { httpOnly: true });
    
    res.json({ 
      success: true, 
      message: 'Signup successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (err) {
    res.status(500).json({ error: 'Signup failed: ' + err.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    // Check password (in production, use bcrypt.compare)
    if (user.password !== password) {
      return res.status(400).json({ error: 'Incorrect password' });
    }
    
    // Check role matches
    if (user.role !== role) {
      return res.status(400).json({ error: 'Invalid role selected' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie
    res.cookie('token', token, { httpOnly: true });
    
    res.json({ 
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// ========== STUDENT PROFILE ROUTES ==========

// Get student profile
app.get('/student/profile', isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update student profile
app.post('/student/profile/update', isLoggedIn, async (req, res) => {
  try {
    const { name, bio, skills, education, githubUrl, linkedinUrl } = req.body;
    
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        name,
        bio,
        skills,
        education,
        githubUrl,
        linkedinUrl
      },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get student dashboard data
app.get('/student/dashboard', isLoggedIn, async (req, res) => {
  try {
    // Get user's active tasks
    const submissions = await submissionModel
      .find({ studentId: req.user.id })
      .populate('taskId');
    
    // Calculate stats
    const completedTasks = submissions.filter(s => s.status === 'reviewed').length;
    const activeTasks = submissions.filter(s => s.status === 'pending' || s.status === 'submitted').length;
    
    res.json({
      success: true,
      stats: {
        tasksCompleted: completedTasks,
        tasksActive: activeTasks,
        badgesEarned: 3 // You can implement badge logic
      },
      activeTasks: submissions
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// ========== TASK ROUTES ==========

// Get all tasks (for browsing)
app.get('/tasks', isLoggedIn, async (req, res) => {
  try {
    const tasks = await taskModel.find({ status: 'active' })
      .populate('mentorId', 'name company');
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get single task details
app.get('/tasks/:id', isLoggedIn, async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id)
      .populate('mentorId', 'name company role');
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Apply to a task
app.post('/tasks/:id/apply', isLoggedIn, async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await taskModel.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Check if already applied
    const existingSubmission = await submissionModel.findOne({
      taskId,
      studentId: req.user.id
    });
    
    if (existingSubmission) {
      return res.status(400).json({ error: 'Already applied to this task' });
    }
    
    // Create submission
    const submission = await submissionModel.create({
      taskId,
      studentId: req.user.id,
      teamId: req.body.teamId || null,
      status: 'pending'
    });
    
    // Update task applicants count
    await taskModel.findByIdAndUpdate(taskId, {
      $inc: { applicants: 1 }
    });
    
    res.json({ success: true, message: 'Applied successfully', submission });
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply: ' + err.message });
  }
});

// Submit work for a task
app.post('/tasks/:id/submit', isLoggedIn, async (req, res) => {
  try {
    const { githubUrl, demoUrl, notes } = req.body;
    
    const submission = await submissionModel.findOneAndUpdate(
      { taskId: req.params.id, studentId: req.user.id },
      {
        githubUrl,
        demoUrl,
        notes,
        status: 'submitted',
        submittedAt: new Date()
      },
      { new: true }
    );
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    res.json({ success: true, message: 'Submitted successfully', submission });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit' });
  }
});

// ========== TEAM ROUTES ==========

// Create a team
app.post('/team/create', isLoggedIn, async (req, res) => {
  try {
    const { name } = req.body;
    
    // Generate unique 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const team = await teamModel.create({
      name,
      code,
      leaderId: req.user.id,
      members: [req.user.id]
    });
    
    res.json({ success: true, message: 'Team created', team });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Join a team
app.post('/team/join', isLoggedIn, async (req, res) => {
  try {
    const { code } = req.body;
    
    const team = await teamModel.findOne({ code });
    if (!team) {
      return res.status(404).json({ error: 'Invalid team code' });
    }
    
    // Check if already a member
    if (team.members.includes(req.user.id)) {
      return res.status(400).json({ error: 'Already a member' });
    }
    
    // Add member
    team.members.push(req.user.id);
    await team.save();
    
    res.json({ success: true, message: 'Joined team successfully', team });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join team' });
  }
});

// Get team details
app.get('/team/:id', isLoggedIn, async (req, res) => {
  try {
    const team = await teamModel.findById(req.params.id)
      .populate('members', 'name email')
      .populate('leaderId', 'name email');
    
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Leave team
app.post('/team/:id/leave', isLoggedIn, async (req, res) => {
  try {
    const team = await teamModel.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    // Remove member
    team.members = team.members.filter(m => m.toString() !== req.user.id);
    
    // If leader leaves, assign new leader or delete team
    if (team.leaderId.toString() === req.user.id) {
      if (team.members.length > 0) {
        team.leaderId = team.members[0];
      } else {
        await teamModel.findByIdAndDelete(req.params.id);
        return res.json({ success: true, message: 'Team deleted' });
      }
    }
    
    await team.save();
    res.json({ success: true, message: 'Left team successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to leave team' });
  }
});

// ========== MENTOR ROUTES (Basic - you mentioned to leave for now) ==========

// Create task (mentor only)
app.post('/mentor/task/create', isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ error: 'Only mentors can create tasks' });
    }
    
    const { title, description, deadline, difficulty, tags, rubric } = req.body;
    
    const task = await taskModel.create({
      title,
      description,
      deadline,
      difficulty,
      tags,
      rubric,
      mentorId: req.user.id,
      status: 'active'
    });
    
    res.json({ success: true, message: 'Task created', task });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Get mentor's tasks
app.get('/mentor/tasks', isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const tasks = await taskModel.find({ mentorId: req.user.id });
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get submissions for review
app.get('/mentor/submissions', isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get all tasks created by this mentor
    const tasks = await taskModel.find({ mentorId: req.user.id });
    const taskIds = tasks.map(t => t._id);
    
    // Get submissions for these tasks
    const submissions = await submissionModel
      .find({ taskId: { $in: taskIds }, status: 'submitted' })
      .populate('studentId', 'name email')
      .populate('taskId', 'title')
      .populate('teamId', 'name');
    
    res.json({ success: true, submissions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Evaluate submission
app.post('/mentor/evaluate/:submissionId', isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { scores, feedback, totalScore } = req.body;
    
    const submission = await submissionModel.findByIdAndUpdate(
      req.params.submissionId,
      {
        scores,
        feedback,
        totalScore,
        status: 'reviewed',
        reviewedAt: new Date()
      },
      { new: true }
    );
    
    res.json({ success: true, message: 'Evaluation submitted', submission });
  } catch (err) {
    res.status(500).json({ error: 'Failed to evaluate' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});