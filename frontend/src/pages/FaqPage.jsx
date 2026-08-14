import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FaqPage() {
  const faqs = [
    {
      q: "What is a Micro-Founding Banker?",
      a: "A Micro-Founding Banker is a user who creates a bank pool vault. They establish the loan APR interest rate, banker commission percentage, and minimum reserve ratio. They seed initial liquidity and collect commission cuts from borrower payments."
    },
    {
      q: "How does Liquidity Provider (LP) yield work?",
      a: "Micro-lenders deposit funds into active Bank Pools. When borrowers make monthly EMI payments, the interest portion is split between the banker commission and the LP pool yield. LPs earn yield proportional to their contribution share."
    },
    {
      q: "What is the Fractional Reserve Ratio?",
      a: "The reserve ratio (e.g. 20%) ensures that a minimum percentage of the pool's total liquidity remains unloaned and available for depositor withdrawals at all times."
    },
    {
      q: "How are ACID properties enforced?",
      a: "All financial updates run inside PostgreSQL database transaction blocks (BEGIN -> COMMIT/ROLLBACK) using FOR UPDATE row locks. If any step fails (e.g. overdraft or insufficient pool reserve), the entire operation rolls back atomically."
    }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
          Everything you need to know about Finbank P2P Fractional Banking mechanics.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} className="card-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HelpCircle size={20} color="#DC2626" />
              {faq.q}
            </h3>
            <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
