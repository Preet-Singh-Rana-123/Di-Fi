import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, MapPin, Search, ChevronDown, User, LogOut, Wallet, ShieldCheck, Phone } from 'lucide-react';

export default function Header({ onOpenAuth, onOpenWallet }) {
  const { user, logout } = useAuth();
  const [servicesOpen, setServicesOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header style={{ width: '100%', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', zIndex: 100 }}>
      
      {/* 1. Top Utility Info Bar (Exact match to Finbank screenshot) */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #F1F5F9', fontSize: '0.85rem', color: '#475569' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '8px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Left contact info */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="mailto:info@finbank.com" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', textDecoration: 'none' }}>
              <Mail size={14} color="#DC2626" />
              <span>info@example.com</span>
            </a>
            <Link to="/contact" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', textDecoration: 'none' }}>
              <MapPin size={14} color="#DC2626" />
              <span>Find Nearest Branch</span>
            </Link>
          </div>

          {/* Right quick links */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/about" style={{ color: '#475569', textDecoration: 'none' }}>Careers</Link>
            <Link to="/faq" style={{ color: '#475569', textDecoration: 'none' }}>Faq's</Link>
            <Link to="/pools" style={{ color: '#475569', textDecoration: 'none' }}>Business</Link>
            <Link to="/calculator" style={{ color: '#475569', textDecoration: 'none' }}>Rewards</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#475569' }}>
              <Search size={14} />
              <span>Search</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar with Finbank Crimson Logo Block */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', minHeight: '80px' }}>
        
        {/* Left Crimson Logo Block (Exact Match) */}
        <Link to="/" style={{ textDecoration: 'none', background: '#9B1C1C', padding: '16px 36px', display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
          {/* Emblem Icon */}
          <div style={{ width: '38px', height: '38px', background: '#FFFFFF', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '20px', height: '20px', background: '#9B1C1C', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
          </div>
          <div>
            <div className="brand-font" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              Finbank
            </div>
            <div style={{ fontSize: '0.65rem', color: '#FEE2E2', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              FOR BETTER FUTURE
            </div>
          </div>
        </Link>

        {/* Center & Right Navigation Items (React Router) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '24px' }}>
          
          {/* Home */}
          <NavLink 
            to="/" 
            end
            style={({ isActive }) => ({
              padding: '12px 18px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isActive ? '#DC2626' : '#1E293B',
              textDecoration: 'none',
              borderBottom: isActive ? '3px solid #DC2626' : '3px solid transparent'
            })}
          >
            Home
          </NavLink>

          {/* Services Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '12px 18px', fontWeight: 700, fontSize: '0.95rem', color: '#1E293B', cursor: 'pointer' }}>
              <span>Services</span>
              <ChevronDown size={16} />
            </div>

            {servicesOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, width: '200px', background: '#FFFFFF', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', border: '1px solid #E2E8F0', padding: '8px 0', zIndex: 200 }}>
                <Link to="/wallet" style={{ display: 'block', padding: '10px 20px', color: '#334155', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                  Accounts & Wallet
                </Link>
                <Link to="/ledger" style={{ display: 'block', padding: '10px 20px', color: '#334155', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                  Cards & Ledger
                </Link>
                <Link to="/loans" style={{ display: 'block', padding: '10px 20px', color: '#334155', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                  P2P Loans
                </Link>
              </div>
            )}
          </div>

          {/* Bank Pools Marketplace */}
          <NavLink 
            to="/pools" 
            style={({ isActive }) => ({
              padding: '12px 18px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isActive ? '#DC2626' : '#1E293B',
              textDecoration: 'none',
              borderBottom: isActive ? '3px solid #DC2626' : '3px solid transparent'
            })}
          >
            Bank Pools
          </NavLink>

          {/* Calculator */}
          <NavLink 
            to="/calculator" 
            style={({ isActive }) => ({
              padding: '12px 18px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isActive ? '#DC2626' : '#1E293B',
              textDecoration: 'none',
              borderBottom: isActive ? '3px solid #DC2626' : '3px solid transparent'
            })}
          >
            Yield Calculator
          </NavLink>

          {/* About */}
          <NavLink 
            to="/about" 
            style={({ isActive }) => ({
              padding: '12px 18px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isActive ? '#DC2626' : '#1E293B',
              textDecoration: 'none',
              borderBottom: isActive ? '3px solid #DC2626' : '3px solid transparent'
            })}
          >
            About
          </NavLink>

          {/* Apply Now */}
          <NavLink 
            to="/loans" 
            style={{
              padding: '12px 18px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#1E293B',
              textDecoration: 'none'
            }}
          >
            Apply Now
          </NavLink>

          {/* Get In Touch */}
          <NavLink 
            to="/contact" 
            style={{
              padding: '12px 18px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#1E293B',
              textDecoration: 'none'
            }}
          >
            Get In Touch
          </NavLink>

          {/* User Auth / Balance */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px' }}>
              <button 
                onClick={onOpenWallet} 
                className="btn-secondary" 
                style={{ padding: '8px 14px', fontSize: '0.85rem', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
              >
                <Wallet size={16} />
                ${parseFloat(user.wallet_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </button>
              <button 
                onClick={logout} 
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '6px' }}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button className="btn-crimson" onClick={onOpenAuth} style={{ marginLeft: '12px', padding: '10px 20px', fontSize: '0.9rem' }}>
              <User size={16} />
              Login / Demo
            </button>
          )}

        </nav>

      </div>

      {/* 3. Dark Crimson Announcement Ribbon Ticker */}
      <div style={{ background: '#7F1D1D', color: '#FFFFFF', padding: '8px 24px', fontSize: '0.85rem', fontWeight: 600 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#DC2626', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>📢 Updates:</span>
          <span>Get up to 18% APY on your P2P Bank Pools with Finbank.</span>
          <Link to="/pools" style={{ color: '#FEE2E2', fontWeight: 700, textDecoration: 'underline', marginLeft: '6px' }}>More Details &gt;</Link>
        </div>
      </div>

    </header>
  );
}
