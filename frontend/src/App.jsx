import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';

import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import PoolsPage from './pages/PoolsPage';
import LoansPage from './pages/LoansPage';
import WalletPage from './pages/WalletPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import YieldCalculator from './components/YieldCalculator';

// Modals
import AuthModal from './components/AuthModal';
import WalletModal from './components/WalletModal';
import CreatePoolModal from './components/CreatePoolModal';
import ContributeModal from './components/ContributeModal';
import ApplyLoanModal from './components/ApplyLoanModal';
import RepayLoanModal from './components/RepayLoanModal';

import { CheckCircle } from 'lucide-react';

function AppContent() {
  const { user, notification, refreshUser } = useAuth();

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [createPoolModalOpen, setCreatePoolModalOpen] = useState(false);
  
  const [selectedPoolForDeposit, setSelectedPoolForDeposit] = useState(null);
  const [selectedPoolForLoan, setSelectedPoolForLoan] = useState(null);
  const [selectedLoanForRepay, setSelectedLoanForRepay] = useState(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2000,
          background: notification.type === 'error' ? '#DC2626' : '#059669',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={18} />
          {notification.message}
        </div>
      )}

      {/* Finbank Header with Navigation */}
      <Header
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenWallet={() => user ? setWalletModalOpen(true) : setAuthModalOpen(true)}
      />

      {/* Main Multipage Routes Container */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenCreatePool={() => setCreatePoolModalOpen(true)}
                onOpenDeposit={(pool) => setSelectedPoolForDeposit(pool)}
                onOpenLoan={(pool) => setSelectedPoolForLoan(pool)}
              />
            } 
          />
          
          <Route 
            path="/pools" 
            element={
              <PoolsPage
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenCreatePool={() => setCreatePoolModalOpen(true)}
                onOpenDeposit={(pool) => setSelectedPoolForDeposit(pool)}
                onOpenLoan={(pool) => setSelectedPoolForLoan(pool)}
              />
            } 
          />

          <Route 
            path="/loans" 
            element={
              <LoansPage
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenRepay={(loan) => setSelectedLoanForRepay(loan)}
              />
            } 
          />

          <Route 
            path="/wallet" 
            element={
              <WalletPage
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenWalletModal={() => setWalletModalOpen(true)}
              />
            } 
          />

          <Route 
            path="/ledger" 
            element={
              <WalletPage
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenWalletModal={() => setWalletModalOpen(true)}
              />
            } 
          />

          <Route 
            path="/calculator" 
            element={
              <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
                <YieldCalculator />
              </div>
            } 
          />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Routes>
      </main>

      {/* Finbank Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} onRefresh={refreshUser} />
      <CreatePoolModal isOpen={createPoolModalOpen} onClose={() => setCreatePoolModalOpen(false)} onSuccess={() => refreshUser()} />
      <ContributeModal isOpen={!!selectedPoolForDeposit} pool={selectedPoolForDeposit} onClose={() => setSelectedPoolForDeposit(null)} onSuccess={() => refreshUser()} />
      <ApplyLoanModal isOpen={!!selectedPoolForLoan} pool={selectedPoolForLoan} onClose={() => setSelectedPoolForLoan(null)} onSuccess={() => refreshUser()} />
      <RepayLoanModal isOpen={!!selectedLoanForRepay} loan={selectedLoanForRepay} onClose={() => setSelectedLoanForRepay(null)} onSuccess={() => refreshUser()} />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
