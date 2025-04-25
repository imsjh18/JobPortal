import axios from 'axios';

// Create an axios instance with default config
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the auth token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication services
const AuthService = {
  register: async (userData) => {
    try {
      const response = await API.post('/users/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await API.post('/users/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Job services
const JobService = {
  getAllJobs: async (params) => {
    try {
      const response = await API.get('/jobs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch jobs' };
    }
  },

  getJobById: async (id) => {
    try {
      const response = await API.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch job details' };
    }
  },

  applyForJob: async (jobId, applicationData) => {
    try {
      const response = await API.post(`/applications`, {
        jobId,
        ...applicationData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to apply for job' };
    }
  },
};

// Company services
const CompanyService = {
  getAllCompanies: async (params) => {
    try {
      const response = await API.get('/companies', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch companies' };
    }
  },

  getCompanyById: async (id) => {
    try {
      const response = await API.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch company details' };
    }
  },
  
  getEmployerCompanies: async () => {
    try {
      const response = await API.get('/users/companies');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch employer companies' };
    }
  },
};

// User profile services
const ProfileService = {
  getUserProfile: async (token) => {
    try {
      const response = await API.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user profile' };
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const response = await API.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },
};

export { API, AuthService, JobService, CompanyService, ProfileService };