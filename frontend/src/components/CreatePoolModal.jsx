import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Landmark, ShieldCheck, X, Sparkles, Plus } from 'lucide-react';

export default function CreatePoolModal({ isOpen, onClose, onSuccess }) {
  const { user, showNotification } = useAuth();
  
  const [bankName, setBankName] = useState('');
  const [interestRate, setInterestRate] = useState('12.0');
  const [ownerCommissionPct, setOwnerCommissionPct] = useState('10.0');
  const [reserveRatioPct, setReserveRatioPct] = useState('20.0');
  const [initialLiquidity, setInitialLiquidity] = useState('1000');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!bankName) {
      setError('Bank name is required');
      return;
    }

    const initLiq = parseFloat(initialLiquidity);
    if (initLiq > 0 && parseFloat(user.wallet_balance) < initLiq) {
      setError(`Insufficient wallet balance for initial seed liquidity ($${initLiq.toFixed(2)} required)`);
      return;
    }

    setSubmitting(true);
    try {
      await api.bank.createPool({
        bank_name: bankName,
        interest_rate: parseFloat(interestRate),
        owner_commission_pct: parseFloat(ownerCommissionPct),
        reserve_ratio_pct: parseFloat(reserveRatioPct),
        initial_liquidity: initLiq
      });

      showNotification(`Bank Pool "${bankName}" founded successfully!`);
      await onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create bank pool');
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
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #10B981, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark size={20} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>Found a Micro-Bank Pool</h3>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Act as Banker & Manage Risk/Reward</div>
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
            <label className="form-label">Bank Pool Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Apex High-Yield Vault"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Borrower APR Interest (%)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="100"
                className="form-input"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Banker Commission Cut (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                className="form-input"
                value={ownerCommissionPct}
                onChange={(e) => setOwnerCommissionPct(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Min Reserve Ratio (%)</label>
              <input
                type="number"
                step="1"
                min="5"
                max="90"
                className="form-input"
                value={reserveRatioPct}
                onChange={(e) => setReserveRatioPct(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Seed Liquidity ($ USD)</label>
              <input
                type="number"
                step="10"
                min="0"
                className="form-input"
                value={initialLiquidity}
                onChange={(e) => setInitialLiquidity(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', margin: '12px 0 20px 0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34D399', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} />
              Banker Earnings Summary:
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.5 }}>
              You will collect <strong style={{ color: '#FBBF24' }}>{ownerCommissionPct}%</strong> of all borrower interest payments, plus your proportional LP share of the remaining <strong style={{ color: '#34D399' }}>{100 - parseFloat(ownerCommissionPct || 0)}%</strong> yield.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1, justifyContent: 'center' }}>
              {submitting ? 'Founding...' : 'Found Bank Pool'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
