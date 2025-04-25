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
  X,
  Shield,
  Lock,
  FileText,
  Cookie
} from 'lucide-react';
import '../css/Home.css';
import '../css/Privacy.css';

const Privacy = () => {
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
        <div className="privacy-section">
          <h1>Terms and Privacy</h1>
          
          <div className="privacy-content">
            <section className="privacy-overview-section">
              <h2>Overview</h2>
              <p>
                At JobPortal, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our platform. By accessing or using JobPortal, you agree to the terms outlined in this policy.
              </p>
            </section>

            <section className="privacy-data-section">
              <h2>Data Collection</h2>
              <div className="privacy-grid">
                <div className="privacy-card">
                  <div className="privacy-card-header">
                    <Shield size={24} />
                    <h3>Information We Collect</h3>
                  </div>
                  <ul>
                    <li>Personal information (name, email, phone number)</li>
                    <li>Professional information (resume, work history, skills)</li>
                    <li>Account credentials</li>
                    <li>Usage data and interactions with our platform</li>
                    <li>Device information and IP address</li>
                  </ul>
                </div>
                
                <div className="privacy-card">
                  <div className="privacy-card-header">
                    <Lock size={24} />
                    <h3>How We Use Your Data</h3>
                  </div>
                  <ul>
                    <li>Providing and improving our services</li>
                    <li>Matching job seekers with relevant opportunities</li>
                    <li>Communicating important updates</li>
                    <li>Analyzing usage patterns to enhance user experience</li>
                    <li>Ensuring platform security and preventing fraud</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="privacy-terms-section">
              <h2>Terms of Service</h2>
              <div className="privacy-grid">
                <div className="privacy-card">
                  <div className="privacy-card-header">
                    <FileText size={24} />
                    <h3>User Responsibilities</h3>
                  </div>
                  <p>By using JobPortal, you agree to:</p>
                  <ul>
                    <li>Provide accurate and truthful information</li>
                    <li>Maintain the confidentiality of your account</li>
                    <li>Use the platform for legitimate job seeking or hiring purposes</li>
                    <li>Respect the intellectual property rights of JobPortal</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </div>
                
                <div className="privacy-card">
                  <div className="privacy-card-header">
                    <Cookie size={24} />
                    <h3>Cookies & Tracking</h3>
                  </div>
                  <p>JobPortal uses cookies and similar technologies to:</p>
                  <ul>
                    <li>Remember your preferences and settings</li>
                    <li>Understand how you interact with our platform</li>
                    <li>Improve our services and user experience</li>
                    <li>Provide personalized content and job recommendations</li>
                    <li>Analyze the effectiveness of our features</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="privacy-rights-section">
              <h2>Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. You can also opt out of certain data collection practices. To exercise these rights, please contact our privacy team at privacy@jobportal.com.
              </p>
              <p>
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of any significant changes through our platform or via email.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-logo"><Link to="/" className="logo-link">JobPortal</Link></div>
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

export default Privacy;