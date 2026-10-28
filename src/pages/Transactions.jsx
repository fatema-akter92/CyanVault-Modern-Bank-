import React from 'react';
import { useBank } from '../context/BankContext';
import { TransactionList } from '../components/TransactionList';
import { 
  History, 
  Download, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  FileSpreadsheet, 
  PlusCircle, 
  CreditCard 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Transactions = () => {
  const { 
    account, 
    transactions, 
    totalDeposited, 
    totalWithdrawn, 
    balance, 
    exportTransactionsCSV 
  } = useBank();

  const depositCount = transactions.filter(t => t.type === 'Deposit').length;
  const withdrawCount = transactions.filter(t => t.type === 'Withdrawal').length;

  return (
    <div className="transactions-page animate-fadeIn">
      {/* Page Header */}
      <div className="page-header-banner">
        <div className="page-title-group">
          <div className="page-icon-badge badge-cyan-glow">
            <History size={24} className="text-cyan" />
          </div>
          <div>
            <h1 className="heading-xl">Transaction History</h1>
            <p className="subheading">
              Complete chronological audit ledger of all deposits and withdrawals
            </p>
          </div>
        </div>

        <div className="header-actions-row">
          <button
            type="button"
            onClick={exportTransactionsCSV}
            className="btn btn-secondary btn-sm"
            title="Export statement as CSV"
          >
            <Download size={16} />
            <span>Download CSV</span>
          </button>
          <Link to="/deposit" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>New Deposit</span>
          </Link>
        </div>
      </div>

      {/* Ledger Summary Metric Cards */}
      <div className="ledger-metrics-grid">
        <div className="ledger-metric-card glass-card">
          <div className="metric-header-row">
            <span className="metric-title">Available Balance</span>
            <Wallet size={18} className="text-cyan" />
          </div>
          <div className="metric-big-number font-mono text-cyan">
            {account.currencySymbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="metric-footnote">Simulated Vault Reserve</span>
        </div>

        <div className="ledger-metric-card glass-card">
          <div className="metric-header-row">
            <span className="metric-title">Total Inbound (Deposits)</span>
            <ArrowDownLeft size={18} className="text-deposit" />
          </div>
          <div className="metric-big-number font-mono text-emerald">
            +{account.currencySymbol}{totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="metric-footnote">{depositCount} deposit transactions</span>
        </div>

        <div className="ledger-metric-card glass-card">
          <div className="metric-header-row">
            <span className="metric-title">Total Outbound (Withdrawals)</span>
            <ArrowUpRight size={18} className="text-withdraw" />
          </div>
          <div className="metric-big-number font-mono text-withdraw">
            -{account.currencySymbol}{totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="metric-footnote">{withdrawCount} withdrawal transactions</span>
        </div>

        <div className="ledger-metric-card glass-card">
          <div className="metric-header-row">
            <span className="metric-title">Total Records</span>
            <FileSpreadsheet size={18} className="text-main" />
          </div>
          <div className="metric-big-number font-mono">
            {transactions.length}
          </div>
          <span className="metric-footnote">All recorded activities</span>
        </div>
      </div>

      {/* Full Transaction Ledger List with Filter & Search */}
      <div className="ledger-table-section">
        <TransactionList
          transactions={transactions}
          currencySymbol={account.currencySymbol}
          showFilters={true}
          title="Account Statement & History"
          subtitle="Real-time synchronized entries with persistent storage"
        />
      </div>
    </div>
  );
};
