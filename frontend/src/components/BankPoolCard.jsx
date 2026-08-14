import React from 'react';
import { Landmark, Percent, ShieldCheck, Users, ArrowRight, Plus, DollarSign } from 'lucide-react';

export default function BankPoolCard({ pool, onDeposit, onRequestLoan, onViewDetail }) {
  const totalLiq = parseFloat(pool.total_liquidity || 0);
  const availLiq = parseFloat(pool.available_liquidity || 0);
  const activeLoansVal = totalLiq - availLiq;
  const utilizationPct = totalLiq > 0 ? Math.round((activeLoansVal / totalLiq) * 100) : 0;

  return (
    <div className="glass-panel glass-panel-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark size={20} color="#34D399" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC' }}>{pool.bank_name}</h3>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Banker: <span style={{ color: '#94A3B8', fontWeight: 600 }}>{pool.owner_username || `User #${pool.owner_id}`}</span>
              </div>
            </div>
          </div>

          <div className="badge badge-emerald" style={{ fontSize: '0.85rem', fontWeight: 700, padding: '6px 12px' }}>
            {pool.interest_rate}% APR
          </div>
        </div>

        {/* Risk & Reward Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '16px 0', background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>COMMISSION CUT</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FBBF24' }}>
              {pool.owner_commission_pct}% Yield
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>RESERVE RATIO</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#60A5FA' }}>
              {pool.reserve_ratio_pct}% Min
            </div>
          </div>
        </div>

        {/* Liquidity Progress Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '6px' }}>
            <span>Available Liquidity</span>
            <span style={{ fontWeight: 700, color: '#34D399' }}>${availLiq.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${Math.min(100, (availLiq / (totalLiq || 1)) * 100)}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #10B981, #06B6D4)',
                borderRadius: '4px',
                transition: 'width 0.5s ease'
              }} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '6px' }}>
            <span>Total Liquidity: ${totalLiq.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span>{utilizationPct}% Loaned Out</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <button 
          className="btn-primary" 
          onClick={() => onDeposit(pool)}
          style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem', justifyContent: 'center' }}
        >
          <Plus size={14} />
          Deposit LP
        </button>

        <button 
          className="btn-secondary" 
          onClick={() => onRequestLoan(pool)}
          style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem', justifyContent: 'center' }}
        >
          <ArrowRight size={14} />
          Borrow
        </button>
      </div>

    </div>
  );
}
