import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BalanceCard = ({
  balance = 0,
  totalDeposited = 0,
  totalWithdrawn = 0,
  currencySymbol = '$',
  account = {},
  showActions = true,
  className = ''
}) => {
  const [hideBalance, setHideBalance] = useState(false);

  // Net cashflow calculation
  const netCashFlow = totalDeposited - totalWithdrawn;
  const isPositiveFlow = netCashFlow >= 0;

  return (
    <div className={`balance-card-root ${className}`}>
      {/* Primary Hero Balance Card */}
      <div className="balance-hero-glass">
        <div className="balance-hero-header">
          <div className="account-tag-group">
            <span className="account-type-badge">
              <Sparkles size={13} className="sparkle-cyan" />
              {account.accountType || 'Premier Vault Account'}
            </span>
            <span className="account-status-pill">
              <span className="status-dot"></span>
              Active & Protected
            </span>
          </div>

          <button
            type="button"
            className="toggle-visibility-btn"
            onClick={() => setHideBalance(!hideBalance)}
            title={hideBalance ? 'Show balance' : 'Hide balance'}
          >
            {hideBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            <span className="toggle-text">{hideBalance ? 'Show' : 'Hide'}</span>
          </button>
        </div>

        {/* Center Balance Display */}
        <div className="balance-main-display">
          <div className="balance-title-label">Available Liquid Balance</div>
          <div className="balance-amount-row">
            <span className="currency-prefix">{currencySymbol}</span>
            <span className="balance-numeric">
              {hideBalance
                ? '••••••••'
                : balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="currency-code">{account.currency || 'USD'}</span>
          </div>
          
          <div className="account-holder-info">
            <span className="holder-name">{account.holderName || 'Account Holder'}</span>
            <span className="holder-divider">•</span>
            <span className="account-num font-mono">{account.accountNumber || 'CYAN-0000-0000'}</span>
          </div>
        </div>

        {/* Quick Deposit & Withdraw CTAs */}
        {showActions && (
          <div className="balance-quick-actions">
            <Link to="/deposit" className="quick-btn quick-deposit">
              <div className="btn-icon-bubble">
                <ArrowDownLeft size={18} />
              </div>
              <div className="btn-text-content">
                <span className="btn-label">Deposit Money</span>
                <span className="btn-subtext">Instant credit</span>
              </div>
              <ArrowRight size={16} className="chevron-right" />
            </Link>

            <Link to="/withdraw" className="quick-btn quick-withdraw">
              <div className="btn-icon-bubble">
                <ArrowUpRight size={18} />
              </div>
              <div className="btn-text-content">
                <span className="btn-label">Withdraw Money</span>
                <span className="btn-subtext">Fast transfer</span>
              </div>
              <ArrowRight size={16} className="chevron-right" />
            </Link>
          </div>
        )}
      </div>

      {/* Secondary Stats Grid: Total Deposited vs Total Withdrawn */}
      <div className="balance-metrics-grid">
        {/* Total Deposited Card */}
        <div className="metric-card metric-deposit">
          <div className="metric-icon-box">
            <ArrowDownLeft size={20} className="icon-deposit" />
          </div>
          <div className="metric-info">
            <div className="metric-label">Total Deposited</div>
            <div className="metric-value font-mono">
              {currencySymbol}{totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="metric-trend-badge deposit-trend">
            <TrendingUp size={14} />
            <span>Inflow</span>
          </div>
        </div>

        {/* Total Withdrawn Card */}
        <div className="metric-card metric-withdraw">
          <div className="metric-icon-box">
            <ArrowUpRight size={20} className="icon-withdraw" />
          </div>
          <div className="metric-info">
            <div className="metric-label">Total Withdrawn</div>
            <div className="metric-value font-mono">
              {currencySymbol}{totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="metric-trend-badge withdraw-trend">
            <TrendingDown size={14} />
            <span>Outflow</span>
          </div>
        </div>

        {/* Net Flow Ratio / Velocity */}
        <div className="metric-card metric-netflow">
          <div className="metric-icon-box">
            <ShieldCheck size={20} className="icon-netflow" />
          </div>
          <div className="metric-info">
            <div className="metric-label">Net Liquidity Ratio</div>
            <div className="metric-value font-mono">
              {isPositiveFlow ? '+' : ''}{currencySymbol}{Math.abs(netCashFlow).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className={`metric-trend-badge ${isPositiveFlow ? 'deposit-trend' : 'withdraw-trend'}`}>
            <span>{isPositiveFlow ? 'Surplus' : 'Deficit'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
