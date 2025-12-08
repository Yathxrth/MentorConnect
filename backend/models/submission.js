// Submission model for student task submissions
const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
  // References
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  
  // Submission details
  githubUrl: {
    type: String,
    default: ''
  },
  demoUrl: {
    type: String,
    default: ''
  },
  driveLink: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'submitted', 'reviewed'],
    default: 'pending'
  },
  
  // Evaluation
  scores: {
    type: Map,
    of: Number,
    default: {}
  },
  feedback: {
    type: String,
    default: ''
  },
  totalScore: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  appliedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date,
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Submission', submissionSchema);