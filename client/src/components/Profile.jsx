// Profile.jsx - Comprehensive profile component with proper encapsulation
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProfileService, JobService } from '../services/api';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Edit,
  Globe,
  Users,
  Clock,
  ArrowLeft,
  Save,
  X,
  Upload,
  Camera
} from 'lucide-react';
import '../css/Profile.css';

// Internal utility components for better organization while keeping everything in one file
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="profile-loading">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
};

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="profile-error">
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry}>Try Again</button>
      )}
    </div>
  );
};

// JobSeeker Profile content component
const JobSeekerProfile = ({ profile, editMode, editedProfile, onInputChange, onSave }) => {
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    onInputChange('skills', skillsArray);
  };

  const handleJsonArrayChange = (field, e) => {
    try {
      const parsed = JSON.parse(e.target.value);
      onInputChange(field, parsed);
    } catch (err) {
      // Handle invalid JSON (you might want to show a validation error)
      onInputChange(field, e.target.value);
    }
  };

  return (
    <>
      {/* About Section */}
      <div className="profile-section">
        <h3>About</h3>
        {!editMode ? (
          <p>{profile?.bio || 'No bio provided'}</p>
        ) : (
          <div className="form-group">
            <textarea 
              name="bio" 
              value={editedProfile.bio} 
              onChange={(e) => onInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself"
              rows="4"
            ></textarea>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="profile-section">
        <h3>Skills</h3>
        {!editMode ? (
          profile?.skills && (Array.isArray(profile.skills) ? profile.skills.length > 0 : profile.skills) ? (
            <div className="skills-list">
              {Array.isArray(profile.skills) ? 
                profile.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                )) : 
                typeof profile.skills === 'string' ?
                  profile.skills.split(',').map((skill, index) => (
                    <span key={index} className="skill-tag">{skill.trim()}</span>
                  )) : 
                  null
              }
            </div>
          ) : (
            <p>No skills listed</p>
          )
        ) : (
          <div className="form-group">
            <input 
              type="text" 
              name="skills" 
              value={Array.isArray(editedProfile.skills) ? editedProfile.skills.join(', ') : editedProfile.skills} 
              onChange={handleSkillsChange}
              placeholder="Enter skills separated by commas (e.g. JavaScript, React, Node.js)"
            />
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="profile-section">
        <h3>Education</h3>
        {!editMode ? (
          profile?.education && Array.isArray(profile.education) && profile.education.length > 0 ? (
            <div className="education-list">
              {profile.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <h4>{edu.degree}</h4>
                  <p>{edu.institution}</p>
                  <p>{edu.year}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No education history listed</p>
          )
        ) : (
          <div className="form-group">
            <textarea 
              name="education" 
              value={Array.isArray(editedProfile.education) ? 
                JSON.stringify(editedProfile.education, null, 2) : 
                ''} 
              onChange={(e) => handleJsonArrayChange('education', e)}
              placeholder="Education details"
              rows="4"
            ></textarea>
            <small className="form-help-text">
            </small>
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="profile-section">
        <h3>Experience</h3>
        {!editMode ? (
          profile?.experience && Array.isArray(profile.experience) && profile.experience.length > 0 ? (
            <div className="experience-list">
              {profile.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <h4>{exp.title}</h4>
                  <p>{exp.company}</p>
                  <p>{exp.duration}</p>
                  <p>{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No work experience listed</p>
          )
        ) : (
          <div className="form-group">
            <textarea 
              name="experience" 
              value={Array.isArray(editedProfile.experience) ? 
                JSON.stringify(editedProfile.experience, null, 2) : 
                ''} 
              onChange={(e) => handleJsonArrayChange('experience', e)}
              placeholder="Experience details"
              rows="4"
            ></textarea>
            <small className="form-help-text">
            </small>
          </div>
        )}
      </div>

      {/* Resume Section */}
      {profile?.resume && (
        <div className="profile-section">
          <h3>Resume</h3>
          <a href="#" className="resume-link">
            <FileText size={18} />
            <span>View Resume</span>
          </a>
        </div>
      )}
    </>
  );
};

// Employer Profile content component
const EmployerProfile = ({ profile, editMode, editedProfile, onInputChange }) => {
  return (
    <>
      <div className="profile-section">
        <h3>Company Description</h3>
        {!editMode ? (
          <p>{profile?.companyDescription || 'No company description provided'}</p>
        ) : (
          <div className="form-group">
            <textarea 
              name="companyDescription" 
              value={editedProfile.companyDescription} 
              onChange={(e) => onInputChange('companyDescription', e.target.value)}
              placeholder="Describe your company"
              rows="4"
            ></textarea>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h3>Company Size</h3>
        {!editMode ? (
          <p>{profile?.companySize || 'Not specified'}</p>
        ) : (
          <div className="form-group">
            <select 
              name="companySize" 
              value={editedProfile.companySize} 
              onChange={(e) => onInputChange('companySize', e.target.value)}
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h3>Company Website</h3>
        {!editMode ? (
          profile?.companyWebsite ? (
            <a 
              href={profile.companyWebsite.startsWith('http') ? 
                profile.companyWebsite : 
                `https://${profile.companyWebsite}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="website-link"
            >
              <Globe size={16} /> {profile.companyWebsite}
            </a>
          ) : (
            <p>No website provided</p>
          )
        ) : (
          <div className="form-group">
            <input 
              type="url" 
              name="companyWebsite" 
              value={editedProfile.companyWebsite} 
              onChange={(e) => onInputChange('companyWebsite', e.target.value)}
              placeholder="e.g. https://example.com"
            />
          </div>
        )}
      </div>

      <div className="profile-section">
        <h3>Company Details</h3>
        <div className="company-details">
          <div className="detail-item">
            <Globe size={18} />
            <div>
              <p className="detail-label">Website</p>
              <p className="detail-value">
                {profile?.companyWebsite ? (
                  <a 
                    href={profile.companyWebsite.startsWith('http') ? 
                      profile.companyWebsite : 
                      `https://${profile.companyWebsite}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {profile.companyWebsite}
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            </div>
          </div>

          <div className="detail-item">
            <Users size={18} />
            <div>
              <p className="detail-label">Company Size</p>
              <p className="detail-value">{profile?.companySize || 'Not specified'}</p>
            </div>
          </div>

          <div className="detail-item">
            <MapPin size={18} />
            <div>
              <p className="detail-label">Location</p>
              <p className="detail-value">{profile?.location || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Jobs List component
const JobsList = ({ jobs = [] }) => {
  return (
    <div className="jobs-list">
      <h3>Posted Jobs</h3>
      {jobs.length === 0 ? (
        <p className="no-items">You haven't posted any jobs yet.</p>
      ) : (
        jobs.map(job => (
          <div className="job-item" key={job._id}>
            <div className="job-item-header">
              <h4>{job.title}</h4>
              <span className="job-date">
                <Clock size={14} />
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="job-location">
              <MapPin size={14} />
              {job.location}
            </p>
            <p className="job-description">
              {job.description?.substring(0, 150)}...
            </p>
            <div className="job-actions">
              <Link to={`/jobs/${job._id}`} className="view-btn">View</Link>
              <Link to={`/jobs/${job._id}/edit`} className="edit-btn">Edit</Link>
            </div>
          </div>
        ))
      )}
      <Link to="/post-job" className="post-job-btn">Post a New Job</Link>
    </div>
  );
};

// Applications List component
const ApplicationsList = ({ applications = [] }) => {
  return (
    <div className="applications-list">
      <h3>Job Applications</h3>
      {applications.length === 0 ? (
        <p className="no-items">You haven't applied to any jobs yet.</p>
      ) : (
        applications.map(application => (
          <div className="application-item" key={application._id}>
            <div className="application-item-header">
              <h4>{application.job?.title || 'Job Title Unavailable'}</h4>
              <span className="application-status">{application.status || 'Pending'}</span>
            </div>
            <p className="application-company">{application.job?.company || 'Company Unavailable'}</p>
            <p className="application-date">
              <Clock size={14} />
              Applied on {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Unknown date'}
            </p>
            <div className="application-actions">
              <Link to={`/jobs/${application.job?._id || '#'}`} className="view-btn">View Job</Link>
            </div>
          </div>
        ))
      )}
      <Link to="/jobs" className="browse-jobs-btn">Browse More Jobs</Link>
    </div>
  );
};

// Profile Content wrapper component - UPDATED
const ProfileContent = ({ profile, profileType, editMode, onUpdateProfile }) => {
  // Initialize with default empty values to prevent null/undefined errors
  const [editedProfile, setEditedProfile] = useState({
    bio: '',
    skills: [],
    education: [],
    experience: [],
    companyDescription: '',
    companySize: '',
    companyWebsite: '',
    // Add other necessary default fields
  });
  
  useEffect(() => {
    if (profile) {
      // Initialize edited profile with actual data when profile data arrives
      setEditedProfile({
        ...editedProfile, // Keep defaults for any missing fields
        ...profile,  // Overwrite with actual profile data
      });
    }
  }, [profile]);

  // Separate effect for edit mode changes
  useEffect(() => {
    if (editMode && profile) {
      // Ensure all fields have proper values when entering edit mode
      setEditedProfile({
        ...editedProfile,
        ...profile,
        bio: profile?.bio || '',
        skills: profile?.skills || [],
        education: profile?.education || [],
        experience: profile?.experience || [],
        companyDescription: profile?.companyDescription || '',
        companySize: profile?.companySize || '',
        companyWebsite: profile?.companyWebsite || '',
      });
    }
  }, [editMode, profile]);

  const handleInputChange = (name, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    return await onUpdateProfile(editedProfile);
  };

  // Guard against rendering with null profile
  if (!profile) {
    return <div>Loading profile content...</div>;
  }

  return (
    <div className="profile-details">
      {profileType === 'jobseeker' ? (
        <JobSeekerProfile 
          profile={profile}
          editMode={editMode}
          editedProfile={editedProfile}
          onInputChange={handleInputChange}
          onSave={handleSaveChanges}
        />
      ) : (
        <EmployerProfile 
          profile={profile}
          editMode={editMode}
          editedProfile={editedProfile}
          onInputChange={handleInputChange}
        />
      )}
    </div>
  );
};

// Profile Sidebar component
const ProfileSidebar = ({ profile, profileType, editMode, onEditToggle, onUpdateProfile }) => {
  const [editedProfile, setEditedProfile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Initialize edit mode
  const handleStartEdit = () => {
    setEditedProfile({
      ...profile,
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      title: profile?.title || '',
      companyName: profile?.companyName || '',
      industry: profile?.industry || '',
      contactPhone: profile?.contactPhone || '',
      location: profile?.location || '',
    });
    onEditToggle();
  };

  const handleCancelEdit = () => {
    setEditedProfile(null);
    setSaveError(null);
    // Reset any file upload state
    if (!profile?.profilePicture) {
      setProfilePicture(null);
    }
    setProfilePictureFile(null);
    onEditToggle();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePictureFile(file); // Store the file for upload
      setProfilePicture(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      
      // Create FormData if there's a profile picture to upload
      let updatedData = { ...editedProfile };
      
      if (profilePictureFile) {
        // In a real implementation, you would handle file upload here
        updatedData.profilePicture = 'uploaded_picture_url';
      }
      
      // Update the profile
      const result = await onUpdateProfile(updatedData);
      if (!result.success) {
        setSaveError(result.error);
      }
      
      setSaving(false);
    } catch (err) {
      console.error('Error in save handler:', err);
      setSaveError('Failed to update profile. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="profile-sidebar">
      <div className="profile-avatar">
        <div className="avatar-container">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="profile-picture" />
          ) : profile?.profilePicture ? (
            <img src={profile.profilePicture} alt="Profile" className="profile-picture" />
          ) : (
            profileType === 'jobseeker' ? <User size={64} /> : <Building size={64} />
          )}
          
          {editMode && (
            <label htmlFor="profile-pic-upload" className="profile-pic-upload-label">
              <Camera size={20} />
              <span>Change</span>
            </label>
          )}
        </div>
        
        {editMode && (
          <input 
            type="file" 
            id="profile-pic-upload"
            onChange={handleProfilePictureChange} 
            className="profile-pic-upload" 
            accept="image/*"
          />
        )}
      </div>
      
      {!editMode ? (
        <>
          <h2>{profileType === 'jobseeker' ? 
            `${profile?.firstName} ${profile?.lastName}` : 
            profile?.companyName}
          </h2>
          <p className="profile-title">
            {profileType === 'jobseeker' ? profile?.title : profile?.industry}
          </p>
          
          <div className="profile-contact-info">
            <div className="contact-item">
              <Mail size={16} />
              <span>{profile?.email}</span>
            </div>
            {profile?.contactPhone && (
              <div className="contact-item">
                <Phone size={16} />
                <span>{profile?.contactPhone}</span>
              </div>
            )}
            {profile?.location && (
              <div className="contact-item">
                <MapPin size={16} />
                <span>{profile?.location}</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="edit-profile-form">
          {profileType === 'jobseeker' ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={editedProfile.firstName} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={editedProfile.lastName} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={editedProfile.title} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Software Developer"
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Company Name</label>
                <input 
                  type="text" 
                  name="companyName" 
                  value={editedProfile.companyName} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Industry</label>
                <input 
                  type="text" 
                  name="industry" 
                  value={editedProfile.industry} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Technology"
                />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label>Phone</label>
            <input 
              type="tel" 
              name="contactPhone" 
              value={editedProfile.contactPhone} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              name="location" 
              value={editedProfile.location} 
              onChange={handleInputChange} 
              placeholder="e.g. New York, NY"
            />
          </div>
        </div>
      )}
      
      <div className="profile-actions">
        {!editMode ? (
          <button className="edit-profile-btn" onClick={handleStartEdit}>
            <Edit size={16} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="edit-actions">
            <button 
              className="save-profile-btn" 
              onClick={handleSaveProfile}
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button className="cancel-edit-btn" onClick={handleCancelEdit}>
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>
      
      {saveError && <div className="save-error">{saveError}</div>}
    </div>
  );
};

// Main Profile component
const Profile = () => {
  const { profileType } = useParams(); // 'jobseeker' or 'employer'
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  
  // Fetch profile data on component mount
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }

    // Redirect if profile type doesn't match user role
    if (currentUser && currentUser.role !== profileType) {
      navigate(`/profile/${currentUser.role}`);
      return;
    }

    fetchProfileData();
  }, [currentUser, isAuthenticated, navigate, profileType]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = currentUser?.token;
      const profileData = await ProfileService.getUserProfile(token);
      setProfile(profileData);
  
      // Fetch additional data based on user role
      if (profileType === 'employer') {
        const jobsData = await JobService.getAllJobs({ employerId: profileData.id });
        setJobs(jobsData);
      } else if (profileType === 'jobseeker') {
        // In a real app, you would fetch applications here
        // const applicationsData = await ApplicationService.getUserApplications();
        // setApplications(applicationsData);
      }
  
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditToggle = () => {
    setEditMode(prev => !prev);
  };

  const handleUpdateProfile = async (updatedProfile) => {
    try {
      const result = await ProfileService.updateUserProfile(updatedProfile);
      setProfile(result);
      setEditMode(false);
      return { success: true };
    } catch (err) {
      console.error('Error updating profile:', err);
      return { 
        success: false, 
        error: 'Failed to update profile. Please try again.'
      };
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Link to="/home" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="profile-content">
        <ProfileSidebar 
          profile={profile}
          profileType={profileType}
          editMode={editMode}
          onEditToggle={handleEditToggle}
          onUpdateProfile={handleUpdateProfile}
        />

        <div className="profile-main">
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            {profileType === 'employer' && (
              <button 
                className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
                onClick={() => setActiveTab('jobs')}
              >
                Posted Jobs
              </button>
            )}
            {profileType === 'jobseeker' && (
              <button 
                className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                Applications
              </button>
            )}
          </div>

          <div className="tab-content">
            {activeTab === 'profile' && (
              <ProfileContent 
                profile={profile}
                profileType={profileType}
                editMode={editMode}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {activeTab === 'jobs' && profileType === 'employer' && (
              <JobsList jobs={jobs} />
            )}

            {activeTab === 'applications' && profileType === 'jobseeker' && (
              <ApplicationsList applications={applications} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;