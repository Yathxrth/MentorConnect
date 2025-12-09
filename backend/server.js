// Main server file with security enhancements
const express = require('express');
require('dotenv').config();
const connectDB = require('./db.js');
connectDB();
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const http = require('http');
const socketIO = require('socket.io');

// Import models
const userModel = require('./models/user');
const taskModel = require('./models/task');
const teamModel = require('./models/team');
const submissionModel = require('./models/submission');

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
  }
});

// CORS configuration with credentials
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Secret key for JWT from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-change-in-production';
const SALT_ROUNDS = 10;

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
    return res.status(401).json({ error: 'Please login first', requiresAuth: true });
  }
  
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.status(401).json({ error: 'Invalid token, please login again', requiresAuth: true });
  }
}

// Email domain validation function
function validateEmail(email, role) {
  const domain = email.split('@')[1];
  
  // Students must use @mnnit.ac.in email
  if (role === 'student') {
    if (domain !== 'mnnit.ac.in') {
      return { valid: false, error: 'Students must use @mnnit.ac.in email' };
    }
  }
  
  // Mentors can use any professional email
  if (role === 'mentor') {
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com']; // Add more as needed
    // For mentors, we'll be lenient and allow most emails
    if (!email.includes('@')) {
      return { valid: false, error: 'Invalid email format' };
    }
  }
  
  return { valid: true };
}

// ========== SOCKET.IO CHAT IMPLEMENTATION ==========

// Store online users
const onlineUsers = new Map();

io.on('connection', (socket) => {

  // When user connects with userId
  socket.on('user-online', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('online-users-count', onlineUsers.size);
  });

  // User joins a task chat room
  socket.on('join-task-room', (taskId) => {
    if (!taskId) return;
    socket.join(`task-${taskId}`);
  });

  // Typing Indicator
  socket.on("typing", ({ taskId, userId }) => {
    if (!taskId || !userId) return;
    socket.broadcast.to(`task-${taskId}`).emit("show-typing", { userId });
  });

  // Send message inside a task room
  socket.on('task-message', async (data) => {
    const { taskId, userId, userName, message } = data;

    // Message Validation
    if (!taskId) return;
    if (!message || typeof message !== "string") return;
    if (message.trim().length === 0) return;
    if (message.length > 500) return; // (optional) max length rule

    const messageData = {
      userId,
      userName,
      message: message.trim(),
      timestamp: new Date(),
      taskId
    };

    // Send message to everyone in the room
    io.to(`task-${taskId}`).emit('new-task-message', messageData);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('online-users-count', onlineUsers.size);
  });
});

// ========== AUTHENTICATION ROUTES ==========

// Signup route with bcrypt and email validation
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, githubUsername } = req.body;
    
    // Validate email domain
    const emailValidation = validateEmail(email, role);
    if (!emailValidation.valid) {
      return res.status(400).json({ error: emailValidation.error });
    }
    
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Hash password with bcrypt (10 rounds of salt)
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Create new user with hashed password
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      githubUsername: githubUsername || '',
      bio: '',
      skills: [],
      education: '',
      company: '',
      expertise: []
    });
    
    // Generate JWT token with longer expiry for persistent session
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' } // 30 days for persistent session
    );
    
    // Set secure HTTP-only cookie
    res.cookie('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    });
    
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
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed: ' + err.message });
  }
});

// Login route with bcrypt verification
app.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found with this email' });
    }
    
    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Incorrect password' });
    }
    
    // Check role matches
    if (user.role !== role) {
      return res.status(400).json({ error: 'Invalid role selected. Please select the correct role.' });
    }
    
    // Generate JWT token with longer expiry
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Set secure HTTP-only cookie
    res.cookie('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    
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
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// Verify token route - for checking if user is still logged in after page reload
app.get('/verify-token', isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) {
      res.clearCookie('token');
      return res.status(401).json({ error: 'User not found', requiresAuth: true });
    }
    
    res.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
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
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Access denied. Students only.' });
    }
    
    const user = await userModel.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update student profile
app.post('/student/profile/update', isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Access denied. Students only.' });
    }
    
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
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Access denied. Students only.' });
    }
    
    // Get user's active tasks
    const submissions = await submissionModel
      .find({ studentId: req.user.id })
      .populate('taskId')
      .populate('teamId');
    
    // Calculate stats
    const completedTasks = submissions.filter(s => s.status === 'reviewed').length;
    const activeTasks = submissions.filter(s => s.status === 'pending' || s.status === 'submitted').length;
    
    res.json({
      success: true,
      stats: {
        tasksCompleted: completedTasks,
        tasksActive: activeTasks,
        badgesEarned: 3
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
      .populate('mentorId', 'name company jobRole');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Apply to a task
app.post('/tasks/:id/apply', isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can apply to tasks' });
    }
    
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
      return res.status(400).json({ error: 'You have already applied to this task' });
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
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can submit work' });
    }
    
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
      return res.status(404).json({ error: 'Please apply to this task first' });
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
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can create teams' });
    }
    
    const { name } = req.body;
    
    // Generate unique 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const team = await teamModel.create({
      name,
      code,
      leaderId: req.user.id,
      members: [req.user.id]
    });
    
    // Populate members data
    await team.populate('members', 'name email');
    
    res.json({ success: true, message: 'Team created', team });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Join a team
app.post('/team/join', isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can join teams' });
    }
    
    const { code } = req.body;
    
    const team = await teamModel.findOne({ code });
    if (!team) {
      return res.status(404).json({ error: 'Invalid team code' });
    }
    
    // Check if already a member
    if (team.members.includes(req.user.id)) {
      return res.status(400).json({ error: 'You are already a member of this team' });
    }
    
    // Add member
    team.members.push(req.user.id);
    await team.save();
    
    // Populate members data
    await team.populate('members', 'name email');
    
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
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Leave team
app.post('/team/:id/leave', isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can leave teams' });
    }
    
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
        return res.json({ success: true, message: 'Team deleted as you were the last member' });
      }
    }
    
    await team.save();
    res.json({ success: true, message: 'Left team successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to leave team' });
  }
});

// ========== MENTOR ROUTES ==========

// Get mentor profile
app.get('/mentor/profile', isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ error: 'Access denied. Mentors only.' });
    }
    
    const user = await userModel.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update mentor profile
app.post('/mentor/profile/update', isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ error: 'Access denied. Mentors only.' });
    }
    
    const { name, bio, company, jobRole, expertise, yearsOfExperience } = req.body;
    
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { name, bio, company, jobRole, expertise, yearsOfExperience },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

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
      return res.status(403).json({ error: 'Access denied. Mentors only.' });
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
      return res.status(403).json({ error: 'Access denied. Mentors only.' });
    }
    
    // Get all tasks created by this mentor
    const tasks = await taskModel.find({ mentorId: req.user.id });
    const taskIds = tasks.map(t => t._id);
    
    // Get submissions for these tasks
    const submissions = await submissionModel
      .find({ taskId: { $in: taskIds } })
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
      return res.status(403).json({ error: 'Access denied. Mentors only.' });
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
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    res.json({ success: true, message: 'Evaluation submitted', submission });
  } catch (err) {
    res.status(500).json({ error: 'Failed to evaluate' });
  }
});

// Start server with Socket.io
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running securely on port ${PORT}`);
  console.log(`🔐 JWT authentication enabled`);
  console.log(`🔒 Bcrypt password hashing active`);
  console.log(`💬 Socket.io chat enabled`);
  console.log(`📡 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
});