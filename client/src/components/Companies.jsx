import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CompanyService } from '../services/api';
import { Building, MapPin, Users, ExternalLink } from 'lucide-react';
import '../css/Companies.css';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const fetchedCompanies = await CompanyService.getEmployerCompanies();
        setCompanies(fetchedCompanies);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to load companies. Please try again later.');
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filter companies based on search term and industry filter
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !industryFilter || company.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  // Get unique industries for filter dropdown
  const industries = [...new Set(companies.map(company => company.industry).filter(Boolean))];

  return (
    <div className="companies-container">
      <div className="companies-header">
        <h1>Companies</h1>
        <p>Discover companies registered by employers on our platform</p>
      </div>

      <div className="companies-search-filters">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search companies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-dropdown">
          <select 
            value={industryFilter} 
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            <option value="">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading companies...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredCompanies.length === 0 ? (
        <div className="no-results">No companies found matching your criteria.</div>
      ) : (
        <div className="companies-grid">
          {filteredCompanies.map((company) => (
            <div className="company-card" key={company._id}>
              <div className="company-logo">
                <Building size={40} />
              </div>
              <div className="company-info">
                <h3>{company.companyName}</h3>
                <div className="company-details">
                  <span><MapPin size={14} /> {company.location || 'Location not specified'}</span>
                  <span><Users size={14} /> {company.companySize || 'Size not specified'}</span>
                </div>
                <p className="company-industry">{company.industry}</p>
                <p className="company-description">
                  {company.companyDescription ? 
                    (company.companyDescription.length > 100 ? 
                      `${company.companyDescription.substring(0, 100)}...` : 
                      company.companyDescription) : 
                    'No description available'}
                </p>
                <div className="company-actions">
                  <Link to={`/companies/${company._id}`} className="view-details-btn">
                    View Details
                  </Link>
                  {company.companyWebsite && (
                    <a 
                      href={company.companyWebsite.startsWith('http') ? 
                        company.companyWebsite : 
                        `https://${company.companyWebsite}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="website-link"
                    >
                      <ExternalLink size={14} /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default Companies;