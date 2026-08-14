import React from 'react';
import { Landmark, ShieldCheck, Users, TrendingUp, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px auto' }}>
        <div style={{ color: '#DC2626', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          ABOUT FINBANK DECENTRALIZED P2P
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
          Democratizing Banking for Everyone
        </h1>
        <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Finbank is a peer-to-peer fractional reserve banking platform. Rather than relying on rigid traditional financial intermediaries, Finbank allows users to become "Micro-Founding Bankers" who pool liquidity, manage risk parameters, and distribute yield automatically.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '60px' }}>
        
        <div className="card-panel" style={{ padding: '36px' }}>
          <Landmark size={32} color="#DC2626" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Micro-Founding Bankers</h3>
          <p style={{ color: '#64748B', lineHeight: 1.6 }}>
            Users can establish bank pools, configure custom interest APRs, owner commission rates, and minimum reserve ratios.
          </p>
        </div>

        <div className="card-panel" style={{ padding: '36px' }}>
          <TrendingUp size={32} color="#059669" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Proportional LP Yield</h3>
          <p style={{ color: '#64748B', lineHeight: 1.6 }}>
            Lenders pool capital into bank vaults. Every borrower installment payment is split automatically into principal replenishment and LP interest distribution.
          </p>
        </div>

        <div className="card-panel" style={{ padding: '36px' }}>
          <ShieldCheck size={32} color="#2563EB" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Atomic Solvency Guarantees</h3>
          <p style={{ color: '#64748B', lineHeight: 1.6 }}>
            Every balance transfer and loan disbursement executes inside an isolated database ACID transaction with FOR UPDATE row locks.
          </p>
        </div>

      </div>

    </div>
  );
}
