import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ArrowRightLeft, Calculator, ShieldCheck, X, Sparkles } from 'lucide-react';

export default function ApplyLoanModal({ isOpen, pool, onClose, onSuccess }) {
  const { user, showNotification } = useAuth();
  
  const [principalAmount, setPrincipalAmount] = useState('5000');
  const [termMonths, setTermMonths] = useState('12');
  const [purpose, setPurpose] = useState('Business Expansion');
  
  const [emi, setEmi] = useState(0);
  const [totalRepayable, setTotalRepayable] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Calculate live EMI
  useEffect(() => {
    if (!pool) return;
    const p = parseFloat(principalAmount) || 0;
    const rate = parseFloat(pool.interest_rate) || 0;
    const n = parseInt(termMonths, 10) || 12;

    if (p <= 0 || n <= 0) {
      setEmi(0);
      setTotalRepayable(0);
      return;
    }

    const r = (rate / 100) / 12;
    let computedEmi = 0;
    if (r === 0) {
      computedEmi = p / n;
    } else {
      computedEmi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }

    const roundedEmi = Math.round(computedEmi * 100) / 100;
    setEmi(roundedEmi);
    setTotalRepayable(Math.round((roundedEmi * n) * 100) / 100);
  }, [principalAmount, termMonths, pool]);

  if (!isOpen || !pool || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const principal = parseFloat(principalAmount);
    const term = parseInt(termMonths, 10);
    const avail = parseFloat(pool.available_liquidity || 0);

    if (isNaN(principal) || principal <= 0) {
      setError('Please enter a valid principal amount');
      return;
    }

    if (principal > avail) {
      setError(`Requested amount ($${principal.toFixed(2)}) exceeds pool available liquidity ($${avail.toFixed(2)})`);
      return;
    }

    setSubmitting(true);
    try {
      await api.loan.requestLoan(pool.id, principal, term, purpose);
      showNotification(`Loan application for $${principal.toFixed(2)} submitted successfully!`);
      await onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit loan request');
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
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRightLeft size={20} color="#FBBF24" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>Apply for P2P Loan</h3>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Pool: <strong>{pool.bank_name}</strong> ({pool.interest_rate}% APR)</div>
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

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Principal Amount ($ USD)</label>
            <input
              type="number"
              step="100"
              min="100"
              className="form-input"
              value={principalAmount}
              onChange={(e) => setPrincipalAmount(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Term Length (Months)</label>
              <select
                className="form-select"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
              >
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Loan Purpose</label>
              <input
                type="text"
                className="form-input"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              />
            </div>
          </div>

          {/* EMI Amortization Live Calculation Panel */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '14px', padding: '16px', margin: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24', fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>
              <Calculator size={16} />
              Real-time Amortization Preview
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>MONTHLY EMI</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399' }}>${emi.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>TOTAL REPAYABLE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC' }}>${totalRepayable.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1, justifyContent: 'center' }}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
