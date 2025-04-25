const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobs',  // Changed from 'Job' to 'Jobs'
    required: true
  },
  jobseekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',  // Changed from 'User' to 'Users'
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'rejected', 'accepted'],
    default: 'pending'
  },
  resume: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const Applications = mongoose.model('Applications', applicationSchema);  // Changed from 'Application' to 'Applications'

module.exports = Applications;