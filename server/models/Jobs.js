const mongoose = require('mongoose');

// Job Schema
const jobsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  salary: String,
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

// Create model
const Jobs = mongoose.model('Jobs', jobsSchema);  // Changed from 'Job' to 'Jobs'
module.exports = Jobs;  // No change needed here as the model name is already plural