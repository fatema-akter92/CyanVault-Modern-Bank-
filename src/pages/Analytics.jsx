import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { SavingsTracker } from '../components/SavingsTracker';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Sparkles, 
  DollarSign, 
  Percent, 
  Calendar,
  Layers,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

export const Analytics = () => {
  const { account, balance, transactions, totalDeposited, totalWithdrawn } = useBank();
  const [interestApy, setInterestApy] = useState(4.85); // 4.85% APY High-Yield Savings simulation

  // Inflow vs Outflow calculations
  const totalFlow = totalDeposited + totalWithdrawn;
  const depositPercent = totalFlow > 0 ? Math.round((totalDeposited / totalFlow) * 100) : 50;
  const withdrawPercent = totalFlow > 0 ? 100 - depositPercent : 50;

  // Retention / Savings rate
  const savingsRate = totalDeposited > 0 ? Math.max(0, Math.round(((totalDeposited - totalWithdrawn) / totalDeposited) * 100)) : 0;

  // Average ticket sizes
  const depositTxns = transactions.filter(t => t.type === 'Deposit');
  const withdrawTxns = transactions.filter(t => t.type === 'Withdrawal');

  const avgDeposit = depositTxns.length > 0 ? totalDeposited / depositTxns.length : 0;
  const avgWithdrawal = withdrawTxns.length > 0 ? totalWithdrawn / withdrawTxns.length : 0;

  // Category breakdown calculation
  const categoryTotals = {};
  transactions.forEach(t => {
    const cat = t.category || 'General';
    if (!categoryTotals[cat]) {
      categoryTotals[cat] = { total: 0, count: 0, type: t.type };
    }
    categoryTotals[cat].total += Number(t.amount || 0);
    categoryTotals[cat].count += 1;
  });

  const categoryList = Object.entries(categoryTotals)
    .map(([cat, data]) => ({ name: cat, ...data }))
    .sort((a, b) => b.total - a.total);

  // Interest projection formula: A = P * (1 + r/n)^(nt)
  const calculateInterest = (months) => {
    const years = months / 12;
    const rate = interestApy / 100;
    const futureValue = balance * Math.pow(1 + rate / 12, 12 * years);
    const earnings = futureValue - balance;
    return {
      futureValue,
      earnings
    };
  };

  const projection1Mo = calculateInterest(1);
  const projection6Mo = calculateInterest(6);
  const projection1Yr = calculateInterest(12);
  const projection3Yr = calculateInterest(36);

  return (
    <div className="analytics-page animate-fadeIn">
      {/* Page Header */}
      <div className="page-header-banner">
        <div className="page-title-group">
          <div className="page-icon-badge badge-cyan-glow">
            <PieChart size={24} className="text-cyan" />
          </div>
          <div>
            <h1 className="heading-xl">Financial Intelligence & Analytics</h1>
            <p className="subheading">
              Visual insights, cash flow velocity, and simulated yield projections
            </p>
          </div>
        </div>

        <div className="account-summary-pill">
          <span className="pill-label">Vault Reserve</span>
          <span className="pill-acc font-mono">{account.currencySymbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Top 4 Performance Metric Cards */}
      <div className="ledger-metrics-grid">
        <div className="ledger-metric-card glass-card">
          <div className="metric-header-row">
            <span className="metric-title">Capital Retention Rate</span>
            <Percent size={18} className="text-cyan" />
          </div>
          <div className="metric-big-number font-mono text-cyan">
            {savingsRate}%
          </div>
          <span className="metric-footnote">Percentage of inflows preserved</span>
        </div>

        <div className="ledger-metric-card glass-card">
          <div className="metric-header-row">
            <span className="metric-title">Avg. Deposit Size</span>
            <TrendingUp size={18} className="text-emerald" />
          </div>
          <div className="metric-big-number font-mono text-emerald">
            {account.currencySymbol}{avgDeposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="metric-footnote">Across {depositTxns.length} credit events</span>
        </div>

        <div className="ledger-metric-card glass-card">
          <div className="metric-header-row">
            <span className="metric-title">Avg. Withdrawal Size</span>
            <TrendingDown size={18} className="text-withdraw" />
          </div>
          <div className="metric-big-number font-mono text-withdraw">
            {account.currencySymbol}{avgWithdrawal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="metric-footnote">Across {withdrawTxns.length} debit events</span>
        </div>

        <div className="ledger-metric-card glass-card">
          <div className="metric-header-row">
            <span className="metric-title">Annual Simulated APY</span>
            <Sparkles size={18} className="text-cyan" />
          </div>
          <div className="metric-big-number font-mono">
            {interestApy}%
          </div>
          <span className="metric-footnote">Compound growth tier</span>
        </div>
      </div>

      {/* Middle Layout: Cashflow Distribution Bar + Savings Goal */}
      <div className="analytics-middle-grid">
        {/* Cashflow Ratio Card */}
        <div className="glass-card cashflow-ratio-card">
          <div className="card-header-styled">
            <div className="header-icon-circle">
              <Layers size={20} className="text-cyan" />
            </div>
            <div>
              <h3 className="heading-md">Cash Flow Velocity Ratio</h3>
              <p className="subheading">Proportion of lifetime deposits vs withdrawals</p>
            </div>
          </div>

          <div className="cashflow-ratio-bar-wrapper">
            <div className="ratio-bar">
              <div 
                className="ratio-fill-deposit" 
                style={{ width: `${depositPercent}%` }}
                title={`Deposits: ${depositPercent}%`}
              >
                <span>{depositPercent}% Inflow</span>
              </div>
              <div 
                className="ratio-fill-withdraw" 
                style={{ width: `${withdrawPercent}%` }}
                title={`Withdrawals: ${withdrawPercent}%`}
              >
                <span>{withdrawPercent}% Outflow</span>
              </div>
            </div>

            <div className="ratio-legend-row">
              <div className="legend-item">
                <span className="legend-dot dot-deposit"></span>
                <span>Total Inbound: <strong>{account.currencySymbol}{totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-withdraw"></span>
                <span>Total Outbound: <strong>{account.currencySymbol}{totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
              </div>
            </div>
          </div>

          {/* Category breakdown table */}
          <div className="category-breakdown-box">
            <h4 className="category-section-title">Volume by Category</h4>
            <div className="category-bars-list">
              {categoryList.slice(0, 5).map((catItem) => {
                const isDep = catItem.type === 'Deposit';
                const sharePercent = totalFlow > 0 ? Math.min(100, Math.round((catItem.total / totalFlow) * 100)) : 0;
                return (
                  <div key={catItem.name} className="cat-bar-item">
                    <div className="cat-bar-meta">
                      <span className="cat-name">{catItem.name}</span>
                      <span className={`cat-amount font-mono ${isDep ? 'text-emerald' : 'text-withdraw'}`}>
                        {isDep ? '+' : '-'}{account.currencySymbol}{catItem.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="cat-bar-track">
                      <div 
                        className={`cat-bar-fill ${isDep ? 'fill-deposit' : 'fill-withdraw'}`}
                        style={{ width: `${Math.max(5, sharePercent)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Wealth Goal Tracker */}
        <div>
          <SavingsTracker />

          {/* Simulated Yield Calculator */}
          <div className="glass-card yield-calculator-card mt-4">
            <div className="card-header-styled">
              <div className="header-icon-circle">
                <Calculator size={20} className="text-cyan" />
              </div>
              <div>
                <h3 className="heading-md">Simulated Compound Yield</h3>
                <p className="subheading">Estimated earnings on current balance ({interestApy}% APY)</p>
              </div>
            </div>

            <div className="yield-projections-grid">
              <div className="yield-box">
                <span className="yield-period">1 Month</span>
                <span className="yield-earned font-mono text-emerald">
                  +{account.currencySymbol}{projection1Mo.earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="yield-total">
                  Bal: {account.currencySymbol}{projection1Mo.futureValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="yield-box">
                <span className="yield-period">6 Months</span>
                <span className="yield-earned font-mono text-emerald">
                  +{account.currencySymbol}{projection6Mo.earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="yield-total">
                  Bal: {account.currencySymbol}{projection6Mo.futureValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="yield-box highlight">
                <span className="yield-period">1 Year</span>
                <span className="yield-earned font-mono text-emerald font-bold">
                  +{account.currencySymbol}{projection1Yr.earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="yield-total">
                  Bal: {account.currencySymbol}{projection1Yr.futureValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="yield-box">
                <span className="yield-period">3 Years</span>
                <span className="yield-earned font-mono text-emerald font-bold">
                  +{account.currencySymbol}{projection3Yr.earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="yield-total">
                  Bal: {account.currencySymbol}{projection3Yr.futureValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
