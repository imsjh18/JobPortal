const mongoose = require('mongoose');

// Company Schema
const companiesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  logo: String,
  website: String,
  location: String,
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create model
const Company = mongoose.model('Companies', companiesSchema);
module.exports = Company;  // No change needed here as the model name is already plural