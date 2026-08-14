import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import BankPoolCard from '../components/BankPoolCard';
import { Landmark, ShieldCheck, TrendingUp, Users, ArrowRight, Percent, Sparkles, Plus, CheckCircle, CreditCard, ChevronRight } from 'lucide-react';

export default function HomePage({ onOpenAuth, onOpenCreatePool, onOpenDeposit, onOpenLoan }) {
  const { user } = useAuth();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const data = await api.bank.getAllPools();
        setPools(data.pools || []);
      } catch (err) {
        console.error('Failed to load pools:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPools();
  }, []);

  return (
    <div>
      
      {/* 1. Hero Section (Inspired by Finbank corporate homepage in screenshot) */}
      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', padding: '64px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Text Pitch */}
          <div>
            <div className="badge badge-crimson" style={{ background: 'rgba(220, 38, 38, 0.2)', color: '#F87171', borderColor: 'rgba(220, 38, 38, 0.4)', marginBottom: '16px', fontSize: '0.85rem' }}>
              <Sparkles size={14} />
              Decentralized Micro-Banking & Fractional Reserve Protocol
            </div>

            <h1 className="brand-font" style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px', color: '#FFFFFF' }}>
              Banking Built For <span style={{ color: '#DC2626' }}>A Better Future</span>
            </h1>

            <p style={{ color: '#CBD5E1', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '32px', maxWidth: '600px' }}>
              Empowering micro-founding bankers to pool capital, manage risk/reward metrics, and disburse P2P loans backed by atomic database ACID transactions and automated yield distribution.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                className="btn-crimson" 
                onClick={() => user ? onOpenCreatePool() : onOpenAuth()}
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                <Plus size={18} /> Found a Bank Pool
              </button>

              <Link 
                to="/pools" 
                className="btn-secondary" 
                style={{ padding: '14px 28px', fontSize: '1rem', background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.2)' }}
              >
                <Landmark size={18} /> Explore Marketplace
              </Link>

              <Link 
                to="/loans" 
                className="btn-outline-crimson" 
                style={{ padding: '14px 28px', fontSize: '1rem', color: '#FFFFFF', borderColor: '#FFFFFF' }}
              >
                <ArrowRight size={18} /> Apply for Loan
              </Link>
            </div>
          </div>

          {/* Right Visual Stats Card (Matching Credit Card visual in screenshot) */}
          <div style={{ position: 'relative' }}>
            
            {/* Finbank Credit Card Mockup Visual */}
            <div style={{ background: 'linear-gradient(135deg, #DC2626 0%, #9B1C1C 100%)', borderRadius: '20px', padding: '32px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)', color: '#FFFFFF', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 700 }}>FINBANK PLATFORM CARD</div>
                  <div className="brand-font" style={{ fontSize: '1.4rem', fontWeight: 800 }}>Fractional Vault Share</div>
                </div>
                <CreditCard size={32} color="#FFFFFF" />
              </div>

              <div style={{ fontSize: '1.3rem', letterSpacing: '3px', fontWeight: 700, marginBottom: '24px' }}>
                4820 •••• •••• 9102
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>CARD HOLDER</div>
                  <div style={{ fontWeight: 700 }}>{user ? user.username : 'ALICE BANKER'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>AVG POOL YIELD</div>
                  <div style={{ fontWeight: 800, color: '#FEF08A' }}>14.5% APY</div>
                </div>
              </div>
            </div>

            {/* Quick Stat Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '16px', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>ACID ENGINE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399' }}>100% Solvency</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '16px', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>RESERVE RATIO</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FBBF24' }}>20.0% Minimum</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. Platform Feature Cards Section */}
      <section style={{ padding: '64px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ color: '#DC2626', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
            WHY CHOOSE FINBANK P2P
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A' }}>
            Revolutionizing Peer-to-Peer Fractional Banking
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          <div className="card-panel" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--crimson-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Landmark size={24} color="#DC2626" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>Micro-Founding Bankers</h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Found your own bank pool, set interest APRs, owner commission cuts, and manage reserve parameters for your depositors.
            </p>
          </div>

          <div className="card-panel" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <TrendingUp size={24} color="#059669" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>Proportional LP Yield</h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Micro-lenders pool funds together to earn automated interest yield split proportionally on every borrower repayment.
            </p>
          </div>

          <div className="card-panel" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <ShieldCheck size={24} color="#2563EB" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>Strict ACID Transactions</h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Built on PostgreSQL database transactions with row-level locks to prevent double-spending and guarantee solvency.
            </p>
          </div>

        </div>

      </section>

      {/* 3. Featured Bank Pools Preview */}
      <section style={{ background: '#F1F5F9', padding: '64px 24px', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>Active Micro-Bank Vaults</h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Deposit liquidity or request a P2P loan from active bank pools</p>
            </div>
            <Link to="/pools" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>View All Pools</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>Loading Bank Pools...</div>
          ) : pools.length === 0 ? (
            <div className="card-panel" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
              No active bank pools yet. Click "Found a Bank Pool" to create the first pool!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {pools.slice(0, 3).map((pool) => (
                <BankPoolCard
                  key={pool.id}
                  pool={pool}
                  onDeposit={(p) => user ? onOpenDeposit(p) : onOpenAuth()}
                  onRequestLoan={(p) => user ? onOpenLoan(p) : onOpenAuth()}
                />
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
