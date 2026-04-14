import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; 

import { 
  Users, UserCheck, UserX, 
  CheckCircle, Heart, Briefcase, Share2, Activity,
  ShieldAlert, Star
} from 'lucide-react';

const AdminDashboard = () => {
  // ... [Keep all your existing state and functions (useEffect, handleAuthFailure, fetchStats, StatCard, SkeletonCard) exactly the same up to the return statement] ...

  return (
    <div className="ks-dashboard-container">

      {/* --- NEW HERO SECTION --- */}
      <div className="ks-hero-section">
        <picture>
          <source media="(max-width: 768px)" srcSet="https://res.cloudinary.com/dppiuypop/image/upload/v1773852088/uploads/m7apo90xh8znxsahepis.png" />
          <img 
            src="https://res.cloudinary.com/dppiuypop/image/upload/v1773852088/uploads/m7apo90xh8znxsahepis.png" 
            alt="Admin Portal Welcome" 
            className="ks-hero-image" 
          />
        </picture>
        <div className="ks-hero-overlay">
          <h1 className="ks-hero-title">Welcome to the Admin Portal</h1>
          <p className="ks-hero-subtitle">Manage your platform, track metrics, and monitor match activities effortlessly.</p>
        </div>
      </div>

      {/* Header - Updated to match screenshot text style */}
      <header className="ks-page-header">
        <div>
          <h2 className="ks-title">Dashboard</h2>
          <p className="ks-subtitle">Welcome back, {adminName}. Here is what's happening.</p>
        </div>
        <div className="ks-date-pill">
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </header>

      {error && <div className="ks-alert-banner">{error}</div>}

      <div className="ks-grid-layout">
         {/* ... [Keep all your existing grid and StatCard code exactly the same] ... */}
      </div>
    </div>
  );
};

export default AdminDashboard;
