import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
          Find Nearest Branch & Contact Us
        </h1>
        <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
          Have questions about founding a bank pool or applying for a P2P loan? We're here to help.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
        
        {/* Contact Info */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: '#0F172A' }}>
            Finbank Global Support
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '36px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--crimson-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={24} color="#DC2626" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Headquarters & Branch Lookup</h4>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>100 Financial Plaza, 14th Floor, New York, NY 10005</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--crimson-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={24} color="#DC2626" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Email Support</h4>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>info@example.com / support@finbank.com</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--crimson-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={24} color="#DC2626" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>24/7 Telephone Line</h4>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>+1 (800) 555-FINBANK</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card-panel" style={{ padding: '36px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>Get In Touch</h3>
          
          {submitted ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '20px', borderRadius: '12px', color: '#059669', textAlign: 'center' }}>
              <CheckCircle size={32} style={{ marginBottom: '10px' }} />
              <h4>Message Received!</h4>
              <p style={{ fontSize: '0.9rem', color: '#334155', marginTop: '6px' }}>Our banking representative will reach out to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Full Name</label>
                <input type="text" className="form-input" required placeholder="John Doe" />
              </div>

              <div className="form-group">
                <label className="form-label">Your Email</label>
                <input type="email" className="form-input" required placeholder="john@example.com" />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input" rows="4" required placeholder="How can we assist you?" style={{ resize: 'vertical' }}></textarea>
              </div>

              <button type="submit" className="btn-crimson" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
