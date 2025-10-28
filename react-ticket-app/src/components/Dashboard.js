import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from './auth/Toast';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    closedTickets: 0
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from session
    const session = localStorage.getItem('ticketapp_session');
    if (!session) {
      navigate('/auth/login');
      return;
    }

    try {
      const sessionData = JSON.parse(session);
      setUser(sessionData.user);
      
      // Load ticket statistics
      loadStats();
    } catch (error) {
      console.error('Error parsing session:', error);
      navigate('/auth/login');
    }
  }, [navigate]);

  const loadStats = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get tickets from localStorage
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      
      const stats = {
        totalTickets: tickets.length,
        openTickets: tickets.filter(t => t.status === 'open').length,
        inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
        closedTickets: tickets.filter(t => t.status === 'closed').length
      };
      
      setStats(stats);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to load statistics. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ticketapp_session');
    setToast({
      type: 'success',
      message: 'Logged out successfully!'
    });
    
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <Link to="/dashboard" className="nav-logo">
              TicketMaster Pro
            </Link>
            <div className="nav-links">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/tickets" className="nav-link">
                Tickets
              </Link>
              <span style={{ color: '#666', margin: '0 16px' }}>
                Welcome, {user?.name || 'User'}
              </span>
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: '14px' }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ padding: '40px 0', minHeight: 'calc(100vh - 80px)' }}>
        <div className="container">
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '8px' }}>
              Dashboard
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Welcome back! Here's an overview of your ticket management system.
            </p>
          </div>

          {/* Statistics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '2rem', color: '#333', marginBottom: '8px' }}>
                    {stats.totalTickets}
                  </h3>
                  <p style={{ color: '#666', fontSize: '1rem' }}>
                    Total Tickets
                  </p>
                </div>
                <div style={{ fontSize: '3rem', color: '#667eea' }}>🎫</div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '2rem', color: '#27ae60', marginBottom: '8px' }}>
                    {stats.openTickets}
                  </h3>
                  <p style={{ color: '#666', fontSize: '1rem' }}>
                    Open Tickets
                  </p>
                </div>
                <div style={{ fontSize: '3rem', color: '#27ae60' }}>🔓</div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '2rem', color: '#f39c12', marginBottom: '8px' }}>
                    {stats.inProgressTickets}
                  </h3>
                  <p style={{ color: '#666', fontSize: '1rem' }}>
                    In Progress
                  </p>
                </div>
                <div style={{ fontSize: '3rem', color: '#f39c12' }}>⚡</div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '2rem', color: '#95a5a6', marginBottom: '8px' }}>
                    {stats.closedTickets}
                  </h3>
                  <p style={{ color: '#666', fontSize: '1rem' }}>
                    Closed Tickets
                  </p>
                </div>
                <div style={{ fontSize: '3rem', color: '#95a5a6' }}>✅</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '24px' }}>
              Quick Actions
            </h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link to="/tickets" className="btn btn-primary">
                Manage Tickets
              </Link>
              <Link to="/tickets?action=create" className="btn btn-secondary">
                Create New Ticket
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '24px' }}>
              Recent Activity
            </h2>
            <div style={{ color: '#666' }}>
              {stats.totalTickets === 0 ? (
                <p>No tickets created yet. <Link to="/tickets?action=create" style={{ color: '#667eea' }}>Create your first ticket</Link> to get started!</p>
              ) : (
                <p>You have {stats.totalTickets} tickets in your system. <Link to="/tickets" style={{ color: '#667eea' }}>View all tickets</Link> to manage them.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2024 TicketMaster Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>

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

export default Dashboard;
