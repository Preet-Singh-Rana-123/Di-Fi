import React from 'react';
import { useAuth } from '../context/AuthContext';
import TransactionLedger from '../components/TransactionLedger';
import { Wallet, ArrowDownRight, ArrowUpRight, Send, ShieldCheck } from 'lucide-react';

export default function WalletPage({ onOpenAuth, onOpenWalletModal }) {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>Accounts & Wallet Ledger</h1>
        <p style={{ color: '#64748B', fontSize: '1rem' }}>
          Manage your wallet balance, make instant P2P transfers, and view audit history.
        </p>
      </div>

      {!user ? (
        <div className="card-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Authentication Required</h3>
          <p style={{ color: '#64748B', marginBottom: '20px' }}>Please log in to view your wallet balance and transactions.</p>
          <button className="btn-crimson" onClick={onOpenAuth}>
            Login / Demo Account
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Balance & Actions Bar */}
          <div className="card-panel" style={{ padding: '32px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)', border: '1px solid #CBD5E1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
              
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Available Wallet Balance</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>
                  ${parseFloat(user.wallet_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <ShieldCheck size={16} />
                  <span>Backed by PostgreSQL ACID Row-Lock Engine</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button className="btn-crimson" onClick={onOpenWalletModal}>
                  <ArrowDownRight size={18} /> Deposit / Top Up
                </button>
                <button className="btn-secondary" onClick={onOpenWalletModal}>
                  <ArrowUpRight size={18} /> Withdraw
                </button>
                <button className="btn-outline-crimson" onClick={onOpenWalletModal}>
                  <Send size={18} /> Direct P2P Transfer
                </button>
              </div>

            </div>
          </div>

          {/* Transaction Ledger Component */}
          <TransactionLedger />

        </div>
      )}

    </div>
  );
}
