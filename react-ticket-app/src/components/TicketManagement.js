import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Toast from './auth/Toast';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadTickets();
    
    // Check if we should show create form
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowForm(true);
    }
  }, [searchParams]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const savedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      setTickets(savedTickets);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to load tickets. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.status) {
      errors.status = 'Status is required';
    } else if (!['open', 'in_progress', 'closed'].includes(formData.status)) {
      errors.status = 'Status must be open, in_progress, or closed';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const ticketData = {
        ...formData,
        id: editingTicket ? editingTicket.id : Date.now().toString(),
        createdAt: editingTicket ? editingTicket.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      let updatedTickets;
      if (editingTicket) {
        updatedTickets = tickets.map(t => t.id === editingTicket.id ? ticketData : t);
        setToast({
          type: 'success',
          message: 'Ticket updated successfully!'
        });
      } else {
        updatedTickets = [...tickets, ticketData];
        setToast({
          type: 'success',
          message: 'Ticket created successfully!'
        });
      }
      
      setTickets(updatedTickets);
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'open',
        priority: 'medium'
      });
      setShowForm(false);
      setEditingTicket(null);
      
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to save ticket. Please try again.'
      });
    }
  };

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description || '',
      status: ticket.status,
      priority: ticket.priority || 'medium'
    });
    setShowForm(true);
  };

  const handleDelete = async (ticketId) => {
    try {
      const updatedTickets = tickets.filter(t => t.id !== ticketId);
      setTickets(updatedTickets);
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));
      
      setToast({
        type: 'success',
        message: 'Ticket deleted successfully!'
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to delete ticket. Please try again.'
      });
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in_progress': return 'status-in-progress';
      case 'closed': return 'status-closed';
      default: return 'status-open';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#f39c12';
    }
  };

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
              <button 
                onClick={() => navigate('/auth/login')} 
                className="btn btn-danger" 
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ padding: '40px 0', minHeight: 'calc(100vh - 80px)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '8px' }}>
                Ticket Management
              </h1>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>
                Manage and track all your support tickets
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Create New Ticket
            </button>
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <div className="card" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#333' }}>
                  {editingTicket ? 'Edit Ticket' : 'Create New Ticket'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingTicket(null);
                    setFormData({
                      title: '',
                      description: '',
                      status: 'open',
                      priority: 'medium'
                    });
                  }}
                  style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="form-input"
                    placeholder="Enter ticket title"
                  />
                  {formErrors.title && <div className="form-error">{formErrors.title}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="form-input"
                    placeholder="Enter ticket description"
                    rows="4"
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label htmlFor="status" className="form-label">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="form-input"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                    {formErrors.status && <div className="form-error">{formErrors.status}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="priority" className="form-label">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleFormChange}
                      className="form-input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button type="submit" className="btn btn-primary">
                    {editingTicket ? 'Update Ticket' : 'Create Ticket'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTicket(null);
                      setFormData({
                        title: '',
                        description: '',
                        status: 'open',
                        priority: 'medium'
                      });
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tickets List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '24px', color: '#ccc' }}>🎫</div>
              <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '16px' }}>
                No tickets found
              </h3>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Create your first ticket to get started with ticket management.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                Create First Ticket
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {tickets.map(ticket => (
                <div key={ticket.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', color: '#333', marginBottom: '8px' }}>
                        {ticket.title}
                      </h3>
                      {ticket.description && (
                        <p style={{ color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
                          {ticket.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className={`status-tag ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          backgroundColor: getPriorityColor(ticket.priority),
                          color: 'white'
                        }}>
                          {ticket.priority} priority
                        </span>
                        <span style={{ color: '#999', fontSize: '14px' }}>
                          Created: {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                      <button
                        onClick={() => handleEdit(ticket)}
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '14px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(ticket.id)}
                        className="btn btn-danger"
                        style={{ padding: '8px 12px', fontSize: '14px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '400px', margin: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#333', marginBottom: '16px' }}>
              Confirm Delete
            </h3>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Are you sure you want to delete this ticket? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="btn btn-danger"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

export default TicketManagement;
