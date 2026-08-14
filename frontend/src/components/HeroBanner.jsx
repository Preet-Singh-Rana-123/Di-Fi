import React from 'react';
import { Landmark, ShieldCheck, TrendingUp, Users, ArrowRight, Percent, Sparkles, Plus } from 'lucide-react';

export default function HeroBanner({ onFoundPool, onExplorePools, onRequestLoan }) {
  return (
    <div className="glass-panel glass-panel-glow" style={{ padding: '40px 48px', marginBottom: '32px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(11, 19, 43, 0.95))' }}>
      
      {/* Background Ambient Glow */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '20%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'center' }}>
        
        {/* Left Pitch & CTA */}
        <div>
          <div className="badge badge-gold" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} />
            <span>Decentralized Micro-Banking Protocol</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px', color: '#F8FAFC' }}>
            Become a <span style={{ background: 'linear-gradient(90deg, #10B981, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Micro-Founding Banker</span> & Pool Liquidity
          </h1>

          <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Transform peer-to-peer lending into fractional banking pools. Micro-bankers set interest rates, reserve ratios, and commission cuts while micro-lenders earn proportional yield backed by automated database ACID guarantees.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onFoundPool} style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              <Plus size={18} />
              Found a Bank Pool
            </button>
            <button className="btn-secondary" onClick={onExplorePools} style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              <Landmark size={18} />
              Explore Marketplace
            </button>
            <button className="btn-outline-gold" onClick={onRequestLoan} style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              <ArrowRight size={18} />
              Request P2P Loan
            </button>
          </div>
        </div>

        {/* Right Live Platform Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#34D399', marginBottom: '8px' }}>
              <ShieldCheck size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>ACID GUARANTEE</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>100% Atomic</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Row-locked isolation</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60A5FA', marginBottom: '8px' }}>
              <TrendingUp size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>AVG POOL APY</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>12.5% - 18%</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Proportional LP yield</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FBBF24', marginBottom: '8px' }}>
              <Percent size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>RESERVE RATIO</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>20.00% Min</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Fractional solvency rule</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#C084FC', marginBottom: '8px' }}>
              <Users size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>LENDER SHARES</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>Multi-Pooled</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Automated monthly payouts</div>
          </div>

        </div>

      </div>
    </div>
  );
}
