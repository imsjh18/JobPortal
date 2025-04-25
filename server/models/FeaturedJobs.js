const mongoose = require('mongoose');

const featuredJobsSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobs',  // Ensure this matches the plural form
    required: true
  },
  featuredAt: {
    type: Date,
    default: Date.now
  }
});

const FeaturedJobs = mongoose.model('FeaturedJobs', featuredJobsSchema);

module.exports = FeaturedJobs;