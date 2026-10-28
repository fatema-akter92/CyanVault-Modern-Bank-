import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import { 
  Building2, 
  LayoutDashboard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  History, 
  PieChart, 
  RotateCcw, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  LogIn,
  LogOut,
  User
} from 'lucide-react';

export const Navbar = () => {
  const { account, balance, resetDemoData, isAuthenticated, logoutUser } = useBank();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Deposit', path: '/deposit', icon: ArrowDownLeft },
    { name: 'Withdraw', path: '/withdraw', icon: ArrowUpRight },
    { name: 'Transactions', path: '/transactions', icon: History },
    { name: 'Analytics', path: '/analytics', icon: PieChart }
  ];

  const handleReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Left: Brand & Bank Name */}
        <div className="navbar-left">
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon-box">
              <Building2 className="logo-icon" size={22} />
              <div className="logo-sparkle">
                <Sparkles size={11} />
              </div>
            </div>
            <div className="brand-text-group">
              <div className="brand-title">
                Cyan<span>Vault</span>
              </div>
              <div className="brand-badge">
                <ShieldCheck size={11} />
                <span>{account.bankName}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links with Balanced Gaps */}
        <nav className="navbar-center desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={17} className="nav-icon" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Actions Cluster with Uniform Heights & Even Spacing */}
        <div className="navbar-right nav-actions">
          {/* Live Balance Pill */}
          <div className="balance-pill-badge" title="Live Available Balance">
            <span className="balance-pill-label">Live</span>
            <span className="balance-pill-amount font-mono">
              {account.currencySymbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* User Profile or Login state */}
          {isAuthenticated ? (
            <div className="user-profile-badge" title={`Signed in as ${account.holderName}`}>
              <div className="avatar-circle">
                {account.holderName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="user-details-compact">
                <span className="user-name-compact">{account.holderName}</span>
                <span className="user-acc-compact font-mono">{account.accountNumber}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="auth-icon-btn"
                title="Sign Out / Switch User"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm login-nav-btn">
              <LogIn size={15} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Reset Demo Button */}
          <button 
            type="button" 
            className="reset-btn"
            title="Reset to default initial balance and seed data"
            onClick={() => setShowResetConfirm(true)}
          >
            <RotateCcw size={15} />
            <span className="reset-btn-text">Reset</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            className="mobile-toggle-btn"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fadeIn">
          <div className="mobile-user-card">
            <div className="avatar-circle-lg">
              {account.holderName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="mobile-user-meta">
              <div className="mobile-user-name">{account.holderName}</div>
              <div className="mobile-user-acc font-mono">{account.accountNumber}</div>
              <div className="mobile-user-bal font-mono">
                {account.currencySymbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="mobile-nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `mobile-nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            {/* Login / Switch Account link in mobile drawer */}
            <NavLink
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `mobile-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <User size={19} />
              <span>{isAuthenticated ? 'Switch Account / Login' : 'Sign In to Vault'}</span>
            </NavLink>
          </div>

          <div className="mobile-footer-actions">
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
              onClick={() => {
                setMobileMenuOpen(false);
                setShowResetConfirm(true);
              }}
            >
              <RotateCcw size={15} />
              Reset All Demo Data
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-warning">
                <RotateCcw size={24} />
              </div>
              <h3 className="heading-md">Reset to Demo State?</h3>
            </div>
            <p className="modal-description">
              This will restore the initial balance ($8,450.00), seed transactions, and clear any new deposits/withdrawals made during this session.
            </p>
            <div className="modal-actions-row">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleReset}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
