import React from 'react';
import { ShieldCheck, Lock, Building2, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBank } from '../context/BankContext';

export const Footer = () => {
  const { account } = useBank();

  return (
    <footer className="footer-root">
      <div className="footer-container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-column">
            <div className="footer-logo-row">
              <div className="footer-icon-box">
                <Building2 size={20} />
              </div>
              <span className="footer-brand-title">Cyan<span>Vault</span></span>
            </div>
            <p className="footer-tagline">
              Next-generation institutional wealth and liquid capital management. Engineered with pastel precision and security.
            </p>
            <div className="security-badges-row">
              <div className="security-chip">
                <Lock size={12} />
                <span>256-Bit Encrypted</span>
              </div>
              <div className="security-chip">
                <ShieldCheck size={12} />
                <span>Simulated FDIC Protected</span>
              </div>
            </div>
          </div>

          {/* Quick Page Links */}
          <div className="footer-links-column">
            <h4 className="footer-column-heading">Navigation</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Dashboard Overview</Link></li>
              <li><Link to="/deposit">Deposit Funds</Link></li>
              <li><Link to="/withdraw">Withdraw Funds</Link></li>
              <li><Link to="/transactions">Transaction History</Link></li>
              <li><Link to="/analytics">Analytics & Goals</Link></li>
            </ul>
          </div>

          {/* Account Security Information */}
          <div className="footer-links-column">
            <h4 className="footer-column-heading">Account Protocol</h4>
            <ul className="footer-links-list">
              <li><span>Routing: <strong>{account.routingNumber}</strong></span></li>
              <li><span>Vault No: <strong>{account.accountNumber}</strong></span></li>
              <li><span>Tier: <strong>{account.accountType}</strong></span></li>
              <li><span>Member Since: <strong>{account.memberSince}</strong></span></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Bottom Disclaimer */}
        <div className="footer-bottom-row">
          <p className="academic-notice">
            <strong>Important Notice:</strong> This is an educational demonstration project. No real banking backend, database, or actual currency transactions occur. All account balances and operations are simulated in-browser.
          </p>
          <div className="copyright-tag">
            <span>© {new Date().getFullYear()} {account.bankName}.Designed by Fatema (CyanVault).</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
