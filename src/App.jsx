import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BankProvider } from './context/BankContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { Deposit } from './pages/Deposit';
import { Withdraw } from './pages/Withdraw';
import { Transactions } from './pages/Transactions';
import { Analytics } from './pages/Analytics';
import { Login } from './pages/Login';

export default function App() {
  return (
    <BankProvider>
      <BrowserRouter>
        <div className="app-container">
          {/* Reusable persistent Navbar */}
          <Navbar />

          {/* Main Route Content */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/login" element={<Login />} />
              {/* Catch-all redirect to Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Reusable persistent Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </BankProvider>
  );
}
