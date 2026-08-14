import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Wallet, ArrowDownRight, ArrowUpRight, Send, Filter, RefreshCw, Search } from 'lucide-react';

export default function TransactionLedger() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.wallet.getHistory();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error('Failed to load transaction history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  if (!user) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
        Please log in to view your wallet transaction ledger.
      </div>
    );
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filterType === 'ALL' || tx.transaction_type === filterType;
    const matchesSearch = 
      (tx.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.sender_username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.receiver_username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.transaction_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getBadgeClass = (type) => {
    switch (type) {
      case 'DEPOSIT': return 'badge-emerald';
      case 'WITHDRAWAL': return 'badge-blue';
      case 'TRANSFER': return 'badge-purple';
      case 'POOL_DEPOSIT': return 'badge-blue';
      case 'LOAN_DISBURSEMENT': return 'badge-gold';
      case 'LOAN_REPAYMENT': return 'badge-emerald';
      case 'POOL_YIELD_DISTRIBUTION': return 'badge-emerald';
      case 'OWNER_COMMISSION': return 'badge-gold';
      default: return 'badge-blue';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC' }}>Immutable Wallet Ledger</h2>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Audit log of all P2P deposits, yield distributions, and disbursements</div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search ledger..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Filter */}
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ height: '40px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Types</option>
            <option value="DEPOSIT">Deposits</option>
            <option value="POOL_DEPOSIT">Pool Deposits</option>
            <option value="LOAN_DISBURSEMENT">Disbursements</option>
            <option value="LOAN_REPAYMENT">Repayments</option>
            <option value="POOL_YIELD_DISTRIBUTION">LP Yields</option>
            <option value="OWNER_COMMISSION">Banker Commissions</option>
            <option value="TRANSFER">P2P Transfers</option>
          </select>

          <button className="btn-secondary" onClick={fetchHistory} style={{ padding: '8px 14px', height: '40px' }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading ledger...</div>
      ) : filteredTransactions.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>No transactions match your criteria.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8' }}>
                <th style={{ padding: '12px 16px' }}>TYPE</th>
                <th style={{ padding: '12px 16px' }}>SENDER / RECEIVER</th>
                <th style={{ padding: '12px 16px' }}>AMOUNT ($)</th>
                <th style={{ padding: '12px 16px' }}>DESCRIPTION</th>
                <th style={{ padding: '12px 16px' }}>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => {
                const isIncoming = tx.receiver_id === user.id;
                const isOutgoing = tx.sender_id === user.id;
                const amountFormatted = parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 });

                return (
                  <tr 
                    key={tx.id} 
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${getBadgeClass(tx.transaction_type)}`}>
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#F8FAFC' }}>
                      {tx.sender_username && <span>From: <strong>{tx.sender_username}</strong></span>}
                      {tx.sender_username && tx.receiver_username && <span> → </span>}
                      {tx.receiver_username && <span>To: <strong>{tx.receiver_username}</strong></span>}
                      {!tx.sender_username && !tx.receiver_username && <span style={{ color: '#64748B' }}>System Protocol</span>}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: isIncoming ? '#34D399' : isOutgoing ? '#F87171' : '#F8FAFC' }}>
                      {isIncoming ? '+' : isOutgoing ? '-' : ''}${amountFormatted}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94A3B8' }}>
                      {tx.description || '-'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '0.8rem' }}>
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
