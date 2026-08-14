import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Lock, Mail, X, Sparkles, ShieldCheck, Landmark } from 'lucide-react';

const DEMO_PRESETS = {
  'alice@difi.org': { username: 'alice_banker', firstName: 'Alice', lastName: 'Banker', seedWallet: 50000 },
  'bob@difi.org': { username: 'bob_lender', firstName: 'Bob', lastName: 'Lender', seedWallet: 50000 },
  'charlie@difi.org': { username: 'charlie_borrower', firstName: 'Charlie', lastName: 'Borrower', seedWallet: 15000 }
};

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isLoginView) {
        await login(email, password);
        onClose();
      } else {
        await register({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName
        });
        setIsLoginView(true);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const loginDemoUser = async (demoEmail, demoPassword) => {
    setError('');
    setSubmitting(true);
    try {
      await login(demoEmail, demoPassword);
      onClose();
    } catch (err) {
      // If login fails (e.g. user not found in fresh DB), auto-register demo preset
      const preset = DEMO_PRESETS[demoEmail];
      if (preset) {
        try {
          await register({
            username: preset.username,
            email: demoEmail,
            password: demoPassword,
            first_name: preset.firstName,
            last_name: preset.lastName
          });
          const loginData = await login(demoEmail, demoPassword);
          if (preset.seedWallet > 0) {
            await api.wallet.deposit(preset.seedWallet);
          }
          onClose();
          return;
        } catch (regErr) {
          console.error('Demo auto-register failed:', regErr);
        }
      }
      setError(err.message || 'Failed to login demo account. Please make sure backend server is running.');
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
              <User size={20} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>
                {isLoginView ? 'Welcome to DiFi Bank' : 'Create Account'}
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Decentralized Fractional Banking</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* 1-Click Demo Accounts Selector */}
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '14px', padding: '14px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34D399', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> 1-Click Demo Testing Presets
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => loginDemoUser('alice@difi.org', 'password123')}
              disabled={submitting}
              style={{ flexDirection: 'column', padding: '10px 6px', gap: '2px', fontSize: '0.75rem', textAlign: 'center', justifyContent: 'center' }}
            >
              <strong style={{ color: '#F8FAFC' }}>Alice</strong>
              <span style={{ color: '#34D399', fontSize: '0.68rem' }}>Micro-Banker</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => loginDemoUser('bob@difi.org', 'password123')}
              disabled={submitting}
              style={{ flexDirection: 'column', padding: '10px 6px', gap: '2px', fontSize: '0.75rem', textAlign: 'center', justifyContent: 'center' }}
            >
              <strong style={{ color: '#F8FAFC' }}>Bob</strong>
              <span style={{ color: '#60A5FA', fontSize: '0.68rem' }}>LP Lender</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => loginDemoUser('charlie@difi.org', 'password123')}
              disabled={submitting}
              style={{ flexDirection: 'column', padding: '10px 6px', gap: '2px', fontSize: '0.75rem', textAlign: 'center', justifyContent: 'center' }}
            >
              <strong style={{ color: '#F8FAFC' }}>Charlie</strong>
              <span style={{ color: '#FBBF24', fontSize: '0.68rem' }}>Borrower</span>
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. user@difi.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
            {submitting ? 'Please wait...' : isLoginView ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#94A3B8' }}>
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => { setIsLoginView(!isLoginView); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#34D399', fontWeight: 700, cursor: 'pointer' }}
          >
            {isLoginView ? 'Register' : 'Login'}
          </button>
        </div>

      </div>
    </div>
  );
}
