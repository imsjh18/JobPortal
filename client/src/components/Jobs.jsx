import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JobService } from '../services/api';
import { Briefcase, MapPin, Clock, DollarSign, Search, Filter } from 'lucide-react';
import '../css/Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [datePostedFilter, setDatePostedFilter] = useState('');
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const fetchedJobs = await JobService.getAllJobs();
        setJobs(fetchedJobs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search and filter criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesSalary = !salaryFilter || job.salary?.includes(salaryFilter);
    
    // Date posted filter logic
    let matchesDate = true;
    if (datePostedFilter) {
      const jobDate = new Date(job.createdAt);
      const currentDate = new Date();
      const daysDifference = Math.floor((currentDate - jobDate) / (1000 * 60 * 60 * 24));
      
      switch(datePostedFilter) {
        case 'today':
          matchesDate = daysDifference < 1;
          break;
        case 'week':
          matchesDate = daysDifference < 7;
          break;
        case 'month':
          matchesDate = daysDifference < 30;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesLocation && matchesSalary && matchesDate;
  });

  // Get unique locations for filter dropdown
  const locations = [...new Set(jobs.map(job => job.location).filter(Boolean))];

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days ago for display
  const getDaysAgo = (dateString) => {
    const jobDate = new Date(dateString);
    const currentDate = new Date();
    const daysDifference = Math.floor((currentDate - jobDate) / (1000 * 60 * 60 * 24));
    
    if (daysDifference === 0) return 'Today';
    if (daysDifference === 1) return 'Yesterday';
    return `${daysDifference} days ago`;
  };

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Find Your Perfect Job</h1>
        <p>Browse through thousands of full-time and part-time jobs near you</p>
      </div>

      <div className="jobs-search-section">
        <div className="search-bar">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search jobs by title, company, or keywords..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
            <label>Location</label>
            <select 
              value={locationFilter} 
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Salary Range</label>
            <select 
              value={salaryFilter} 
              onChange={(e) => setSalaryFilter(e.target.value)}
            >
              <option value="">All Salaries</option>
              <option value="$0-$50k">0-50k</option>
              <option value="$50k-$100k">50k-100k</option>
              <option value="$100k+">100k+</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Date Posted</label>
            <select 
              value={datePostedFilter} 
              onChange={(e) => setDatePostedFilter(e.target.value)}
            >
              <option value="">Any Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="no-results">
          <Briefcase size={48} />
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="jobs-list">
          <div className="jobs-count">
            <p>Showing {filteredJobs.length} jobs</p>
          </div>
          
          {filteredJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <div className="job-card-header">
                <div className="job-icon">
                  <Briefcase size={24} />
                </div>
                <div className="job-title-company">
                  <h3>{job.title}</h3>
                  <p className="company-name">{job.company}</p>
                </div>
                <div className="job-posted-date">
                  <Clock size={14} />
                  <span>{getDaysAgo(job.createdAt)}</span>
                </div>
              </div>
              
              <div className="job-card-details">
                <div className="job-detail">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="job-detail">
                    <DollarSign size={16} />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
              
              <div className="job-description">
                <p>
                  {job.description ? 
                    (job.description.length > 200 ? 
                      `${job.description.substring(0, 200)}...` : 
                      job.description) : 
                    'No description available'}
                </p>
              </div>
              
              {job.requirements && job.requirements.length > 0 && (
                <div className="job-requirements">
                  <h4>Requirements:</h4>
                  <ul>
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                    {job.requirements.length > 3 && <li>...</li>}
                  </ul>
                </div>
              )}
              
              <div className="job-card-actions">
                <Link to={`/jobs/${job._id}`} className="view-details-btn">
                  View Details
                </Link>
                <Link to={`/jobs/${job._id}/apply`} className="apply-btn">
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;