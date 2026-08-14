import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Plus, Minus, Landmark, X, ShieldCheck } from 'lucide-react';

export default function ContributeModal({ isOpen, pool, onClose, onSuccess }) {
  const { user, showNotification } = useAuth();
  const [mode, setMode] = useState('deposit'); // 'deposit' | 'withdraw'
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !pool || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const parsedAmt = parseFloat(amount);

    if (isNaN(parsedAmt) || parsedAmt <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (mode === 'deposit' && parseFloat(user.wallet_balance) < parsedAmt) {
      setError('Insufficient wallet balance to deposit liquidity');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'deposit') {
        await api.bank.depositLiquidity(pool.id, parsedAmt);
        showNotification(`Deposited $${parsedAmt.toFixed(2)} liquidity into ${pool.bank_name}`);
      } else {
        await api.bank.withdrawLiquidity(pool.id, parsedAmt);
        showNotification(`Withdrew $${parsedAmt.toFixed(2)} liquidity from ${pool.bank_name}`);
      }

      await onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Liquidity operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark size={20} color="#34D399" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>{pool.bank_name}</h3>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Interest APR: <strong style={{ color: '#34D399' }}>{pool.interest_rate}%</strong> | Available: ${parseFloat(pool.available_liquidity || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Mode switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            type="button"
            onClick={() => setMode('deposit')}
            style={{
              background: mode === 'deposit' ? 'linear-gradient(135deg, #10B981, #059669)' : 'transparent',
              color: mode === 'deposit' ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Plus size={14} /> Deposit Liquidity
          </button>

          <button
            type="button"
            onClick={() => setMode('withdraw')}
            style={{
              background: mode === 'withdraw' ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)' : 'transparent',
              color: mode === 'withdraw' ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Minus size={14} /> Withdraw Share
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Liquidity Amount ($ USD)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              className="form-input"
              placeholder="e.g. 1000.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1, justifyContent: 'center' }}>
              {submitting ? 'Processing...' : mode === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
