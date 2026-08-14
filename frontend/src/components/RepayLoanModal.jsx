import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ArrowRightLeft, DollarSign, ShieldCheck, X, Sparkles } from 'lucide-react';

export default function RepayLoanModal({ isOpen, loan, onClose, onSuccess }) {
  const { user, showNotification } = useAuth();
  
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !loan || !user) return null;

  const remBalance = parseFloat(loan.remaining_balance || 0);
  const monthlyEmi = parseFloat(loan.monthly_installment || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedAmt = parseFloat(amount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) {
      setError('Please enter a valid repayment amount');
      return;
    }

    if (parseFloat(user.wallet_balance) < parsedAmt) {
      setError('Insufficient wallet balance to pay loan installment');
      return;
    }

    setSubmitting(true);
    try {
      await api.loan.repayLoan(loan.id, parsedAmt);
      showNotification(`Loan repayment of $${parsedAmt.toFixed(2)} processed successfully!`);
      await onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to process loan repayment');
    } finally {
      setSubmitting(false);
    }
  };

  const setQuickAmount = (val) => {
    setAmount(val.toFixed(2));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRightLeft size={20} color="#34D399" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>Repay Loan Installment</h3>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Loan #{loan.id} ({loan.bank_name})</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Loan Balance Quick Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>REMAINING BALANCE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>${remBalance.toFixed(2)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>STANDARD MONTHLY EMI</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34D399' }}>${monthlyEmi.toFixed(2)}</div>
          </div>
        </div>

        {/* Quick Amount Selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => setQuickAmount(monthlyEmi)}
            style={{ flex: 1, padding: '6px', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            Pay EMI (${monthlyEmi.toFixed(2)})
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => setQuickAmount(remBalance)}
            style={{ flex: 1, padding: '6px', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            Full Pay (${remBalance.toFixed(2)})
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Payment Amount ($ USD)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={remBalance}
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748B', margin: '16px 0 20px 0' }}>
            <ShieldCheck size={14} color="#34D399" />
            <span>Interest yield will automatically distribute to bank owner & LP contributors</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1, justifyContent: 'center' }}>
              {submitting ? 'Processing...' : 'Confirm Repayment'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
