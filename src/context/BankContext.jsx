import React, { createContext, useContext, useState, useEffect } from 'react';

const BankContext = createContext();

const INITIAL_ACCOUNT = {
  bankName: 'CyanTrust Bank',
  applicationTitle: 'CyanTrust Digital Wealth & Asset Management',
  holderName: 'Evelyn Reed',
  accountNumber: 'CYAN-8492-9014',
  accountType: 'Pastel Premier Vault Account',
  routingNumber: '021000894',
  memberSince: 'October 2023',
  currency: 'USD',
  currencySymbol: '$',
  email: 'evelyn.reed@cyantrust.io',
};

const INITIAL_BALANCE = 8450.00;

const INITIAL_TRANSACTIONS = [
  {
    id: 'txn_101',
    type: 'Deposit',
    amount: 3200.00,
    date: 'Oct 24, 2026',
    time: '09:30 AM',
    timestamp: 1792828800000,
    category: 'Direct Deposit / Salary',
    note: 'Bi-weekly tech payroll remittance',
    reference: 'REF-PAY8921'
  },
  {
    id: 'txn_102',
    type: 'Withdrawal',
    amount: 450.00,
    date: 'Oct 25, 2026',
    time: '02:15 PM',
    timestamp: 1792915200000,
    category: 'Bills & Utilities',
    note: 'Cloud server hosting & renewable power',
    reference: 'REF-BIL4402'
  },
  {
    id: 'txn_103',
    type: 'Deposit',
    amount: 1200.00,
    date: 'Oct 26, 2026',
    time: '11:45 AM',
    timestamp: 1793001600000,
    category: 'Investment Return',
    note: 'Clean Tech Index quarterly dividend payout',
    reference: 'REF-DIV7719'
  },
  {
    id: 'txn_104',
    type: 'Withdrawal',
    amount: 185.50,
    date: 'Oct 27, 2026',
    time: '07:20 PM',
    timestamp: 1793088000000,
    category: 'Dining & Lifestyle',
    note: 'Artisan bistro dinner with partners',
    reference: 'REF-POS1183'
  },
  {
    id: 'txn_105',
    type: 'Withdrawal',
    amount: 60.00,
    date: 'Oct 28, 2026',
    time: '04:10 PM',
    timestamp: 1793174400000,
    category: 'Subscription',
    note: 'Productivity suite & cloud storage',
    reference: 'REF-SUB3390'
  }
];

const INITIAL_SAVINGS_GOAL = {
  title: 'Nordic Architecture Retreat',
  targetAmount: 12000.00,
  targetDate: 'Dec 2026'
};

export const BankProvider = ({ children }) => {
  // Authentication state (persisted in localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem('cyantrust_auth');
      return savedAuth !== null ? JSON.parse(savedAuth) : true;
    } catch {
      return true;
    }
  });

  // Account details with localStorage fallback
  const [account, setAccount] = useState(() => {
    try {
      const saved = localStorage.getItem('cyantrust_account');
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNT;
    } catch {
      return INITIAL_ACCOUNT;
    }
  });

  // Current balance with localStorage fallback
  const [balance, setBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('cyantrust_balance');
      return saved !== null ? Number(JSON.parse(saved)) : INITIAL_BALANCE;
    } catch {
      return INITIAL_BALANCE;
    }
  });

  // Transactions list with localStorage fallback
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('cyantrust_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Savings Goal
  const [savingsGoal, setSavingsGoal] = useState(() => {
    try {
      const saved = localStorage.getItem('cyantrust_savings_goal');
      return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOAL;
    } catch {
      return INITIAL_SAVINGS_GOAL;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('cyantrust_auth', JSON.stringify(isAuthenticated));
      localStorage.setItem('cyantrust_account', JSON.stringify(account));
      localStorage.setItem('cyantrust_balance', JSON.stringify(balance));
      localStorage.setItem('cyantrust_transactions', JSON.stringify(transactions));
      localStorage.setItem('cyantrust_savings_goal', JSON.stringify(savingsGoal));
    } catch (e) {
      console.warn('Could not persist to localStorage:', e);
    }
  }, [isAuthenticated, account, balance, transactions, savingsGoal]);

  // Derived calculations: Total Deposited and Total Withdrawn
  const totalDeposited = transactions
    .filter(t => t.type === 'Deposit')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalWithdrawn = transactions
    .filter(t => t.type === 'Withdrawal')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  // Authentication Handlers
  const loginUser = (holderName = 'Evelyn Reed', accountNumber = 'CYAN-8492-9014') => {
    setIsAuthenticated(true);
    if (holderName && holderName.trim() !== '') {
      setAccount(prev => ({
        ...prev,
        holderName: holderName.trim(),
        accountNumber: accountNumber.trim() || prev.accountNumber
      }));
    }
    return { success: true, message: `Welcome back, ${holderName}!` };
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
  };

  // Deposit handler
  const depositMoney = (amount, category = 'General Deposit', note = '') => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return { success: false, message: 'Please enter a valid amount greater than zero.' };
    }

    const newBalance = Number((balance + numAmount).toFixed(2));
    const now = new Date();
    const newTxn = {
      id: 'txn_' + Date.now(),
      type: 'Deposit',
      amount: numAmount,
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      category: category.trim() || 'General Deposit',
      note: note.trim() || 'Account funds deposit',
      reference: 'DEP-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    };

    setBalance(newBalance);
    setTransactions(prev => [newTxn, ...prev]);

    return {
      success: true,
      message: `Deposit of ${account.currencySymbol}${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} was successful!`,
      transaction: newTxn
    };
  };

  // Withdraw handler
  const withdrawMoney = (amount, category = 'General Withdrawal', note = '') => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return { success: false, message: 'Please enter a valid amount greater than zero.' };
    }

    if (numAmount > balance) {
      return {
        success: false,
        message: `Insufficient funds! Withdrawal amount (${account.currencySymbol}${numAmount.toFixed(2)}) exceeds your available balance (${account.currencySymbol}${balance.toFixed(2)}).`
      };
    }

    const newBalance = Number((balance - numAmount).toFixed(2));
    const now = new Date();
    const newTxn = {
      id: 'txn_' + Date.now(),
      type: 'Withdrawal',
      amount: numAmount,
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      category: category.trim() || 'General Withdrawal',
      note: note.trim() || 'Account cash withdrawal',
      reference: 'WTH-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    };

    setBalance(newBalance);
    setTransactions(prev => [newTxn, ...prev]);

    return {
      success: true,
      message: `Withdrawal of ${account.currencySymbol}${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} was processed successfully!`,
      transaction: newTxn
    };
  };

  // Reset to default demo data
  const resetDemoData = () => {
    setAccount(INITIAL_ACCOUNT);
    setBalance(INITIAL_BALANCE);
    setTransactions(INITIAL_TRANSACTIONS);
    setSavingsGoal(INITIAL_SAVINGS_GOAL);
    setIsAuthenticated(true);
    localStorage.removeItem('cyantrust_account');
    localStorage.removeItem('cyantrust_balance');
    localStorage.removeItem('cyantrust_transactions');
    localStorage.removeItem('cyantrust_savings_goal');
    localStorage.setItem('cyantrust_auth', JSON.stringify(true));
  };

  // Export transactions as CSV
  const exportTransactionsCSV = () => {
    if (transactions.length === 0) return false;
    const headers = ['Transaction ID', 'Type', 'Amount (USD)', 'Date', 'Time', 'Category', 'Reference', 'Note'];
    const rows = transactions.map(t => [
      `"${t.id}"`,
      `"${t.type}"`,
      t.amount.toFixed(2),
      `"${t.date}"`,
      `"${t.time}"`,
      `"${t.category}"`,
      `"${t.reference}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cyantrust_statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  };

  return (
    <BankContext.Provider
      value={{
        account,
        balance,
        transactions,
        totalDeposited,
        totalWithdrawn,
        savingsGoal,
        isAuthenticated,
        loginUser,
        logoutUser,
        setSavingsGoal,
        depositMoney,
        withdrawMoney,
        resetDemoData,
        exportTransactionsCSV
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
