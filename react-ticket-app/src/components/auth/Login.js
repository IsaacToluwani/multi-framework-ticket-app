import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from './Toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would be an API call
      if (formData.email === 'demo@example.com' && formData.password === 'password123') {
        // Store session token
        localStorage.setItem('ticketapp_session', JSON.stringify({
          user: {
            email: formData.email,
            name: 'Demo User'
          },
          token: 'mock-jwt-token-' + Date.now()
        }));
        
        setToast({
          type: 'success',
          message: 'Login successful! Redirecting to dashboard...'
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setToast({
          type: 'error',
          message: 'Invalid email or password. Please try again.'
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <div className="container" style={{ maxWidth: '400px' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '8px' }}>
              Welcome Back
            </h1>
            <p style={{ color: '#666' }}>
              Sign in to your TicketMaster Pro account
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                disabled={loading}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                disabled={loading}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '20px' }}
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : 'Sign In'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#666', marginBottom: '16px' }}>
              Don't have an account?{' '}
              <Link to="/auth/signup" style={{ color: '#667eea', textDecoration: 'none' }}>
                Sign up here
              </Link>
            </p>
            <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
          </div>
          
          <div style={{ marginTop: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '8px', fontSize: '14px' }}>
            <strong>Demo Credentials:</strong><br />
            Email: demo@example.com<br />
            Password: password123
          </div>
        </div>
      </div>
      
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Login;
