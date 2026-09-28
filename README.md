# 🏦 Core-Bank: Next.js Mock Banking System

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)

Core-Bank is a modern, responsive, and highly secure mock core banking web application built with **Next.js 14**, **TailwindCSS**, and **TypeScript**. It features a stunning glassmorphism UI, a dynamic virtual debit card, and fully functional simulated banking operations.

## ✨ Features

- 💳 **Dynamic Virtual Debit Card**: A beautiful, fully responsive virtual card that updates instantly based on your selected bank (BCA, Mandiri, BRI, BNI, BSI, OCBC, etc.).
- 💰 **Real-time Balance & Deposits**: Deposit funds and watch your total balance update in real-time.
- 🔄 **Transfers & Remittance**: Simulate intra-bank transfers and inter-bank remittance with detailed animated transaction receipts.
- 📱 **Mobile-First Responsive Design**: The UI gracefully degrades into a native-like bottom navigation bar on mobile devices, ensuring perfect layout scaling across all screen sizes.
- 🔒 **Enterprise-Grade Security (OWASP Top 10 Mitigated)**:
  - **Anti-SQLi & IDOR**: Strict equality data checks and encrypted `httpOnly` sessions prevent logic bypasses and unauthorized data access.
  - **Anti-Brute Force**: In-memory rate limiting and account lockout mechanism (max 5 attempts, locks for 15 minutes).
  - **Anti-XSS & Sensitive Data Exposure**: Comprehensive Next.js Middleware implementing strict CSP (Content Security Policy), HSTS, and XSS Protection headers.
  - **DDoS Mitigation Ready**: Middleware structure prepared for edge-level IP tracking and rate-limiting.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Alvinhidayatullah/core-bank.git
   cd core-bank
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Default Credentials
To access the system, use the hardcoded/patented admin credentials:
- **Account Number / Username**: `admin`
- **Password**: `bank`

## 🛠️ Technology Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: Lucide React / Custom SVGs
- **Database**: Local JSON File Simulation (`data/db.json`)

## 📄 License
This project is for educational and simulation purposes.
