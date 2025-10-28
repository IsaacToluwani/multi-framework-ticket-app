import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="container">
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '24px', fontWeight: '700' }}>
              TicketMaster Pro
            </h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '40px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 40px' }}>
              Streamline your workflow with our powerful ticket management system. 
              Track, manage, and resolve issues efficiently with our intuitive platform.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/auth/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/auth/signup" className="btn btn-secondary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px', color: '#333' }}>
            Why Choose TicketMaster Pro?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="card">
              <div style={{ fontSize: '3rem', marginBottom: '20px', color: '#667eea' }}>🎫</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#333' }}>
                Smart Ticket Management
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Create, track, and manage tickets with our intuitive interface. 
                Never lose track of important issues again.
              </p>
            </div>
            <div className="card">
              <div style={{ fontSize: '3rem', marginBottom: '20px', color: '#667eea' }}>📊</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#333' }}>
                Real-time Analytics
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Get insights into your team's performance with comprehensive 
                dashboards and detailed reporting.
              </p>
            </div>
            <div className="card">
              <div style={{ fontSize: '3rem', marginBottom: '20px', color: '#667eea' }}>🔒</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#333' }}>
                Secure & Reliable
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Your data is protected with enterprise-grade security. 
                Built for reliability and scalability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>
              Ready to Get Started?
            </h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '40px', opacity: 0.9 }}>
              Join thousands of teams already using TicketMaster Pro to streamline their workflow.
            </p>
            <Link to="/auth/signup" className="btn btn-secondary" style={{ background: 'white', color: '#667eea' }}>
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2024 TicketMaster Pro. All rights reserved.</p>
            <p style={{ marginTop: '8px', opacity: 0.8 }}>
              Built with React • Secure • Reliable
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
