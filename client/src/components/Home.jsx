import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home as HomeIcon, 
  Briefcase, 
  Building, 
  User, 
  LogIn, 
  UserPlus,
  Menu,
  X,
  Search
} from 'lucide-react';
import '../css/Home.css';
import FeaturedJobs from './FeaturedJobs';

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'signin' or 'signup'
  const navigate = useNavigate();

  // Use actual auth context
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [userRole, setUserRole] = useState(currentUser?.role);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  // Update userRole when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setUserRole(currentUser.role);
    }
  }, [currentUser]);

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Add search functionality here
    console.log('Search initiated');
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
          
          {isAuthenticated() ? (
            <>
              <div className="nav-link" onClick={handleProfileClick}>
                <User size={16} />
                <span>Profile</span>
              </div>
              <div className="nav-link" onClick={handleLogout}>
                <LogIn size={16} />
                <span>Logout</span>
              </div>
            </>
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
        <div className="hero-section">
          <h1>Find Your Dream Job</h1>
          <p>Connect with top employers and discover opportunities that match your skills</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input type="text" placeholder="Search for jobs..." />
            <button type="submit" className="search-button">
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Featured Jobs Section */}
        <FeaturedJobs limit={3} showViewAll={true} isHomePage={true} />
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

export default Home;