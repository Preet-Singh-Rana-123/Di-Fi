import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ArrowRightLeft, ShieldCheck, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';

export default function LoansPage({ onOpenAuth, onOpenRepay }) {
  const { user, loans: myLoans, refreshUser } = useAuth();
  const [bankLoans, setBankLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>P2P EMI Loans Workspace</h1>
        <p style={{ color: '#64748B', fontSize: '1rem' }}>
          Manage loan applications, pay monthly EMI installments, or disburse borrower loans as a Micro-Banker.
        </p>
      </div>

      {!user ? (
        <div className="card-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Authentication Required</h3>
          <p style={{ color: '#64748B', marginBottom: '20px' }}>Please log in to manage your active loans and banker approvals.</p>
          <button className="btn-crimson" onClick={onOpenAuth}>
            Login / Demo Account
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Active Borrowed Loans Table */}
          <div className="card-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ArrowRightLeft size={20} color="#DC2626" />
              <span>My Active Borrowed Loans ({myLoans.length})</span>
            </h2>

            {myLoans.length === 0 ? (
              <div style={{ padding: '20px 0', color: '#64748B', fontSize: '0.95rem' }}>
                You have no active loan applications. You can request a loan from any Bank Pool in the Marketplace.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                      <th style={{ padding: '12px' }}>LOAN ID</th>
                      <th style={{ padding: '12px' }}>BANK POOL</th>
                      <th style={{ padding: '12px' }}>PRINCIPAL</th>
                      <th style={{ padding: '12px' }}>MONTHLY EMI</th>
                      <th style={{ padding: '12px' }}>REMAINING BALANCE</th>
                      <th style={{ padding: '12px' }}>STATUS</th>
                      <th style={{ padding: '12px' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLoans.map((loan) => (
                      <tr key={loan.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px 12px', fontWeight: 700, color: '#0F172A' }}>#{loan.id}</td>
                        <td style={{ padding: '14px 12px', color: '#475569', fontWeight: 600 }}>{loan.bank_name}</td>
                        <td style={{ padding: '14px 12px', fontWeight: 600 }}>${parseFloat(loan.principal_amount).toFixed(2)}</td>
                        <td style={{ padding: '14px 12px', color: '#059669', fontWeight: 700 }}>${parseFloat(loan.monthly_installment).toFixed(2)}</td>
                        <td style={{ padding: '14px 12px', color: '#DC2626', fontWeight: 700 }}>${parseFloat(loan.remaining_balance).toFixed(2)}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <span className={`badge ${loan.status === 'ACTIVE' ? 'badge-green' : loan.status === 'REPAID' ? 'badge-blue' : 'badge-crimson'}`}>
                            {loan.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          {loan.status === 'ACTIVE' && (
                            <button className="btn-crimson" onClick={() => onOpenRepay(loan)} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                              Repay EMI
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
