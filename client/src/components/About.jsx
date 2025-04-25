import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Briefcase, 
  Building, 
  User, 
  LogIn, 
  UserPlus,
  Menu,
  X
} from 'lucide-react';
import '../css/Home.css';
import '../css/About.css';

const About = () => {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'signin' or 'signup'
  const navigate = useNavigate();

  // Simulate logged in state (you'll replace with actual auth)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'jobseeker' or 'employer'

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openAuthModal = (type) => {
    setModalType(type);
    setAuthModalOpen(true);
    setMenuOpen(false);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleRoleSelect = (role) => {
    setUserRole(role);
    if (modalType === 'signin') {
      navigate(`/signin/${role}`);
    } else {
      navigate(`/signup/${role}`);
    }
    closeAuthModal();
  };

  const handleProfileClick = () => {
    if (userRole === 'jobseeker') {
      navigate('/profile/jobseeker');
    } else {
      navigate('/profile/employer');
    }
  };

  return (
    <div className={`home-container ${loaded ? 'loaded' : ''}`}>
      {/* Nav Bar */}
      <nav className="nav-container">
        <div className="nav-logo">
          <Link to="/" className="logo-link">JobPortal</Link>
        </div>
        
        <div className="nav-menu-button" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
        
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/jobs" className="nav-link">
            <Briefcase size={16} />
            <span>Jobs</span>
          </Link>
          <Link to="/companies" className="nav-link">
            <Building size={16} />
            <span>Companies</span>
          </Link>
          
          {isLoggedIn ? (
            <div className="nav-link" onClick={handleProfileClick}>
              <User size={16} />
              <span>Profile</span>
            </div>
          ) : (
            <>
              <div className="nav-link" onClick={() => openAuthModal('signin')}>
                <LogIn size={16} />
                <span>Sign In</span>
              </div>
              <div className="nav-link" onClick={() => openAuthModal('signup')}>
                <UserPlus size={16} />
                <span>Sign Up</span>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="home-main">
        <div className="about-section">
          <h1>About JobPortal</h1>
          <div className="about-content">
            <section className="mission-section">
              <h2>Our Mission</h2>
              <p>
                At JobPortal, we're dedicated to connecting talented individuals with their dream careers and helping employers find the perfect candidates. Our platform streamlines the job search and recruitment process, making it easier for job seekers and employers to connect in meaningful ways.
              </p>
            </section>

            <section className="features-section">
              <h2>What We Offer</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <h3>For Job Seekers</h3>
                  <ul>
                    <li>Access to thousands of job listings across industries</li>
                    <li>Personalized job recommendations based on your skills</li>
                    <li>Easy application process with profile tracking</li>
                    <li>Career resources and interview preparation tools</li>
                  </ul>
                </div>
                <div className="feature-card">
                  <h3>For Employers</h3>
                  <ul>
                    <li>Targeted job postings to reach qualified candidates</li>
                    <li>Advanced candidate filtering and matching</li>
                    <li>Company profile customization to showcase your culture</li>
                    <li>Analytics and insights on your recruitment process</li>
                  </ul>
                </div>
              </div>
            </section>
            <section className="values-section">
              <h2>Our Values</h2>
              <div className="values-grid">
                <div className="value-item">
                  <h3>Innovation</h3>
                  <p>We continuously improve our platform with the latest technologies to provide the best experience.</p>
                </div>
                <div className="value-item">
                  <h3>Inclusivity</h3>
                  <p>We believe in equal opportunities for all and strive to create a diverse and inclusive job marketplace.</p>
                </div>
                <div className="value-item">
                  <h3>Integrity</h3>
                  <p>We maintain the highest standards of honesty and transparency in all our operations.</p>
                </div>
                <div className="value-item">
                  <h3>User-Centric</h3>
                  <p>We put our users' needs first and design our platform to solve real problems in the job market.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-logo"> <Link to="/" className="logo-link">JobPortal</Link></div>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Terms and Privacy</Link>
          </div>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} JobPortal. All rights reserved.
        </div>
      </footer>

      {/* Role-based Auth Modal */}
      {authModalOpen && (
        <div className="auth-modal-overlay" onClick={closeAuthModal}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeAuthModal}>
              <X size={24} />
            </button>
            <h2>{modalType === 'signin' ? 'Sign In' : 'Sign Up'} as</h2>
            <div className="role-buttons">
              <button onClick={() => handleRoleSelect('jobseeker')} className="role-btn jobseeker">
                <User size={24} />
                <span>Job Seeker</span>
              </button>
              <button onClick={() => handleRoleSelect('employer')} className="role-btn employer">
                <Building size={24} />
                <span>Employer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;