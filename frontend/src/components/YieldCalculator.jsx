import React, { useState } from 'react';
import { Calculator, Sparkles, TrendingUp, Percent, Landmark, ShieldCheck } from 'lucide-react';

export default function YieldCalculator() {
  const [loanAmount, setLoanAmount] = useState('10000');
  const [interestRate, setInterestRate] = useState('14.0');
  const [termMonths, setTermMonths] = useState('12');
  const [commissionPct, setCommissionPct] = useState('10.0');
  const [lpContribution, setLpContribution] = useState('2500');

  const p = parseFloat(loanAmount) || 0;
  const rate = parseFloat(interestRate) || 0;
  const n = parseInt(termMonths, 10) || 12;
  const commPct = parseFloat(commissionPct) || 0;
  const lpContrib = parseFloat(lpContribution) || 0;

  // Monthly EMI
  const r = (rate / 100) / 12;
  let emi = 0;
  if (r === 0) {
    emi = p / n;
  } else {
    emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  }

  const roundedEmi = Math.round(emi * 100) / 100;
  const totalRepayable = Math.round((roundedEmi * n) * 100) / 100;
  const totalInterestYield = Math.max(0, totalRepayable - p);

  // Split
  const bankerCommission = Math.round((totalInterestYield * (commPct / 100)) * 100) / 100;
  const totalPoolYield = Math.round((totalInterestYield - bankerCommission) * 100) / 100;

  // LP Share (assuming LP contribution share of total pool)
  const lpShareRatio = p > 0 ? Math.min(1, lpContrib / p) : 0;
  const myLpYield = Math.round((totalPoolYield * lpShareRatio) * 100) / 100;
  const myAnnualReturnPct = lpContrib > 0 ? ((myLpYield / lpContrib) * (12 / n) * 100).toFixed(2) : 0;

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Calculator size={22} color="#FFFFFF" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC' }}>Fractional Yield & Risk Simulator</h2>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Simulate returns for Micro-Bankers and Liquidity Provider (LP) contributors</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Input Parameters */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Percent size={18} color="#34D399" /> Loan & Pool Parameters
          </h3>

          <div className="form-group">
            <label className="form-label">Total Loan Pool Amount ($ USD)</label>
            <input
              type="number"
              step="500"
              className="form-input"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Interest Rate APR (%)</label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Term Length (Months)</label>
              <input
                type="number"
                step="1"
                className="form-input"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Banker Commission (%)</label>
              <input
                type="number"
                step="1"
                className="form-input"
                value={commissionPct}
                onChange={(e) => setCommissionPct(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Your LP Contribution ($)</label>
              <input
                type="number"
                step="100"
                className="form-input"
                value={lpContribution}
                onChange={(e) => setLpContribution(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Simulation Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Amortization Summary */}
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>BORROWER MONTHLY EMI</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399', margin: '4px 0' }}>${roundedEmi.toFixed(2)} / mo</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Total Repayable: <strong>${totalRepayable.toFixed(2)}</strong> | Gross Interest Yield: <strong style={{ color: '#FBBF24' }}>${totalInterestYield.toFixed(2)}</strong>
            </div>
          </div>

          {/* Banker Cut */}
          <div className="glass-panel" style={{ padding: '18px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#FBBF24', fontWeight: 700 }}>MICRO-BANKER COMMISSION ({commissionPct}%)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC' }}>${bankerCommission.toFixed(2)}</div>
              </div>
              <Landmark size={28} color="#FBBF24" />
            </div>
          </div>

          {/* LP Yield Share */}
          <div className="glass-panel" style={{ padding: '18px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#60A5FA', fontWeight: 700 }}>YOUR ESTIMATED LP YIELD SHARE</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399' }}>${myLpYield.toFixed(2)}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                  Effective Annualized APY: <strong style={{ color: '#34D399' }}>{myAnnualReturnPct}%</strong>
                </div>
              </div>
              <TrendingUp size={28} color="#60A5FA" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
