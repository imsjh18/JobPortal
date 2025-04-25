const express = require('express');
const Job = require('../models/Jobs');
const Applications = require('../models/Applications');  // Changed from 'Application' to 'Applications'
const auth = require('../middleware/auth');

const router = express.Router();

// Create a job (employers only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can post jobs' });
    }
    
    const { title, company, location, description, requirements, salary, expiresAt } = req.body;
    
    const job = new Job({
      title,
      company,
      location,
      description,
      requirements,
      salary,
      employerId: req.user._id,
      expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days
    });
    
    await job.save();
    
    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply for a job (jobseekers only)
router.post('/:id/apply', auth, async (req, res) => {
  try {
    // Check if user is a jobseeker
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Only jobseekers can apply for jobs' });
    }
    
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if already applied
    const existingApplication = await Applications.findOne({
      jobId: job._id,
      jobseekerId: req.user._id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    
    const { resume, coverLetter } = req.body;
    
    const application = new Applications({
      jobId: job._id,
      jobseekerId: req.user._id,
      resume,
      coverLetter
    });
    
    await application.save();
    
    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for a job (employers only)
router.get('/:id/applications', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user is the employer who posted the job
    if (req.user.role !== 'employer' || job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const applications = await Applications.find({ jobId: job._id })
      .populate('jobseekerId', 'firstName lastName email');
    
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;