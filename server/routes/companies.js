const express = require('express');
const Company = require('../models/Companies');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a company (employers only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can create company profiles' });
    }
    
    const { name, description, logo, website, location } = req.body;
    
    // Check if employer already has a company
    const existingCompany = await Company.findOne({ employerId: req.user._id });
    if (existingCompany) {
      return res.status(400).json({ message: 'You already have a company profile' });
    }
    
    const company = new Company({
      name,
      description,
      logo,
      website,
      location,
      employerId: req.user._id
    });
    
    await company.save();
    
    res.status(201).json({
      message: 'Company profile created successfully',
      company
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get company by employer ID
router.get('/employer/:employerId', async (req, res) => {
  try {
    const company = await Company.findOne({ employerId: req.params.employerId });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update company (employers only)
router.put('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Check if user is the employer who created the company
    if (req.user.role !== 'employer' || company.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const { name, description, logo, website, location } = req.body;
    
    // Update fields
    if (name) company.name = name;
    if (description) company.description = description;
    if (logo) company.logo = logo;
    if (website) company.website = website;
    if (location) company.location = location;
    
    await company.save();
    
    res.json({
      message: 'Company profile updated successfully',
      company
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete company (employers only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Check if user is the employer who created the company
    if (req.user.role !== 'employer' || company.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await company.remove();
    
    res.json({ message: 'Company profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;