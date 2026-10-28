import React, { useState } from 'react';
import { Target, Sparkles, TrendingUp, Edit3, Check } from 'lucide-react';
import { useBank } from '../context/BankContext';
import confetti from 'canvas-confetti';

export const SavingsTracker = () => {
  const { savingsGoal, setSavingsGoal, depositMoney, balance, account } = useBank();
  const [isEditing, setIsEditing] = useState(false);
  const [targetTitle, setTargetTitle] = useState(savingsGoal.title);
  const [targetAmount, setTargetAmount] = useState(savingsGoal.targetAmount.toString());

  const progressPercent = Math.min(
    100,
    Math.round((balance / (savingsGoal.targetAmount || 1)) * 100)
  );

  const remainingToGoal = Math.max(0, savingsGoal.targetAmount - balance);

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const parsed = parseFloat(targetAmount);
    if (!isNaN(parsed) && parsed > 0) {
      setSavingsGoal({
        ...savingsGoal,
        title: targetTitle.trim() || 'Savings Target',
        targetAmount: parsed
      });
      setIsEditing(false);
    }
  };

  const handleQuickAddFifty = () => {
    const res = depositMoney(50, 'Savings Goal Boost', `Allocated toward ${savingsGoal.title}`);
    if (res.success) {
      try {
        confetti({
          particleCount: 45,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#2dd4bf', '#38bdf8', '#a7f3d0']
        });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="savings-tracker-card glass-card">
      <div className="savings-header-row">
        <div className="savings-title-box">
          <div className="target-icon-box">
            <Target size={20} className="target-icon" />
          </div>
          <div>
            <h3 className="savings-card-title">Wealth Goal Tracker</h3>
            <p className="savings-card-sub">Automated liquid savings reserve</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="edit-goal-btn"
          title="Customize Goal"
        >
          <Edit3 size={15} />
          <span>{isEditing ? 'Cancel' : 'Edit Goal'}</span>
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveGoal} className="goal-edit-form">
          <div className="form-group mb-2">
            <label className="form-label text-xs">Goal Name</label>
            <input
              type="text"
              value={targetTitle}
              onChange={(e) => setTargetTitle(e.target.value)}
              className="form-control form-control-sm"
              placeholder="e.g. Dream Vacation or Emergency Fund"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label className="form-label text-xs">Target Amount ({account.currencySymbol})</label>
            <input
              type="number"
              step="any"
              min="1"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="form-control form-control-sm"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm w-full">
            <Check size={14} /> Update Goal
          </button>
        </form>
      ) : (
        <>
          <div className="goal-status-headline">
            <span className="goal-name-badge">
              <Sparkles size={13} className="text-cyan" />
              {savingsGoal.title}
            </span>
            <span className="goal-percent-text">{progressPercent}% Achieved</span>
          </div>

          {/* Progress Bar Container */}
          <div className="savings-progress-track">
            <div
              className="savings-progress-fill"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="progress-glow-point"></div>
            </div>
          </div>

          {/* Metric Details */}
          <div className="savings-metrics-row">
            <div>
              <span className="stat-sublabel">Current Balance</span>
              <span className="stat-mainval font-mono">
                {account.currencySymbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="text-right">
              <span className="stat-sublabel">Target Goal</span>
              <span className="stat-mainval font-mono">
                {account.currencySymbol}{savingsGoal.targetAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="savings-footer-cta">
            <span className="remaining-text">
              {remainingToGoal > 0 ? (
                <>Only <strong>{account.currencySymbol}{remainingToGoal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> away from your milestone!</>
              ) : (
                <span className="text-emerald font-semibold">🎉 Milestone goal reached!</span>
              )}
            </span>
            <button
              type="button"
              onClick={handleQuickAddFifty}
              className="btn btn-secondary btn-sm quick-save-btn"
              title="Deposit $50 immediately towards this goal"
            >
              <TrendingUp size={14} />
              +${50} Boost
            </button>
          </div>
        </>
      )}
    </div>
  );
};
