import React, { useState, useRef, useEffect } from 'react';
import { useBank } from '../context/BankContext';
import { ConfirmationModal } from './ConfirmationModal';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  FileText, 
  ShieldAlert,
  Percent,
  TrendingDown
} from 'lucide-react';

const WITHDRAW_CATEGORIES = [
  'Bills & Utilities',
  'Rent / Mortgage',
  'Dining & Lifestyle',
  'Shopping & Retail',
  'Cash ATM Withdrawal',
  'Healthcare & Medical',
  'Education & Books',
  'Other Withdrawal'
];

const PRESET_AMOUNTS = [50, 100, 200, 500];

export const WithdrawForm = ({ onWithdrawSuccess }) => {
  const { withdrawMoney, account, balance } = useBank();

  // Bonus Task: Use useRef to focus on the amount input
  const amountInputRef = useRef(null);

  // Form states managed with useState
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(WITHDRAW_CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState({ type: null, message: '', reference: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Focus amount input on mount
  useEffect(() => {
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, []);

  // Quick preset dollar amount
  const handlePresetClick = (presetValue) => {
    setAmount(presetValue.toString());
    setFeedback({ type: null, message: '', reference: '' });
    if (amountInputRef.current) amountInputRef.current.focus();
  };

  // Quick preset percentage of balance
  const handlePercentageClick = (percentage) => {
    if (balance <= 0) return;
    const computed = ((balance * percentage) / 100).toFixed(2);
    setAmount(computed);
    setFeedback({ type: null, message: '', reference: '' });
    if (amountInputRef.current) amountInputRef.current.focus();
  };

  // Pre-validate input and trigger confirmation modal
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFeedback({ type: null, message: '', reference: '' });

    const trimmed = amount.trim();
    if (!trimmed) {
      setFeedback({
        type: 'error',
        message: 'Please specify a withdrawal amount.'
      });
      if (amountInputRef.current) amountInputRef.current.focus();
      return;
    }

    const numAmount = parseFloat(trimmed);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFeedback({
        type: 'error',
        message: 'Invalid withdrawal amount! Amount must be strictly greater than zero.'
      });
      if (amountInputRef.current) amountInputRef.current.focus();
      return;
    }

    if (numAmount > balance) {
      setFeedback({
        type: 'error',
        message: `Insufficient funds! You requested ${account.currencySymbol}${numAmount.toFixed(2)}, but your current balance is ${account.currencySymbol}${balance.toFixed(2)}.`
      });
      if (amountInputRef.current) amountInputRef.current.focus();
      return;
    }

    // Amount is valid, open confirmation modal (Bonus Task requirement!)
    setShowConfirmModal(true);
  };

  // Final authorized withdrawal execution
  const handleConfirmedWithdrawal = () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      const numAmount = parseFloat(amount.trim());
      const result = withdrawMoney(numAmount, category, note);

      if (result.success) {
        setFeedback({
          type: 'success',
          message: result.message,
          reference: result.transaction?.reference || 'WTH-CONFIRMED'
        });

        // Clear input values
        setAmount('');
        setNote('');

        if (onWithdrawSuccess) {
          onWithdrawSuccess(result.transaction);
        }
      } else {
        setFeedback({
          type: 'error',
          message: result.message
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'An unexpected system error occurred while processing the withdrawal.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedAmount = parseFloat(amount) || 0;
  const remainingEstimate = Math.max(0, balance - parsedAmount);

  return (
    <div className="withdraw-form-card glass-card">
      <div className="card-header-styled withdraw-header">
        <div className="header-icon-circle withdraw-circle">
          <ArrowUpRight size={22} className="header-icon" />
        </div>
        <div>
          <h2 className="heading-md">Withdraw Funds</h2>
          <p className="subheading">Secure disbursement from your {account.bankName} vault</p>
        </div>
      </div>

      {/* Feedback Alert Banners */}
      {feedback.type === 'success' && (
        <div className="alert alert-success">
          <CheckCircle2 size={22} className="alert-icon-check" />
          <div className="alert-content">
            <strong>Withdrawal Approved!</strong>
            <p>{feedback.message}</p>
            {feedback.reference && (
              <span className="reference-pill font-mono">
                Transaction ID: {feedback.reference}
              </span>
            )}
          </div>
        </div>
      )}

      {feedback.type === 'error' && (
        <div className="alert alert-error">
          <AlertCircle size={22} className="alert-icon-warn" />
          <div className="alert-content">
            <strong>Withdrawal Denied</strong>
            <p>{feedback.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="action-form">
        {/* Amount Input */}
        <div className="form-group">
          <div className="form-label">
            <span>Withdrawal Amount</span>
            <span className="current-bal-hint">
              Available: <strong>{account.currencySymbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </span>
          </div>

          <div className="input-with-symbol">
            <span className="input-symbol">{account.currencySymbol}</span>
            <input
              ref={amountInputRef}
              type="number"
              step="any"
              min="0.01"
              max={balance}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (feedback.type) setFeedback({ type: null, message: '', reference: '' });
              }}
              placeholder="0.00"
              className="form-control amount-input"
            />
          </div>

          {/* Quick Amount & Percentage Presets */}
          <div className="preset-container">
            <span className="preset-label">Quick Amounts:</span>
            <div className="chips-grid">
              {PRESET_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePresetClick(val)}
                  className={`chip-btn ${amount === val.toString() ? 'active' : ''}`}
                >
                  {account.currencySymbol}{val}
                </button>
              ))}
              <span className="chip-separator">|</span>
              <button
                type="button"
                onClick={() => handlePercentageClick(25)}
                className="chip-btn chip-percent"
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => handlePercentageClick(50)}
                className="chip-btn chip-percent"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => handlePercentageClick(100)}
                className="chip-btn chip-percent chip-max"
              >
                Max ({account.currencySymbol}{balance.toFixed(0)})
              </button>
            </div>
          </div>
        </div>

        {/* Live Remaining Balance Calculation Preview */}
        {parsedAmount > 0 && parsedAmount <= balance && (
          <div className="balance-projection-card">
            <div className="projection-row">
              <span className="projection-label">Projected Remaining Balance:</span>
              <span className="projection-value font-mono">
                {account.currencySymbol}{remainingEstimate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        {/* Category Select */}
        <div className="form-group">
          <label className="form-label" htmlFor="withdraw-category">
            <span className="label-with-icon">
              <Tag size={16} /> Category
            </span>
          </label>
          <select
            id="withdraw-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control select-control"
          >
            {WITHDRAW_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Optional Note */}
        <div className="form-group">
          <label className="form-label" htmlFor="withdraw-note">
            <span className="label-with-icon">
              <FileText size={16} /> Withdrawal Purpose / Reference (Optional)
            </span>
          </label>
          <input
            id="withdraw-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Monthly rent payout or groceries"
            maxLength={80}
            className="form-control"
          />
        </div>

        {/* Safety Note */}
        <div className="withdraw-safety-pill">
          <ShieldAlert size={16} className="text-withdraw" />
          <span>Security Notice: You will be asked for final confirmation before funds are deducted.</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || balance <= 0}
          className="btn btn-withdraw btn-lg submit-action-btn"
        >
          <ArrowUpRight size={20} />
          {balance <= 0 ? 'Zero Balance - Cannot Withdraw' : isSubmitting ? 'Processing...' : 'Review & Withdraw'}
        </button>
      </form>

      {/* Confirmation Modal (Bonus Requirement) */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Fund Withdrawal"
        amount={parsedAmount}
        category={category}
        currencySymbol={account.currencySymbol}
        currentBalance={balance}
        remainingBalance={remainingEstimate}
        onConfirm={handleConfirmedWithdrawal}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
