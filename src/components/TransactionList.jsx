import React, { useState } from 'react';
import { TransactionItem } from './TransactionItem';
import { Link } from 'react-router-dom';
import { 
  Inbox, 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowUpDown, 
  SlidersHorizontal 
} from 'lucide-react';

export const TransactionList = ({
  transactions = [],
  currencySymbol = '$',
  limit = null,
  showFilters = true,
  title = 'Transaction History',
  subtitle = 'Audit ledger and activity stream'
}) => {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'Deposit' | 'Withdrawal'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'amount-high' | 'amount-low'

  // Filter pipeline
  let filtered = transactions.filter((t) => {
    // 1. Filter by Type
    if (filterType !== 'ALL' && t.type !== filterType) {
      return false;
    }

    // 2. Filter by search query (note, category, reference, or amount)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchCategory = (t.category || '').toLowerCase().includes(q);
      const matchNote = (t.note || '').toLowerCase().includes(q);
      const matchRef = (t.reference || '').toLowerCase().includes(q);
      const matchAmount = (t.amount || '').toString().includes(q);
      if (!matchCategory && !matchNote && !matchRef && !matchAmount) {
        return false;
      }
    }
    return true;
  });

  // Sorting pipeline
  filtered.sort((a, b) => {
    if (sortBy === 'newest') return (b.timestamp || 0) - (a.timestamp || 0);
    if (sortBy === 'oldest') return (a.timestamp || 0) - (b.timestamp || 0);
    if (sortBy === 'amount-high') return (b.amount || 0) - (a.amount || 0);
    if (sortBy === 'amount-low') return (a.amount || 0) - (b.amount || 0);
    return 0;
  });

  // Apply limit if specified
  const displayItems = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div className="transaction-list-card glass-card">
      <div className="list-header-row">
        <div>
          <h2 className="heading-md">{title}</h2>
          {subtitle && <p className="subheading">{subtitle}</p>}
        </div>

        {limit && transactions.length > limit && (
          <Link to="/transactions" className="btn btn-secondary btn-sm">
            View All ({transactions.length})
          </Link>
        )}
      </div>

      {/* Filter and Search Toolbar */}
      {showFilters && (
        <div className="toolbar-section">
          {/* Search box */}
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by category, note, reference, amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>

          <div className="toolbar-actions-row">
            {/* Filter pills */}
            <div className="filter-pill-group">
              <button
                type="button"
                className={`filter-pill ${filterType === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilterType('ALL')}
              >
                All ({transactions.length})
              </button>
              <button
                type="button"
                className={`filter-pill pill-deposit ${filterType === 'Deposit' ? 'active' : ''}`}
                onClick={() => setFilterType('Deposit')}
              >
                <ArrowDownLeft size={14} /> Deposits
              </button>
              <button
                type="button"
                className={`filter-pill pill-withdraw ${filterType === 'Withdrawal' ? 'active' : ''}`}
                onClick={() => setFilterType('Withdrawal')}
              >
                <ArrowUpRight size={14} /> Withdrawals
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="sort-dropdown-wrapper">
              <ArrowUpDown size={15} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
                aria-label="Sort transactions"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Render with map() & Conditional Rendering for Empty State */}
      <div className="transactions-container">
        {displayItems.length === 0 ? (
          /* Conditional rendering: message when no transactions exist */
          <div className="empty-transactions-state">
            <div className="empty-icon-circle">
              <Inbox size={42} className="empty-inbox-icon" />
            </div>
            <h3 className="empty-title">
              {transactions.length === 0 ? 'No Transactions Recorded Yet' : 'No Matching Transactions Found'}
            </h3>
            <p className="empty-subtext">
              {transactions.length === 0
                ? 'Your account ledger is currently empty. Make your first deposit to initiate activity!'
                : 'Try adjusting your search criteria or resetting the active filters.'}
            </p>
            {transactions.length === 0 ? (
              <Link to="/deposit" className="btn btn-primary btn-sm">
                <ArrowDownLeft size={16} /> Make a Deposit
              </Link>
            ) : (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setFilterType('ALL');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          /* Rendering using map() */
          <div className="transaction-items-list">
            {displayItems.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                currencySymbol={currencySymbol}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer summary stats */}
      {displayItems.length > 0 && (
        <div className="list-footer-stats">
          <span>
            Showing <strong>{displayItems.length}</strong> of <strong>{transactions.length}</strong> transactions
          </span>
          {limit && transactions.length > limit && (
            <Link to="/transactions" className="view-more-link">
              Explore Complete History →
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
