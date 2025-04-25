import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landingpage from './components/Landingpage';
import Home from './components/Home';
import About from './components/About';
import Companies from './components/Companies';
import Jobs from './components/Jobs';
import Contact from './components/Contact';
import Privacy from './components/Privacy';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import { SignUpSuccess } from './components/SignUpSuccess';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Redirect to sign in if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/signin" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin/:role" element={<SignIn />} />
        <Route path="/signup/:role" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/signup-success" element={<SignUpSuccess />} />
        <Route path="/profile/:profileType" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;