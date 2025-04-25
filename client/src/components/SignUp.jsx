import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Select,
  InputLabel,
  Checkbox,
  Link as MuiLink,
  Paper,
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack, ArrowForward } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function Signup() {
  const { role } = useParams(); // Get the role from URL params (jobseeker or employer)
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [userType, setUserType] = useState(role || 'jobseeker');
  
  // Basic account information
  const [accountInfo, setAccountInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Additional information for job seekers
  const [jobSeekerInfo, setJobSeekerInfo] = useState({
    title: '',
    experience: '',
    skills: '',
    educationLevel: '',
    resume: null,
    linkedinProfile: '',
    openToRemote: false
  });

  // Additional information for employers
  const [employerInfo, setEmployerInfo] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    companyWebsite: '',
    companyDescription: '',
    contactPhone: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Update title based on role
  useEffect(() => {
    if (role) {
      setUserType(role);
    }
  }, [role]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    // Clear specific error when field is changed
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // Handle different form sections
    if (['firstName', 'lastName', 'email', 'password', 'confirmPassword'].includes(name)) {
      setAccountInfo(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (userType === 'jobseeker') {
      setJobSeekerInfo(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    } else if (userType === 'employer') {
      setEmployerInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    setJobSeekerInfo(prev => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

  const validateStep = () => {
    const errors = {};

    if (activeStep === 0) {
      // Validate account information
      if (!accountInfo.firstName.trim()) errors.firstName = 'First name is required';
      if (!accountInfo.lastName.trim()) errors.lastName = 'Last name is required';
      
      if (!accountInfo.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(accountInfo.email)) {
        errors.email = 'Email is invalid';
      }
      
      if (!accountInfo.password) {
        errors.password = 'Password is required';
      } else if (accountInfo.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      if (!accountInfo.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (accountInfo.password !== accountInfo.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (activeStep === 1) {
      // Validate profile information based on user type
      if (userType === 'jobseeker') {
        if (!jobSeekerInfo.title.trim()) errors.title = 'Job title is required';
        if (!jobSeekerInfo.skills.trim()) errors.skills = 'Please add at least one skill';
      } else if (userType === 'employer') {
        if (!employerInfo.companyName.trim()) errors.companyName = 'Company name is required';
        if (!employerInfo.industry.trim()) errors.industry = 'Industry is required';
        if (!employerInfo.companySize) errors.companySize = 'Company size is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const { register } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateStep()) {
      return;
    }

    // Combine all data based on user type
    const formData = {
      ...accountInfo,
      userType,
      ...(userType === 'jobseeker' ? { profile: jobSeekerInfo } : { company: employerInfo })
    };

    try {
      // Use the register function from AuthContext
      await register(formData);
      // On success, redirect to success page with role and email
      navigate('/signup-success', { state: { role: userType, email: accountInfo.email } });
    } catch (error) {
      setFormErrors({
        form: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>  
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                value={accountInfo.firstName}
                onChange={handleChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
              />
            </Grid>
            <Grid xs={12} sm={6}> 
              <TextField
                autoComplete="family-name"
                name="lastName"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                value={accountInfo.lastName}
                onChange={handleChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="email"
                name="email"
                required
                fullWidth
                id="email"
                label="Email"
                type="email"
                value={accountInfo.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                fullWidth
                required
                value={accountInfo.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                fullWidth
                required
                value={accountInfo.confirmPassword}
                onChange={handleChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Account Type</FormLabel>
                <RadioGroup
                  row
                  name="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <FormControlLabel 
                    value="jobseeker" 
                    control={<Radio />} 
                    label="Job Seeker" 
                    sx={{ mr: 4 }}
                  />
                  <FormControlLabel 
                    value="employer" 
                    control={<Radio />} 
                    label="Employer" 
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return userType === 'jobseeker' ? (
          // Job Seeker Profile Form
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Professional Title"
                fullWidth
                required
                value={jobSeekerInfo.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                placeholder="e.g. Software Developer"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!formErrors.experience}>
                <InputLabel id="experience-label">Years of Experience</InputLabel>
                <Select
                  labelId="experience-label"
                  id="experience"
                  name="experience"
                  value={jobSeekerInfo.experience}
                  label="Years of Experience"
                  onChange={handleChange}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="0-1">Less than 1 year</MenuItem>
                  <MenuItem value="1-3">1-3 years</MenuItem>
                  <MenuItem value="3-5">3-5 years</MenuItem>
                  <MenuItem value="5-10">5-10 years</MenuItem>
                  <MenuItem value="10+">10+ years</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="skills"
                label="Skills"
                fullWidth
                required
                multiline
                rows={2}
                value={jobSeekerInfo.skills}
                onChange={handleChange}
                error={!!formErrors.skills}
                helperText={formErrors.skills || "Separate skills with commas (e.g. JavaScript, React, Node.js)"}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="education-label">Education Level</InputLabel>
                <Select
                  labelId="education-label"
                  id="educationLevel"
                  name="educationLevel"
                  value={jobSeekerInfo.educationLevel}
                  label="Education Level"
                  onChange={handleChange}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="high-school">High School</MenuItem>
                  <MenuItem value="associate">Associate Degree</MenuItem>
                  <MenuItem value="bachelor">Bachelor's Degree</MenuItem>
                  <MenuItem value="master">Master's Degree</MenuItem>
                  <MenuItem value="doctorate">Doctorate</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="linkedinProfile"
                label="LinkedIn Profile (Optional)"
                fullWidth
                value={jobSeekerInfo.linkedinProfile}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 1, textTransform: 'none' }}
              >
                Upload Resume (Optional)
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </Button>
              {jobSeekerInfo.resume && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  File: {jobSeekerInfo.resume.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="openToRemote"
                    checked={jobSeekerInfo.openToRemote}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="I am open to remote work opportunities"
              />
            </Grid>
          </Grid>
        ) : (
          // Employer Profile Form
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="companyName"
                label="Company Name"
                fullWidth
                required
                value={employerInfo.companyName}
                onChange={handleChange}
                error={!!formErrors.companyName}
                helperText={formErrors.companyName}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!formErrors.industry}>
                <InputLabel id="industry-label">Industry</InputLabel>
                <Select
                  labelId="industry-label"
                  id="industry"
                  name="industry"
                  value={employerInfo.industry}
                  label="Industry"
                  onChange={handleChange}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="technology">Technology</MenuItem>
                  <MenuItem value="healthcare">Healthcare</MenuItem>
                  <MenuItem value="finance">Finance & Banking</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="retail">Retail & E-commerce</MenuItem>
                  <MenuItem value="manufacturing">Manufacturing</MenuItem>
                  <MenuItem value="food">Food & Hospitality</MenuItem>
                  <MenuItem value="transportation">Transportation & Logistics</MenuItem>
                  <MenuItem value="media">Media & Entertainment</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!formErrors.companySize}>
                <InputLabel id="company-size-label">Company Size</InputLabel>
                <Select
                  labelId="company-size-label"
                  id="companySize"
                  name="companySize"
                  value={employerInfo.companySize}
                  label="Company Size"
                  onChange={handleChange}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="1-10">1-10 employees</MenuItem>
                  <MenuItem value="11-50">11-50 employees</MenuItem>
                  <MenuItem value="51-200">51-200 employees</MenuItem>
                  <MenuItem value="201-500">201-500 employees</MenuItem>
                  <MenuItem value="501-1000">501-1000 employees</MenuItem>
                  <MenuItem value="1001+">1001+ employees</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="companyWebsite"
                label="Company Website"
                fullWidth
                value={employerInfo.companyWebsite}
                onChange={handleChange}
                placeholder="https://www.example.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contactPhone"
                label="Contact Phone Number"
                fullWidth
                value={employerInfo.contactPhone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="companyDescription"
                label="Company Description"
                fullWidth
                multiline
                rows={3}
                value={employerInfo.companyDescription}
                onChange={handleChange}
                placeholder="Tell potential candidates about your company's mission and culture"
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review your information
            </Typography>
            
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
              <Typography variant="subtitle1" fontWeight="bold">Account Details</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                </Grid>
                <Grid item xs={6} textAlign="left">
                  <Typography variant="body2">{accountInfo.firstName} {accountInfo.lastName}</Typography>
                </Grid>
                
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                </Grid>
                <Grid item xs={6} textAlign="left">
                  <Typography variant="body2">{accountInfo.email}</Typography>
                </Grid>
                
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2" color="text.secondary">Account Type:</Typography>
                </Grid>
                <Grid item xs={6} textAlign="left">
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{userType}</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            {userType === 'jobseeker' ? (
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" fontWeight="bold">Professional Details</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2" color="text.secondary">Title:</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="left">
                    <Typography variant="body2">{jobSeekerInfo.title || 'Not provided'}</Typography>
                  </Grid>
                  
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2" color="text.secondary">Experience:</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="left">
                    <Typography variant="body2">{jobSeekerInfo.experience || 'Not provided'}</Typography>
                  </Grid>
                  
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2" color="text.secondary">Education:</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="left">
                    <Typography variant="body2">{jobSeekerInfo.educationLevel || 'Not provided'}</Typography>
                  </Grid>
                  
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2" color="text.secondary">Resume:</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="left">
                    <Typography variant="body2">
                      {jobSeekerInfo.resume ? jobSeekerInfo.resume.name : 'Not uploaded'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2" color="text.secondary">Remote Work:</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="left">
                    <Typography variant="body2">
                      {jobSeekerInfo.openToRemote ? 'Open to remote work' : 'Not specified'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" fontWeight="bold">Company Details</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2" color="text.secondary">Company:</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="left">
                    <Typography variant="body2">{employerInfo.companyName || 'Not provided'}</Typography>
                  </Grid>
                  
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2" color="text.secondary">Industry:</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="left">
                    <Typography variant="body2">{employerInfo.industry || 'Not provided'}</Typography>
                  </Grid>
                  
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2" color="text.secondary">Size:</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="left">
                    <Typography variant="body2">{employerInfo.companySize || 'Not provided'}</Typography>
                  </Grid>
                  
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2" color="text.secondary">Website:</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="left">
                    <Typography variant="body2">{employerInfo.companyWebsite || 'Not provided'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
              By clicking "Register" you agree to our terms of service and privacy policy.
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: userType === 'employer' ? 'primary.main' : 'secondary.main' }}>
          {userType === 'employer' ? <BusinessIcon /> : <PersonIcon />}
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Join as a{userType === 'employer' ? 'n employer' : ' job seeker'}
        </Typography>

        {/* Back to Home Button */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button startIcon={<ArrowBack />} color="inherit">
              Back to Home
            </Button>
          </Link>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
          <Step>
            <StepLabel>Account</StepLabel>
          </Step>
          <Step>
            <StepLabel>Profile</StepLabel>
          </Step>
          <Step>
            <StepLabel>Review</StepLabel>
          </Step>
        </Stepper>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          {getStepContent(activeStep)}

          {formErrors.form && (
            <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              {formErrors.form}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box>
              {activeStep === 2 ? (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: 'black',
                    color: 'white',
                    borderRadius: 2,
                  }}
                >
                  Register
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: 'black',
                    color: 'white',
                    borderRadius: 2,
                  }}
                >
                  Continue
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Divider sx={{ my: 2 }}/>
          <Typography variant="body2">
            Already have an account?{' '}
            <MuiLink component={Link} to="/signin" variant="body2">
              Sign in here
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}