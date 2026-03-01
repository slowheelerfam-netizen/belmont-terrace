'use client'
import Link from 'next/link'

export default function PaymentSuccess() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F0E4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        background: '#EDE6D6',
        border: '1px solid #C8BFA8',
        outline: '3px double #A09888',
        outlineOffset: '4px',
        borderRadius: '4px',
        padding: '48px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          background: '#EAF2E0',
          border: '1px solid #7A9E5A',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '1.8rem',
        }}>✓</div>

        {/* Flag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', justifyContent: 'center' }}>
          <span style={{
            background: '#2D5016',
            color: '#F5F0E4',
            fontFamily: "'Courier Prime', monospace",
            fontSize: '0.58rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            padding: '3px 10px',
          }}>Payment Confirmed</span>
        </div>
        <div style={{ borderTop: '2px double #A09888', marginBottom: '20px' }} />

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem',
          fontWeight: 700,
          color: '#1A1A14',
          marginBottom: '16px',
        }}>Payment Received</h1>

        <p style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: '1rem',
          fontStyle: 'italic',
          color: '#8B8478',
          lineHeight: 1.7,
          marginBottom: '32px',
        }}>
          Thank you — your water bill payment has been submitted. A receipt will be sent to your email. Your payment will be applied to your account within 1–2 business days.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: '#2D5016',
            color: '#F5F0E4',
            padding: '12px 32px',
            border: '1px solid #7A9E5A',
            textDecoration: 'none',
            fontFamily: "'Courier Prime', monospace",
            fontSize: '0.68rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            transition: 'background 0.2s',
          }}
        >
          Return to Home
        </Link>

        <p style={{
          fontFamily: "'Courier Prime', monospace",
          fontSize: '0.55rem',
          letterSpacing: '0.12em',
          color: '#8B8478',
          marginTop: '20px',
          textTransform: 'uppercase',
        }}>Processed via Stripe · Banked through Redwood Credit Union</p>
      </div>
    </main>
  )
}