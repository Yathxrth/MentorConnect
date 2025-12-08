// User model for both students and mentors
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/obsidian_circle');

const userSchema = mongoose.Schema({
  // Basic info
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
    // In production, hash with bcrypt before saving
  },
  role: {
    type: String,
    enum: ['student', 'mentor'],
    default: 'student'
  },
  
  // Profile info (common)
  bio: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  linkedinUrl: {
    type: String,
    default: ''
  },
  
  // Student-specific fields
  skills: {
    type: [String],
    default: []
  },
  education: {
    type: String,
    default: ''
  },
  githubUsername: {
    type: String,
    default: ''
  },
  
  // Mentor-specific fields
  company: {
    type: String,
    default: ''
  },
  jobRole: {
    type: String,
    default: ''
  },
  expertise: {
    type: [String],
    default: []
  },
  yearsOfExperience: {
    type: String,
    default: ''
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);