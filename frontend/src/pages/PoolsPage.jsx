import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import BankPoolCard from '../components/BankPoolCard';
import { Landmark, Plus, Search, Filter } from 'lucide-react';

export default function PoolsPage({ onOpenAuth, onOpenCreatePool, onOpenDeposit, onOpenLoan }) {
  const { user } = useAuth();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredPools = pools.filter(p => 
    (p.bank_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.owner_username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>Bank Pools Marketplace</h1>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            Explore peer-managed fractional reserve vaults. Deposit liquidity or request loans.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name or banker..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', height: '42px' }}
            />
          </div>

          <button 
            className="btn-crimson" 
            onClick={() => user ? onOpenCreatePool() : onOpenAuth()}
            style={{ height: '42px' }}
          >
            <Plus size={18} /> Found Bank Pool
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>Loading Bank Pools...</div>
      ) : filteredPools.length === 0 ? (
        <div className="card-panel" style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
          No bank pools match your search criteria.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredPools.map((pool) => (
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
  );
}
