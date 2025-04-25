import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import '../css/Landingpage.css';

const Landingpage = () => {
  const [clicked, setClicked] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const titleRef = useRef(null);
  const navigate = useNavigate();

  // Handle entrance animation when component mounts
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      navigate('/home');
    }, 900);
  };

  // Set data-text attribute to match title text for shadow effect
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.setAttribute('data-text', 'JobPortal');
    }
  }, []);

  return (
    <div 
      className={`landing-container ${clicked ? 'clicked' : ''} ${loaded ? 'loaded' : ''}`} 
      onClick={handleClick}
    >
          <Briefcase size={48} className="logo-icon" />
          <h1 ref={titleRef} className="landing-title">JobPortal</h1>
      </div>
  );
};

export default Landingpage;