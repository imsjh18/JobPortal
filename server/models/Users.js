const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const usersSchema = new mongoose.Schema({
  // Basic user information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['jobseeker', 'employer'], required: true },
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  
  // Job seeker specific fields
  title: { type: String }, // Job title/position
  bio: { type: String },
  skills: { type: String },
  experience: { type: String },
  education: { type: String },
  resume: { type: String },
  linkedinProfile: { type: String },
  
  // Employer specific fields
  companyName: { type: String },
  industry: { type: String },
  companySize: { type: String },
  companyWebsite: { type: String },
  companyDescription: { type: String },
  contactPhone: { type: String },
  location: { type: String }
});

// Create model
const Users = mongoose.model('Users', usersSchema);  // Changed from 'User' to 'Users'
module.exports = Users;  // No change needed here as the model name is already plural