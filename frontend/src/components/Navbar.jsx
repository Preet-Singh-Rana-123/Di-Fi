import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, Landmark, ArrowRightLeft, User, LogOut, ShieldCheck, Plus, Sparkles, Layers } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth, onOpenWallet, onOpenCreatePool }) {
  const { user, logout } = useAuth();

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('overview')}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #10B981, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
              <Landmark size={24} color="#FFFFFF" />
            </div>
            <div>
              <div className="brand-font" style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #FFFFFF, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                DiFi<span style={{ color: '#10B981', WebkitTextFillColor: '#10B981' }}>Bank</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.5px' }}>
                P2P FRACTIONAL BANKING
              </div>
            </div>
          </div>

          <div className="badge badge-emerald" style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div className="pulse-dot"></div>
            <span>ACID Engine Active</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {[
            { id: 'overview', label: 'Overview', icon: Landmark },
            { id: 'pools', label: 'Bank Pools', icon: BuildingIcon },
            { id: 'loans', label: 'P2P Loans', icon: ArrowRightLeft },
            { id: 'ledger', label: 'Wallet & Ledger', icon: Wallet },
            { id: 'calculator', label: 'Yield Calculator', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))' : 'transparent',
                  border: isActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                  color: isActive ? '#34D399' : '#94A3B8',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User / Wallet Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              {/* Wallet Balance Widget */}
              <div
                onClick={onOpenWallet}
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s'
                }}
              >
                <Wallet size={18} color="#34D399" />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>WALLET BALANCE</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC' }}>
                    ${parseFloat(user.wallet_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Create Pool Quick CTA */}
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={onOpenCreatePool}>
                <Plus size={16} />
                Found Bank Pool
              </button>

              {/* User Profile & Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC' }}>{user.username}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{user.email}</div>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#F87171',
                    padding: '8px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <button className="btn-primary" onClick={onOpenAuth}>
              <User size={18} />
              Login / Demo Account
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

function BuildingIcon(props) {
  return <Landmark {...props} />;
}
