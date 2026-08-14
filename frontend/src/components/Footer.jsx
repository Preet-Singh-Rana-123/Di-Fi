import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Mail, MapPin, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#0F172A', color: '#F8FAFC', paddingTop: '60px', paddingBottom: '30px', borderTop: '4px solid #DC2626' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
          {/* Col 1: Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: '#DC2626', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Landmark size={20} color="#FFFFFF" />
              </div>
              <div className="brand-font" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
                Finbank
              </div>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Decentralized Peer-to-Peer Fractional Reserve Banking platform allowing micro-founding bankers to pool capital, manage risk/reward metrics, and earn transparent yield.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontSize: '0.82rem', fontWeight: 700 }}>
              <ShieldCheck size={16} />
              <span>ACID Row-Lock Solvency Engine</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px', borderLeft: '3px solid #DC2626', paddingLeft: '10px' }}>
              Banking Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <Link to="/pools" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Micro-Bank Pools</Link>
              <Link to="/loans" style={{ color: '#CBD5E1', textDecoration: 'none' }}>P2P EMI Borrowing</Link>
              <Link to="/wallet" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Accounts & Wallet</Link>
              <Link to="/ledger" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Transaction Ledger</Link>
              <Link to="/calculator" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Fractional Yield Simulator</Link>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px', borderLeft: '3px solid #DC2626', paddingLeft: '10px' }}>
              Quick Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <Link to="/" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Home</Link>
              <Link to="/about" style={{ color: '#CBD5E1', textDecoration: 'none' }}>About Us</Link>
              <Link to="/faq" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Faq's</Link>
              <Link to="/contact" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Find Nearest Branch</Link>
            </div>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px', borderLeft: '3px solid #DC2626', paddingLeft: '10px' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: '#CBD5E1' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} color="#DC2626" />
                <span>info@example.com</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={16} color="#DC2626" />
                <span>+1 (800) 555-FINBANK</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <MapPin size={16} color="#DC2626" />
                <span>100 Financial Center Blvd, NY</span>
              </div>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
          © {new Date().getFullYear()} Finbank. All Rights Reserved. Decentralized P2P Fractional Banking Protocol.
        </div>

      </div>
    </footer>
  );
}
