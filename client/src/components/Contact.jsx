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
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  Send
} from 'lucide-react';
import '../css/Home.css';
import '../css/Contact.css';

const Contact = () => {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'signin' or 'signup'
  const navigate = useNavigate();

  // Simulate logged in state (you'll replace with actual auth)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'jobseeker' or 'employer'
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState(null);

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
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would add code to send the form data to your backend
    console.log('Form submitted:', formData);
    
    // Reset form and show success message
    setFormSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };
  
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };
  
  // FAQ data
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button in the navigation bar and select whether you're a job seeker or an employer. Follow the prompts to complete your registration with your email, password, and basic profile information."
    },
    {
      question: "How can I post a job as an employer?",
      answer: "After signing in as an employer, navigate to your dashboard and click on 'Post a New Job'. Fill out the job details form including job title, description, requirements, and application instructions. Review your post and submit it for approval."
    },
    {
      question: "Can I apply for multiple jobs with the same profile?",
      answer: "Yes! As a job seeker, you can use your profile to apply for multiple jobs. Your resume, qualifications, and other profile information will be submitted with each application, saving you time during your job search."
    },
    {
      question: "How long does it take for my job posting to be approved?",
      answer: "Job postings are typically reviewed and approved within 24-48 hours. For premium account holders, the approval process may be expedited. You'll receive an email notification once your job posting is live."
    },
    {
      question: "Is there a fee for using JobPortal?",
      answer: "JobPortal offers both free and premium options. Job seekers can create profiles and apply for jobs at no charge. Employers can post a limited number of jobs for free, with additional features available through our premium subscription plans."
    }
  ];

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
        <div className="contact-section">
          <h1>Contact Us</h1>
          
          <div className="contact-content">
            <section className="contact-info-section">
              <h2>Get in Touch</h2>
              <p>
                Have questions or feedback? We're here to help! Reach out to our team using any of the methods below or fill out the contact form.
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <Mail size={24} />
                  <div>
                    <h3>Email Us</h3>
                    <p>support@jobportal.com</p>
                    <p>careers@jobportal.com</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <Phone size={24} />
                  <div>
                    <h3>Call Us</h3>
                    <p>Customer Support: (+91) 1234567890</p>
                    <p>Business Inquiries: (+91) 9876543210</p>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="contact-form-section">
              <h2>Send Us a Message</h2>
              
              {formSubmitted && (
                <div className="form-success-message">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            </section>
          </div>
          
          <section className="faq-section">
            <h2>Frequently Asked Questions</h2>
            
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <div 
                    className="faq-question" 
                    onClick={() => toggleFaq(index)}
                  >
                    <h3>{faq.question}</h3>
                    {activeFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {activeFaq === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
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

export default Contact;