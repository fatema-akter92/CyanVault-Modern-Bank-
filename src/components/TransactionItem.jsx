import React, { useState } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  Tag, 
  Copy, 
  Check, 
  FileText 
} from 'lucide-react';

export const TransactionItem = ({ transaction, currencySymbol = '$' }) => {
  const [copied, setCopied] = useState(false);
  const isDeposit = transaction.type === 'Deposit';

  const handleCopyRef = () => {
    if (transaction.reference) {
      navigator.clipboard.writeText(transaction.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className={`transaction-item-card ${isDeposit ? 'item-deposit' : 'item-withdrawal'}`}>
      <div className="item-left-section">
        {/* Type Icon Badge */}
        <div className={`type-avatar-box ${isDeposit ? 'type-deposit' : 'type-withdrawal'}`}>
          {isDeposit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>

        {/* Details & Description */}
        <div className="item-meta-group">
          <div className="item-title-row">
            <span className="item-category-title">{transaction.category || (isDeposit ? 'Deposit' : 'Withdrawal')}</span>
            <span className={`badge ${isDeposit ? 'badge-deposit' : 'badge-withdraw'}`}>
              {transaction.type}
            </span>
          </div>

          {transaction.note && (
            <p className="item-note-text">
              <FileText size={12} className="inline-note-icon" />
              {transaction.note}
            </p>
          )}

          <div className="item-sub-info">
            <span className="timestamp-item">
              <Calendar size={12} />
              {transaction.date}
            </span>
            {transaction.time && (
              <span className="timestamp-item">
                <Clock size={12} />
                {transaction.time}
              </span>
            )}
            {transaction.reference && (
              <button 
                type="button" 
                onClick={handleCopyRef} 
                className="ref-copy-pill"
                title="Click to copy reference ID"
              >
                <span className="font-mono">{transaction.reference}</span>
                {copied ? <Check size={11} className="text-emerald" /> : <Copy size={11} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Amount Display */}
      <div className="item-right-section">
        <div className={`transaction-amount font-mono ${isDeposit ? 'amount-deposit' : 'amount-withdrawal'}`}>
          {isDeposit ? '+' : '-'}{currencySymbol}{parseFloat(transaction.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <span className="settlement-status">Completed</span>
      </div>
    </div>
  );
};
