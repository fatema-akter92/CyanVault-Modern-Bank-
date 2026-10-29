## CyanVault — Modern Bank Management System

Built with **React 19**, **Vite**, **React Router DOM**, styled in an **off-white & pastel cyan** palette.

---
###  Visit Livelink : https://cyan-vault-modern-bank.vercel.app/

----

### 📌 Project Overview
**CyanVault** is a modern frontend bank management system featuring real-time deposits, secure withdrawals with authorization, full transaction ledger tracking, interactive 3D virtual cards, and financial analytics.

---

### 🚀 Key Features

* **Live Dashboard**: Displays account holder info, account number, real-time balance (with privacy toggle), and total deposit/withdrawal metrics.
* **Instant Deposit**: Real-time balance updates with preset chips (`+$50`, `+$100`, `+$500`), positive amount validation, and confetti alerts.
* **Secure Withdrawal**: Input validation preventing overdrafts/negative sums, live remaining balance calculation, and a **2-Step Confirmation Modal**.
* **Transaction Ledger**: Full history rendered via `.map()` with distinct pastel styles for deposits and withdrawals, plus real-time search & filters.
* **Login Portal (`/login`)**: Secure user authentication with **1-Click Demo Login** and sign-out functionality.
* **3D Virtual Platinum Card**: Interactive card with 3D flip animation, EMV chip, CVV code, and one-click card number copy.
* **Analytics & APY Calculator**: Cashflow ratio breakdown, category spending volume, and compound savings yield projections.
* **Savings Goal Tracker**: Visual milestone progress bar with quick boost deposit options.
* **LocalStorage Persistence**: Balances and transaction history are automatically saved across browser refreshes.
* **CSV Statement Export**: Download full financial records in `.csv` format with one click.

---

### 🛠️ Tech Stack & Reusable Components
* **Framework**: React 19 + Vite
* **Routing**: React Router DOM (`/`, `/deposit`, `/withdraw`, `/transactions`, `/analytics`, `/login`)
* **State Management**: React Context API (`BankContext.jsx`)
* **Icons & Animation**: Lucide React + Canvas Confetti
* **Key Components**: `Navbar`, `BalanceCard`, `DepositForm`, `WithdrawForm`, `ConfirmationModal`, `TransactionList`, `TransactionItem`, `VirtualCard`, `SavingsTracker`, `Footer`

---

### ⚠️ Disclaimer
*This is an educational frontend demonstration project. All account balances and transactions are simulated.*

**Designed by Fatema (CyanVault)**
