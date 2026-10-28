import React from 'react';
import { AlertTriangle, X, Check, ArrowUpRight } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title = 'Confirm Transaction',
  amount = 0,
  currencySymbol = '$',
  category = '',
  currentBalance = 0,
  remainingBalance = 0,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-content confirmation-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onCancel} aria-label="Close">
          <X size={20} />
        </button>

        <div className="modal-warning-badge">
          <div className="icon-pulse-wrapper">
            <AlertTriangle size={32} className="warning-icon" />
          </div>
        </div>

        <h3 className="modal-heading-center">{title}</h3>
        <p className="modal-subheading-center">
          Please review the withdrawal summary below before authorizing this fund transfer.
        </p>

        <div className="withdrawal-summary-box">
          <div className="summary-row highlight">
            <span className="summary-label">Withdrawal Amount</span>
            <span className="summary-val font-mono amount-danger">
              -{currencySymbol}{parseFloat(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span className="summary-label">Category</span>
            <span className="summary-val category-badge">{category || 'General'}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Current Available Balance</span>
            <span className="summary-val font-mono">
              {currencySymbol}{currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Estimated Remaining Balance</span>
            <span className="summary-val font-mono text-cyan font-bold">
              {currencySymbol}{remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="modal-button-row">
          <button type="button" className="btn btn-secondary flex-1" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-withdraw flex-1" onClick={onConfirm}>
            <Check size={18} />
            Authorize & Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};
