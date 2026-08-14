import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Wallet, ArrowDownRight, ArrowUpRight, Send, X, ShieldCheck } from 'lucide-react';

export default function WalletModal({ isOpen, onClose, onRefresh }) {
  const { user, showNotification } = useAuth();
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' | 'withdraw' | 'transfer'
  
  const [amount, setAmount] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const parsedAmt = parseFloat(amount);
    
    if (isNaN(parsedAmt) || parsedAmt <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    setSubmitting(true);
    try {
      if (activeTab === 'deposit') {
        await api.wallet.deposit(parsedAmt);
        showNotification(`Successfully deposited $${parsedAmt.toFixed(2)} to wallet!`);
      } else if (activeTab === 'withdraw') {
        await api.wallet.withdraw(parsedAmt);
        showNotification(`Successfully withdrew $${parsedAmt.toFixed(2)} from wallet!`);
      } else if (activeTab === 'transfer') {
        if (!receiverEmail) {
          throw new Error('Receiver email is required');
        }
        await api.wallet.transfer(receiverEmail, parsedAmt);
        showNotification(`Transferred $${parsedAmt.toFixed(2)} to ${receiverEmail}`);
      }

      setAmount('');
      setReceiverEmail('');
      await onRefresh();
      onClose();
    } catch (err) {
      setError(err.message || 'Transaction failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={20} color="#34D399" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>Wallet Actions</h3>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Current Balance: ${parseFloat(user.wallet_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {[
            { id: 'deposit', label: 'Deposit', icon: ArrowDownRight },
            { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight },
            { id: 'transfer', label: 'P2P Transfer', icon: Send }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(''); }}
                style={{
                  background: isActive ? 'linear-gradient(135deg, #10B981, #059669)' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {activeTab === 'transfer' && (
            <div className="form-group">
              <label className="form-label">Receiver Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. bob@difi.org"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Amount ($ USD)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="form-input"
              placeholder="e.g. 500.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748B', margin: '16px 0 20px 0' }}>
            <ShieldCheck size={14} color="#34D399" />
            <span>Executed inside atomic database transaction block (ACID compliant)</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1, justifyContent: 'center' }}>
              {submitting ? 'Processing...' : activeTab === 'deposit' ? 'Confirm Deposit' : activeTab === 'withdraw' ? 'Confirm Withdrawal' : 'Transfer Funds'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
