import React, { useState, useRef, useEffect } from 'react';
import { useBank } from '../context/BankContext';
import { 
  ArrowDownLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Tag, 
  FileText, 
  DollarSign,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DEPOSIT_CATEGORIES = [
  'Direct Deposit / Salary',
  'Investment Return',
  'Freelance / Consulting',
  'Gift / Family Support',
  'Account Transfer In',
  'Tax Refund',
  'Other Deposit'
];

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000, 2500];

export const DepositForm = ({ onDepositSuccess }) => {
  const { depositMoney, account, balance } = useBank();
  
  // Bonus Task: Use useRef to focus on the amount input
  const amountInputRef = useRef(null);

  // Form states managed with useState
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(DEPOSIT_CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState({ type: null, message: '', reference: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Focus amount input on mount
  useEffect(() => {
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, []);

  // Quick preset button handler
  const handlePresetClick = (presetValue) => {
    setAmount(presetValue.toString());
    setFeedback({ type: null, message: '', reference: '' });
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  };

  // Form submission handler using onSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback({ type: null, message: '', reference: '' });

    // Validation checks
    const trimmedAmount = amount.trim();
    if (!trimmedAmount) {
      setFeedback({
        type: 'error',
        message: 'Please enter an amount to deposit.'
      });
      if (amountInputRef.current) amountInputRef.current.focus();
      return;
    }

    const numAmount = parseFloat(trimmedAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFeedback({
        type: 'error',
        message: 'Invalid deposit amount! Amount must be greater than zero.'
      });
      if (amountInputRef.current) amountInputRef.current.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      // Execute deposit through Context
      const result = depositMoney(numAmount, category, note);

      if (result.success) {
        setFeedback({
          type: 'success',
          message: result.message,
          reference: result.transaction?.reference || 'DEP-CONFIRMED'
        });

        // Trigger celebratory confetti burst
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#2dd4bf', '#06b6d4', '#10b981', '#a7f3d0']
          });
        } catch {
          // fallback if canvas not available
        }

        // Reset form inputs
        setAmount('');
        setNote('');

        if (onDepositSuccess) {
          onDepositSuccess(result.transaction);
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
        message: 'An unexpected error occurred while processing the deposit.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="deposit-form-card glass-card">
      <div className="card-header-styled deposit-header">
        <div className="header-icon-circle deposit-circle">
          <ArrowDownLeft size={22} className="header-icon" />
        </div>
        <div>
          <h2 className="heading-md">Deposit Funds</h2>
          <p className="subheading">Credit funds instantly into your {account.bankName} vault</p>
        </div>
      </div>

      {/* Feedback Messages */}
      {feedback.type === 'success' && (
        <div className="alert alert-success">
          <CheckCircle2 size={22} className="alert-icon-check" />
          <div className="alert-content">
            <strong>Deposit Complete!</strong>
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
            <strong>Invalid Operation</strong>
            <p>{feedback.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="action-form">
        {/* Amount Input */}
        <div className="form-group">
          <div className="form-label">
            <span>Deposit Amount</span>
            <span className="current-bal-hint">
              Current Balance: <strong>{account.currencySymbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </span>
          </div>

          <div className="input-with-symbol">
            <span className="input-symbol">{account.currencySymbol}</span>
            <input
              ref={amountInputRef}
              type="number"
              step="any"
              min="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (feedback.type) setFeedback({ type: null, message: '', reference: '' });
              }}
              placeholder="0.00"
              className="form-control amount-input"
            />
          </div>

          {/* Quick preset chips */}
          <div className="preset-container">
            <span className="preset-label">Quick Presets:</span>
            <div className="chips-grid">
              {PRESET_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePresetClick(val)}
                  className={`chip-btn ${amount === val.toString() ? 'active' : ''}`}
                >
                  +{account.currencySymbol}{val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Deposit Category */}
        <div className="form-group">
          <label className="form-label" htmlFor="deposit-category">
            <span className="label-with-icon">
              <Tag size={16} /> Category
            </span>
          </label>
          <select
            id="deposit-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control select-control"
          >
            {DEPOSIT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Optional Note / Reference */}
        <div className="form-group">
          <label className="form-label" htmlFor="deposit-note">
            <span className="label-with-icon">
              <FileText size={16} /> Description / Reference Note (Optional)
            </span>
          </label>
          <input
            id="deposit-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. November consulting invoice #482"
            maxLength={80}
            className="form-control"
          />
        </div>

        {/* Instant Settlement Guarantee Banner */}
        <div className="deposit-benefit-pill">
          <Sparkles size={16} className="text-cyan" />
          <span>Instant Settlement: Funds will be available in your balance immediately upon submission.</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-deposit btn-lg submit-action-btn"
        >
          <ArrowDownLeft size={20} />
          {isSubmitting ? 'Processing Deposit...' : 'Confirm Deposit'}
        </button>
      </form>
    </div>
  );
};
