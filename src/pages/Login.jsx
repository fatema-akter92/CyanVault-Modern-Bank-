import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  UserCheck, 
  Fingerprint, 
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Login = () => {
  const { account, loginUser, isAuthenticated } = useBank();
  const navigate = useNavigate();

  const [holderName, setHolderName] = useState(account.holderName || 'Evelyn Reed');
  const [accountNumber, setAccountNumber] = useState(account.accountNumber || 'CYAN-8492-9014');
  const [pin, setPin] = useState('8492');
  const [showPin, setShowPin] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setFeedback({ type: null, message: '' });

    if (!accountNumber.trim()) {
      setFeedback({ type: 'error', message: 'Please provide an account number or username.' });
      return;
    }

    if (!pin.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your vault access PIN or password.' });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      loginUser(holderName.trim() || 'Evelyn Reed', accountNumber.trim() || 'CYAN-8492-9014');
      setIsLoading(false);
      setFeedback({ type: 'success', message: 'Authentication verified! Directing to vault...' });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2dd4bf', '#06b6d4', '#a7f3d0']
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        navigate('/');
      }, 700);
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setHolderName('Evelyn Reed');
    setAccountNumber('CYAN-8492-9014');
    setPin('8492');
    setIsLoading(true);

    setTimeout(() => {
      loginUser('Evelyn Reed', 'CYAN-8492-9014');
      setIsLoading(false);
      navigate('/');
    }, 400);
  };

  return (
    <div className="login-page-container animate-fadeIn">
      <div className="login-card glass-card">
        {/* Top Accent Strip */}
        <div className="login-top-accent"></div>

        {/* Bank Brand Header */}
        <div className="login-header">
          <div className="login-logo-circle">
            <Building2 size={28} className="text-white" />
            <div className="login-sparkle-dot">
              <Sparkles size={13} />
            </div>
          </div>
          <h1 className="login-brand-title">
            Cyan<span>Vault</span>
          </h1>
          <div className="login-security-tag">
            <ShieldCheck size={14} className="text-cyan" />
            <span>Institutional Secure Portal</span>
          </div>
          <p className="login-welcome-text">
            Sign in to access your liquid assets, simulated balances, and transaction ledger.
          </p>
        </div>

        {/* Feedback Message */}
        {feedback.type === 'error' && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <span>{feedback.message}</span>
          </div>
        )}
        {feedback.type === 'success' && (
          <div className="alert alert-success">
            <CheckCircle2 size={20} />
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Quick Demo Access One-Click Button */}
        <div className="demo-credentials-card">
          <div className="demo-card-left">
            <div className="demo-avatar">ER</div>
            <div>
              <div className="demo-name">Evelyn Reed (Demo Profile)</div>
              <div className="demo-acc font-mono">CYAN-8492-9014 • PIN: 8492</div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm quick-demo-btn"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
          >
            <UserCheck size={15} />
            <span>1-Click Demo Login</span>
          </button>
        </div>

        <div className="login-divider-row">
          <span>or sign in manually</span>
        </div>

        {/* Main Login Form */}
        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="holder-name-input">
              Account Holder Name
            </label>
            <input
              id="holder-name-input"
              type="text"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              placeholder="e.g. Evelyn Reed"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="account-num-input">
              Account / Vault Number
            </label>
            <input
              id="account-num-input"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. CYAN-8492-9014"
              className="form-control font-mono"
              required
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>Security PIN / Password</span>
              <span className="text-xs text-muted">Default: 8492</span>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                maxLength={16}
                className="form-control font-mono"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPin(!showPin)}
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full submit-login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Authenticating Vault...</span>
            ) : (
              <>
                <span>Access Bank Vault</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Bottom Security Assurance */}
        <div className="login-footer-security">
          <div className="security-icon-row">
            <Fingerprint size={16} className="text-cyan" />
            <span>Simulated Multi-Factor & Biometric Protection</span>
          </div>
          <p className="login-disclaimer-text">
            CyanTrust is a simulated educational React banking application. No real credentials or bank accounts are connected.
          </p>
        </div>
      </div>
    </div>
  );
};
