import React from 'react';
import { useBank } from '../context/BankContext';
import { WithdrawForm } from '../components/WithdrawForm';
import { TransactionList } from '../components/TransactionList';
import { 
  ArrowUpRight, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

export const Withdraw = () => {
  const { account, balance, transactions, totalWithdrawn } = useBank();

  // Filter to only withdrawals for the recent withdrawal stream
  const withdrawalTransactions = transactions.filter(t => t.type === 'Withdrawal');

  return (
    <div className="withdraw-page animate-fadeIn">
      {/* Page Header */}
      <div className="page-header-banner">
        <div className="page-title-group">
          <div className="page-icon-badge badge-withdraw-glow">
            <ArrowUpRight size={24} className="text-withdraw" />
          </div>
          <div>
            <h1 className="heading-xl">Withdraw Money</h1>
            <p className="subheading">
              Securely transfer or withdraw funds from your available account balance
            </p>
          </div>
        </div>

        <div className="account-summary-pill">
          <span className="pill-label">Source Vault</span>
          <span className="pill-acc font-mono">{account.accountNumber}</span>
        </div>
      </div>

      {/* Main Grid: Form on the left, Balance Overview & Security rules on the right */}
      <div className="form-page-layout">
        <div className="form-layout-main">
          {/* Reusable WithdrawForm component */}
          <WithdrawForm />
        </div>

        <div className="form-layout-sidebar">
          {/* Quick Balance Status */}
          <div className="sidebar-balance-widget glass-card">
            <div className="widget-header">
              <span className="widget-title">Available Liquidity</span>
              <span className="badge badge-neutral">Max Limit</span>
            </div>

            <div className="widget-balance-display">
              <span className="widget-sub">Available to Withdraw</span>
              <div className="widget-numeric font-mono text-cyan font-bold">
                {account.currencySymbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="widget-stats-row">
              <div className="widget-stat-box">
                <span className="stat-label">Total Withdrawn</span>
                <span className="stat-val font-mono text-withdraw">
                  -{account.currencySymbol}{totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="widget-stat-box">
                <span className="stat-label">Withdrawals Count</span>
                <span className="stat-val font-mono">{withdrawalTransactions.length}</span>
              </div>
            </div>
          </div>

          {/* Security & Withdrawal Guidelines Card */}
          <div className="perks-widget glass-card-subtle">
            <h3 className="perks-title">
              <ShieldAlert size={16} className="text-withdraw" />
              Withdrawal Rules & Safeguards
            </h3>
            <ul className="perks-list">
              <li>
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Overdraft Protection: Withdrawals greater than balance are strictly prevented</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Positive Amount Validation: Zero or negative sums cannot be submitted</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Confirmation Authorization: Two-step confirmation modal before final deduction</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-cyan" />
                <span>Immediate Balance Update: Balance updates synchronously in real time</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Withdrawals Ledger Stream */}
      <div className="page-bottom-stream">
        <TransactionList
          transactions={withdrawalTransactions}
          currencySymbol={account.currencySymbol}
          limit={4}
          showFilters={false}
          title="Recent Withdrawals History"
          subtitle="Showing your most recent outbound funds"
        />
      </div>
    </div>
  );
};
