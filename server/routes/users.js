const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');  // Changed from 'User' to 'Users'
const auth = require('../middleware/auth');

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    // Extract basic user data
    const { firstName, lastName, email, password, userType, profile, company } = req.body;
    const role = userType || req.body.role; // Support both formats
    
    // Validate input
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate role
    if (!['jobseeker', 'employer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Check if user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user with basic info
    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    };
    
    // Add additional profile data if provided
    if (role === 'jobseeker' && profile) {
      // Add relevant jobseeker profile fields
      userData.title = profile.title;
      userData.skills = profile.skills;
      userData.experience = profile.experience;
      userData.education = profile.educationLevel;
      userData.linkedinProfile = profile.linkedinProfile;
    } else if (role === 'employer' && company) {
      // Add relevant employer/company fields
      userData.companyName = company.companyName;
      userData.industry = company.industry;
      userData.companySize = company.companySize;
      userData.companyWebsite = company.companyWebsite;
      userData.companyDescription = company.companyDescription;
    }
    
    const user = new Users(userData);
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check if role matches
    if (user.role !== role) {
      return res.status(400).json({ message: `Invalid account type. Please login as a ${user.role}` });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // The auth middleware already attaches the user to req.user, no need to find again
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create a profile object based on user role
    let profile;
    if (user.role === 'jobseeker') {
      profile = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        title: user.title,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        linkedinProfile: user.linkedinProfile,
        contactPhone: user.contactPhone,
        resume: user.resume
      };
    } else if (user.role === 'employer') {
      profile = {
        id: user._id,
        email: user.email,
        companyName: user.companyName,
        industry: user.industry,
        companySize: user.companySize,
        companyWebsite: user.companyWebsite,
        companyDescription: user.companyDescription,
        contactPhone: user.contactPhone,
        location: user.location
      };
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    // The auth middleware already attaches the user to req.user, no need to find again
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields based on user role
    if (user.role === 'jobseeker') {
      const { firstName, lastName, title, bio, skills, experience, education, linkedinProfile, contactPhone } = req.body;
      
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (title) user.title = title;
      if (bio) user.bio = bio;
      if (skills) user.skills = skills;
      if (experience) user.experience = experience;
      if (education) user.education = education;
      if (linkedinProfile) user.linkedinProfile = linkedinProfile;
      if (contactPhone) user.contactPhone = contactPhone;
    } else if (user.role === 'employer') {
      const { companyName, industry, companySize, companyWebsite, companyDescription, contactPhone, location } = req.body;
      
      if (companyName) user.companyName = companyName;
      if (industry) user.industry = industry;
      if (companySize) user.companySize = companySize;
      if (companyWebsite) user.companyWebsite = companyWebsite;
      if (companyDescription) user.companyDescription = companyDescription;
      if (contactPhone) user.contactPhone = contactPhone;
      if (location) user.location = location;
    }
    
    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all companies registered by employers
router.get('/companies', async (req, res) => {
  try {
    // Find all users with role 'employer' and having company information
    const employers = await Users.find({ 
      role: 'employer',
      companyName: { $exists: true, $ne: '' } 
    }).select({
      _id: 1,
      companyName: 1,
      industry: 1,
      companySize: 1,
      companyWebsite: 1,
      companyDescription: 1,
      location: 1
    });
    
    // Format the response to only include company information
    const companies = employers.map(employer => ({
      id: employer._id,
      companyName: employer.companyName,
      industry: employer.industry,
      companySize: employer.companySize,
      companyWebsite: employer.companyWebsite,
      companyDescription: employer.companyDescription,
      location: employer.location
    }));
    
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;