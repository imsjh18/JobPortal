import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JobService } from '../services/api';
import '../css/Home.css'; // Reusing the existing styles

const FeaturedJobs = ({ limit, showViewAll = true, isHomePage = true }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Fetch jobs with a limit parameter if provided
        const params = {};
        if (limit) params.limit = limit;
        
        // We could add a featured=true parameter if the backend supports it
        params.featured = true;
        
        const fetchedJobs = await JobService.getAllJobs(params);
        setJobs(fetchedJobs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
        setLoading(false);
      }
    };

    fetchJobs();
  }, [limit]);

  if (loading) {
    return (
      <div className="featured-section">
        <h2>Featured Jobs</h2>
        <div className="loading">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured-section">
        <h2>Featured Jobs</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  // If no jobs are found
  if (jobs.length === 0) {
    return (
      <div className="featured-section">
        <h2>Featured Jobs</h2>
        <div className="no-jobs">No featured jobs available at the moment.</div>
      </div>
    );
  }

  return (
    <div className="featured-section">
      <h2>Featured Jobs</h2>
      <div className="job-cards">
        {jobs.map((job) => (
          <div className="job-card" key={job._id}>
            <h3>{job.title}</h3>
            <p className="company">{job.company}</p>
            <p className="location">{job.location}</p>
            {isHomePage ? (
              <Link to={`/jobs/${job._id}`}>
                <button className="apply-btn">View Details</button>
              </Link>
            ) : (
              <button className="apply-btn" onClick={() => window.location.href = `/jobs/${job._id}/apply`}>
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>
      
      {showViewAll && jobs.length > 0 && (
        <div className="view-all-container">
          <Link to="/jobs" className="view-all-link">
            View All Jobs
          </Link>
        </div>
      )}
    </div>
  );
};

export default FeaturedJobs;