import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import '../css/Auth.css';

export const SignUpSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  // Get role and email from location state
  const role = location.state?.role || 'jobseeker';
  const email = location.state?.email || 'your email';

  useEffect(() => {
    // If user navigated here directly without state, redirect to home
    if (!location.state) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownTimer);
          navigate(`/signin/${role}`);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [navigate, location.state, role]);

  return (
    <div className={`auth-container ${loaded ? 'loaded' : ''}`}>
      <div className="auth-card success-card">
        <div className="success-icon">
          <CheckCircle size={64} />
        </div>
        
        <div className="auth-header">
          <h1>Account Created!</h1>
          <p>
            Congratulations! Your {role === 'jobseeker' ? 'job seeker' : 'employer'} account 
            has been successfully created.
          </p>
        </div>
        
        <div className="success-message">
          <p>
            We've sent a verification email to <strong>{email}</strong>.
            Please check your inbox and verify your email to activate your account.
          </p>
        </div>
        
        <div className="redirect-message">
          <p>
            You will be redirected to the sign-in page in {countdown} seconds.
          </p>
        </div>
        
        <Link 
          to={`/signin/${role}`} 
          className={`success-button ${countdown > 0 ? 'disabled' : ''}`} 
          style={{ pointerEvents: countdown > 0 ? 'none' : 'auto' }}
        >
          Sign In Now
        </Link>
      </div>
    </div>
  );
}