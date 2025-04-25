const express = require('express');
const Applications = require('../models/Applications');  // Changed from Application to Applications
const Job = require('../models/Jobs');  // Changed from '../models/Job' to '../models/Jobs'
const auth = require('../middleware/auth');

const router = express.Router();

// Get all applications for a jobseeker
router.get('/jobseeker', auth, async (req, res) => {
  try {
    // Check if user is a jobseeker
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const applications = await Applications.find({ jobseekerId: req.user._id })
      .populate('jobId', 'title company location salary')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications for an employer
router.get('/employer', auth, async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Find all jobs posted by this employer
    const jobs = await Job.find({ employerId: req.user._id });
    const jobIds = jobs.map(job => job._id);
    
    // Find all applications for these jobs
    const applications = await Applications.find({ jobId: { $in: jobIds } })
      .populate('jobId', 'title company location')
      .populate('jobseekerId', 'firstName lastName email')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get application by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Applications.findById(req.params.id)
      .populate('jobId')
      .populate('jobseekerId', 'firstName lastName email');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user is authorized to view this application
    const job = await Job.findById(application.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (req.user.role === 'jobseeker' && application.jobseekerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    if (req.user.role === 'employer' && job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (employers only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can update application status' });
    }
    
    const { status } = req.body;
    
    if (!['pending', 'reviewed', 'rejected', 'accepted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const application = await Applications.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if employer owns the job this application is for
    const job = await Job.findById(application.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    application.status = status;
    await application.save();
    
    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete application (jobseekers only - withdraw application)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is a jobseeker
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Only jobseekers can withdraw applications' });
    }
    
    const application = await Applications.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if jobseeker owns this application
    if (application.jobseekerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await Applications.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;