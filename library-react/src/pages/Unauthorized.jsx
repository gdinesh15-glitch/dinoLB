import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', textAlign: 'center', gap: '16px'
  }}>
    <i className="fas fa-lock" style={{ fontSize: '4rem', color: 'var(--accent-red)', opacity: 0.5 }}></i>
    <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Access Denied</h1>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
      You don't have permission to access this page. Please contact your administrator if you believe this is an error.
    </p>
    <Link to="/login" className="btn btn-primary" style={{ marginTop: '12px' }}>
      <i className="fas fa-sign-in-alt"></i> Back to Login
    </Link>
  </div>
);

export default Unauthorized;
