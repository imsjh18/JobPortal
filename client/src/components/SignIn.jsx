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
  Paper,
  Divider,
  FormControlLabel,
  Checkbox,
  Link as MuiLink
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const { role } = useParams(); // Move useParams hook to component level
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    // Clear specific error when field is changed
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Use the role from component level
      const loginData = {
        ...formData,
        role: role || 'jobseeker' // Default to jobseeker if no role specified
      };

      // Use the login function from AuthContext
      await login(loginData);
      
      // Redirect to home page after successful login
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      setFormErrors({
        ...formErrors,
        general: error.message || 'Login failed. Please check your credentials.'
      });
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
          <LockOutlinedIcon fontSize="large" />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Welcome back! Please enter your credentials to continue
        </Typography>

        {/* Back to Home Button */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button startIcon={<ArrowBack />} color="inherit">
              Back to Home
            </Button>
          </Link>
        </Box>

        <Paper elevation={0} sx={{ p: 3, width: '100%', bgcolor: '#f8f9fa', mb: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="email"
                  name="email"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  autoFocus
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
                  value={formData.password}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                  <MuiLink 
                    component="button" 
                    variant="body2"
                    onClick={handleForgotPassword}
                    underline="hover"
                  >
                    Forgot password?
                  </MuiLink>
                </Box>
              </Grid>
            </Grid>
            {formErrors.form && (
              <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                {formErrors.form}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: 'black',
                color: 'white',
                borderRadius: 2,
                py: 1.5,
                '&:hover': {
                  bgcolor: '#333',
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
        <Box sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
          <Divider sx={{ my: 2 }}/>
          <Typography variant="body2">
            Don't have an account?{' '}
            <MuiLink component={Link} to="/signup" variant="body2">
              Sign up here
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}