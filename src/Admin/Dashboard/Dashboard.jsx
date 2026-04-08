import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; 

import { 
  Users, UserCheck, UserX, 
  CheckCircle, Heart, Briefcase, Share2, Activity,
  ShieldAlert, Star
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminName, setAdminName] = useState('Admin'); // State for dynamic username
  const navigate = useNavigate();

  const API_BASE = "https://kalyanashobha-back.vercel.app/api/admin";

  useEffect(() => {
    // 1. Get username for the welcome message
    try {
      const infoStr = localStorage.getItem('adminInfo');
      if (infoStr) {
        const info = JSON.parse(infoStr);
        if (info.username) {
          setAdminName(info.username);
        }
      }
    } catch (e) {
      console.error("Error parsing admin info", e);
    }

    // 2. Fetch Dashboard Stats
    fetchStats();
  }, []);

  // Centralized redirect logic for expired/missing tokens
  const handleAuthFailure = () => {
    let role = 'SuperAdmin'; // Default fallback
    
    try {
      const infoStr = localStorage.getItem('adminInfo');
      if (infoStr) {
        const info = JSON.parse(infoStr);
        if (info.role) role = info.role;
      }
    } catch (e) {
      console.error("Error checking role for redirect", e);
    }

    // Clear local storage to fully sign out
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');

    // Route based on role
    if (role === 'SuperAdmin') {
      navigate('/admin/login', { replace: true });
    } else {
      navigate('/moderator', { replace: true });
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      handleAuthFailure();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/stats`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token 
        }
      });

      // If backend says Unauthorized (401) or Forbidden (403), token is likely expired
      if (res.status === 401 || res.status === 403) {
        handleAuthFailure();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        // Fallback catch if backend returns 200 but sends success: false for token issues
        if (data.message && data.message.toLowerCase().includes('token')) {
          handleAuthFailure();
          return;
        }
        setError('Failed to load stats');
      }
    } catch (err) {
      setError('System Unavailable');
    } finally {
      setLoading(false);
    }
  };

  // Reusable Card Component with Navigation and Unique Colors
  const StatCard = ({ label, value, icon: Icon, path, colorType }) => {
    // Unique color definitions for a vibrant, premium dashboard
    const styles = {
      blue:   { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', shadow: 'rgba(37, 99, 235, 0.15)' },
      emerald:{ color: '#059669', bg: '#F0FDF4', border: '#A7F3D0', shadow: 'rgba(5, 150, 105, 0.15)' },
      rose:   { color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', shadow: 'rgba(225, 29, 72, 0.15)' },
      amber:  { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', shadow: 'rgba(217, 119, 6, 0.15)' },
      purple: { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', shadow: 'rgba(124, 58, 237, 0.15)' },
      indigo: { color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE', shadow: 'rgba(79, 70, 229, 0.15)' },
      teal:   { color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4', shadow: 'rgba(13, 148, 136, 0.15)' },
      cyan:   { color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC', shadow: 'rgba(8, 145, 178, 0.15)' }
    };

    const currentStyle = styles[colorType] || styles.blue;

    return (
      <div 
        className={`ks-stat-card ${path ? 'clickable' : ''}`} 
        onClick={() => path && navigate(path)}
        style={{
           '--card-hover-border': currentStyle.border,
           '--card-hover-shadow': currentStyle.shadow
        }}
      >
        <div className="ks-card-header">
          <div 
            className="ks-icon-box" 
            style={{ color: currentStyle.color, backgroundColor: currentStyle.bg }}
          >
            {Icon && <Icon size={24} strokeWidth={2} />}
          </div>
          <Activity size={18} className="ks-trend-indicator" style={{color: currentStyle.color, opacity: 0.5}} />
        </div>

        <div className="ks-card-body">
          <h2 className="ks-stat-value">
            {value !== undefined ? value.toLocaleString() : '0'}
          </h2>
          <p className="ks-stat-label">{label}</p>
        </div>
      </div>
    );
  };

  const SkeletonCard = () => (
    <div className="ks-stat-card skeleton-wrapper">
      <div className="ks-card-header">
        <div className="skeleton-icon skeleton-pulse"></div>
      </div>
      <div className="ks-card-body">
        <div className="skeleton-text-lg skeleton-pulse"></div>
        <div className="skeleton-text-sm skeleton-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="ks-dashboard-container">

      {/* Header */}
      <header className="ks-page-header">
        <div>
          <h1 className="ks-title">Overview</h1>
          {/* UPDATED: Dynamic user greeting */}
          <p className="ks-subtitle">Welcome back, {adminName}</p>
        </div>
        <div className="ks-date-pill">
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </header>

      {error && <div className="ks-alert-banner">{error}</div>}

      <div className="ks-grid-layout">

        {/* SECTION: USER METRICS */}
        <div className="ks-section-wrapper">
          <h3 className="ks-section-title">User Registry</h3>
          <div className="ks-metrics-grid">
            {loading ? (
              <>
                <SkeletonCard /> <SkeletonCard /> <SkeletonCard /> <SkeletonCard />
              </>
            ) : (
              <>
                <StatCard 
                  label="Total Users" 
                  value={stats?.users?.total} 
                  icon={Users} 
                  path="/admin/users"
                  colorType="blue"
                />
                <StatCard 
                  label="Male Profiles" 
                  value={stats?.users?.males} 
                  icon={UserCheck} 
                  path="/admin/users" 
                  colorType="cyan"
                />
                <StatCard 
                  label="Female Profiles" 
                  value={stats?.users?.females} 
                  icon={Star} 
                  path="/admin/users" 
                  colorType="rose"
                />
                <StatCard 
                  label="Restricted / Blocked" 
                  value={stats?.users?.blocked} 
                  icon={ShieldAlert} 
                  path="/admin/users" 
                  colorType="amber"
                />
              </>
            )}
          </div>
        </div>

        {/* SECTION: BUSINESS HEALTH */}
        <div className="ks-section-wrapper">
          <h3 className="ks-section-title">Business & Activity</h3>
          <div className="ks-metrics-grid">
            {loading ? (
              <>
                <SkeletonCard /> <SkeletonCard /> <SkeletonCard /> <SkeletonCard />
              </>
            ) : (
              <>
                <StatCard 
                  label="Active Agents" 
                  value={stats?.referrals?.totalAgents} 
                  icon={Briefcase} 
                  path="/admin/agents" 
                  colorType="purple"
                />
                <StatCard 
                  label="Interests Sent" 
                  value={stats?.platformHealth?.totalInterestsSent} 
                  icon={Heart} 
                  path="/admin/interest-approvals" 
                  colorType="emerald"
                />
                <StatCard 
                  label="Successful Matches" 
                  value={stats?.platformHealth?.successfulMatches} 
                  icon={CheckCircle} 
                  path="/admin/registration-approvals" 
                  colorType="teal"
                />
                <StatCard 
                  label="Referrals Made" 
                  value={stats?.referrals?.totalReferredUsers} 
                  icon={Share2} 
                  path="/admin/agents" 
                  colorType="indigo"
                />
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
