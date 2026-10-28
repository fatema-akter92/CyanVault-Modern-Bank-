import React from 'react';
import { useBank } from '../context/BankContext';
import { DepositForm } from '../components/DepositForm';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionList } from '../components/TransactionList';
import { 
  ArrowDownLeft, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';

export const Deposit = () => {
  const { account, balance, transactions, totalDeposited, totalWithdrawn } = useBank();

  // Filter to only deposits for the recent deposit stream
  const depositTransactions = transactions.filter(t => t.type === 'Deposit');

  return (
    <div className="deposit-page animate-fadeIn">
      {/* Page Header */}
      <div className="page-header-banner">
        <div className="page-title-group">
          <div className="page-icon-badge badge-deposit-glow">
            <ArrowDownLeft size={24} className="text-deposit" />
          </div>
          <div>
            <h1 className="heading-xl">Deposit Money</h1>
            <p className="subheading">
              Instantly credit funds to your account with real-time balance updates
            </p>
          </div>
        </div>

        <div className="account-summary-pill">
          <span className="pill-label">Destination Account</span>
          <span className="pill-acc font-mono">{account.accountNumber}</span>
        </div>
      </div>

      {/* Main Grid: Form on the left, Balance Overview & Info on the right */}
      <div className="form-page-layout">
        <div className="form-layout-main">
          {/* Reusable DepositForm component */}
          <DepositForm />
        </div>

        <div className="form-layout-sidebar">
          {/* Quick Balance Status */}
          <div className="sidebar-balance-widget glass-card">
            <div className="widget-header">
              <span className="widget-title">Current Account Status</span>
              <span className="badge badge-cyan">Real-Time</span>
            </div>

            <div className="widget-balance-display">
              <span className="widget-sub">Available Balance</span>
              <div className="widget-numeric font-mono text-cyan font-bold">
                {account.currencySymbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="widget-stats-row">
              <div className="widget-stat-box">
                <span className="stat-label">Total Deposited</span>
                <span className="stat-val font-mono text-emerald">
                  +{account.currencySymbol}{totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="widget-stat-box">
                <span className="stat-label">Deposits Count</span>
                <span className="stat-val font-mono">{depositTransactions.length}</span>
              </div>
            </div>
          </div>

          {/* Deposit Perks Card */}
          <div className="perks-widget glass-card-subtle">
            <h3 className="perks-title">
              <Sparkles size={16} className="text-cyan" />
              Deposit Benefits
            </h3>
            <ul className="perks-list">
              <li>
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Zero processing or handling fees for all deposits</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Instant ledger settlement and immediate balance availability</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Audit trail with auto-generated reference identification</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Persistent storage in local cache for session preservation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Deposits Ledger Stream */}
      <div className="page-bottom-stream">
        <TransactionList
          transactions={depositTransactions}
          currencySymbol={account.currencySymbol}
          limit={4}
          showFilters={false}
          title="Recent Deposits History"
          subtitle="Showing your most recent inbound funds"
        />
      </div>
    </div>
  );
};
