import React from 'react';
import { useBank } from '../context/BankContext';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionList } from '../components/TransactionList';
import { VirtualCard } from '../components/VirtualCard';
import { SavingsTracker } from '../components/SavingsTracker';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  History, 
  Download, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

export const Dashboard = () => {
  const { 
    account, 
    balance, 
    transactions, 
    totalDeposited, 
    totalWithdrawn,
    exportTransactionsCSV 
  } = useBank();

  // Get current greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-page animate-fadeIn">
      {/* Top Banner & Header displaying Bank name, Application title, Account Holder, and Account Number */}
      <section className="dashboard-welcome-banner glass-card accent-border-top">
        <div className="banner-left">
          <div className="banner-badge-row">
            <span className="bank-name-badge">
              <Building2 size={14} className="text-cyan" />
              {account.bankName}
            </span>
            <span className="live-status-pill">
              <span className="pulse-indicator"></span>
              Live Simulated Engine
            </span>
          </div>

          <h1 className="banner-headline">
            {getGreeting()}, <span className="highlight-name">{account.holderName}</span>
          </h1>

          <p className="banner-subtitle">
            {account.applicationTitle}
          </p>
        </div>

        <div className="banner-right-meta">
          <div className="meta-info-card">
            <div className="meta-info-label">Account Number</div>
            <div className="meta-info-val font-mono">{account.accountNumber}</div>
          </div>
          <div className="meta-info-card">
            <div className="meta-info-label">Account Holder</div>
            <div className="meta-info-val">{account.holderName}</div>
          </div>
          <div className="meta-info-card">
            <div className="meta-info-label">Account Tier</div>
            <div className="meta-info-val text-cyan font-bold">{account.accountType}</div>
          </div>
        </div>
      </section>

      {/* Main Grid: Left = BalanceCard & Analytics, Right = Virtual Card & Savings Tracker */}
      <section className="dashboard-grid-hero">
        <div className="dashboard-hero-left">
          {/* Reusable BalanceCard component */}
          <BalanceCard
            balance={balance}
            totalDeposited={totalDeposited}
            totalWithdrawn={totalWithdrawn}
            currencySymbol={account.currencySymbol}
            account={account}
            showActions={true}
          />
        </div>

        <div className="dashboard-hero-right">
          {/* Interactive Virtual Platinum Card */}
          <VirtualCard account={account} balance={balance} />

          {/* Goal Savings Tracker */}
          <SavingsTracker />
        </div>
      </section>

      {/* Quick Action Navigation Strip */}
      <section className="quick-actions-strip">
        <Link to="/deposit" className="action-strip-card card-action-deposit">
          <div className="action-strip-icon bg-deposit-tint">
            <ArrowDownLeft size={22} className="text-deposit" />
          </div>
          <div>
            <h4 className="action-strip-title">Deposit Money</h4>
            <p className="action-strip-desc">Top up balance with immediate credit</p>
          </div>
        </Link>

        <Link to="/withdraw" className="action-strip-card card-action-withdraw">
          <div className="action-strip-icon bg-withdraw-tint">
            <ArrowUpRight size={22} className="text-withdraw" />
          </div>
          <div>
            <h4 className="action-strip-title">Withdraw Money</h4>
            <p className="action-strip-desc">Safe payout with balance verification</p>
          </div>
        </Link>

        <Link to="/transactions" className="action-strip-card card-action-history">
          <div className="action-strip-icon bg-cyan-tint">
            <History size={22} className="text-cyan" />
          </div>
          <div>
            <h4 className="action-strip-title">Full Ledger History</h4>
            <p className="action-strip-desc">Audit all past credits & debits</p>
          </div>
        </Link>

        <button 
          type="button" 
          onClick={exportTransactionsCSV}
          className="action-strip-card card-action-export"
        >
          <div className="action-strip-icon bg-subtle-tint">
            <Download size={22} className="text-main" />
          </div>
          <div>
            <h4 className="action-strip-title">Export Statement</h4>
            <p className="action-strip-desc">Download financial ledger as CSV</p>
          </div>
        </button>
      </section>

      {/* Recent Transactions Section using reusable TransactionList component */}
      <section className="dashboard-transactions-section">
        <TransactionList
          transactions={transactions}
          currencySymbol={account.currencySymbol}
          limit={5}
          showFilters={false}
          title="Recent Vault Activity"
          subtitle="Latest deposits and withdrawals in your account"
        />
      </section>
    </div>
  );
};
