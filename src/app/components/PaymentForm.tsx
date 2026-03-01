'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Site color tokens
const C = {
  ink: '#1A1A14',
  cream: '#F5F0E4',
  creamDark: '#EDE6D6',
  forest: '#2D5016',
  forestLight: '#3D6B1E',
  sage: '#7A9E5A',
  sageLight: '#A8C285',
  warmGray: '#8B8478',
  rule: '#C8BFA8',
  ruleDark: '#A09888',
}

function CheckoutForm({ amount }: { name: string; address: string; email: string; note: string; amount: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setStatus('processing')
    setErrorMsg('')
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/payment-success` },
    })
    if (error) {
      setErrorMsg(error.message || 'Payment failed.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMsg && (
        <div style={{
          marginTop: '16px',
          fontSize: '0.8rem',
          color: '#8B1A1A',
          background: '#F5E8E8',
          border: '1px solid #D4A0A0',
          borderRadius: '4px',
          padding: '10px 14px',
          fontFamily: "'IM Fell English', serif",
        }}>{errorMsg}</div>
      )}
      <button
        type="submit"
        disabled={!stripe || status === 'processing'}
        style={{
          width: '100%',
          marginTop: '24px',
          background: C.forest,
          color: C.cream,
          padding: '14px',
          border: `1px solid ${C.sage}`,
          cursor: (!stripe || status === 'processing') ? 'not-allowed' : 'pointer',
          opacity: (!stripe || status === 'processing') ? 0.6 : 1,
          fontFamily: "'Courier Prime', monospace",
          fontSize: '0.68rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          transition: 'background 0.2s',
        }}
      >
        {status === 'processing' ? 'Processing...' : `Pay ${amount}`}
      </button>
    </form>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.6rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: C.warmGray,
  marginBottom: '6px',
  fontFamily: "'Courier Prime', monospace",
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: `1px solid ${C.rule}`,
  borderRadius: '3px',
  fontSize: '0.875rem',
  color: C.ink,
  background: '#ffffff',
  outline: 'none',
  fontFamily: "'IM Fell English', serif",
}

export default function PaymentForm() {
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ name: '', address: '', email: '', amount: '', note: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleContinue = async () => {
    if (!form.name || !form.address || !form.amount) {
      setError('Please fill in your name, address, and payment amount.')
      return
    }
    const amt = parseFloat(form.amount.replace('$', ''))
    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a valid payment amount.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); setLoading(false); return }
      setClientSecret(data.clientSecret)
      setStep('payment')
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ background: C.creamDark, border: `1px solid ${C.rule}`, borderRadius: '4px', padding: '28px' }}>
      {/* Section flag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span style={{
          background: C.forest,
          color: C.cream,
          fontFamily: "'Courier Prime', monospace",
          fontSize: '0.58rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          padding: '3px 10px',
        }}>Online Payment</span>
        <div style={{ flex: 1, borderTop: `1px solid ${C.rule}` }} />
      </div>
      <div style={{ borderTop: `2px double ${C.ruleDark}`, marginBottom: '20px' }} />

      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.5rem',
        fontWeight: 700,
        color: C.ink,
        margin: '0 0 4px',
      }}>Make a Payment</h3>
      <p style={{
        fontFamily: "'Courier Prime', monospace",
        fontSize: '0.6rem',
        letterSpacing: '0.12em',
        color: C.warmGray,
        textTransform: 'uppercase',
        marginBottom: '24px',
      }}>
        Processed securely via Stripe · Redwood Credit Union
      </p>

      {step === 'details' && (
        <>
          {[
            { field: 'name', label: 'Full Name *', placeholder: 'Jane Smith', type: 'text' },
            { field: 'address', label: 'Property Address *', placeholder: '123 Belmont Ave, Sebastopol CA', type: 'text' },
            { field: 'email', label: 'Email (for receipt)', placeholder: 'you@email.com', type: 'email' },
            { field: 'amount', label: 'Payment Amount *', placeholder: '$0.00', type: 'text' },
            { field: 'note', label: 'Note / Memo', placeholder: 'e.g. Q1 2026 water bill', type: 'text' },
          ].map(({ field, label, placeholder, type }) => (
            <div key={field} style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>{label}</label>
              <input
                name={field}
                type={type}
                placeholder={placeholder}
                value={form[field as keyof typeof form]}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          ))}

          {error && (
            <div style={{
              marginBottom: '16px',
              fontSize: '0.82rem',
              color: '#8B1A1A',
              background: '#F5E8E8',
              border: '1px solid #D4A0A0',
              borderRadius: '3px',
              padding: '10px 14px',
              fontFamily: "'IM Fell English', serif",
            }}>{error}</div>
          )}

          <div style={{
            background: '#FFFBEB',
            border: `1px solid #D4B896`,
            borderRadius: '3px',
            padding: '10px 14px',
            marginBottom: '24px',
          }}>
            <p style={{
              fontSize: '0.78rem',
              color: '#7A5020',
              fontFamily: "'IM Fell English', serif",
              fontStyle: 'italic',
              margin: 0,
            }}>
              ⚠️ Your address and note will appear on the transaction record so your payment can be applied to the correct account.
            </p>
          </div>

          <button
            onClick={handleContinue}
            disabled={loading}
            style={{
              width: '100%',
              background: C.forest,
              color: C.cream,
              padding: '14px',
              border: `1px solid ${C.sage}`,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Preparing...' : 'Continue to Payment →'}
          </button>
        </>
      )}

      {step === 'payment' && clientSecret && (
        <>
          <div style={{
            marginBottom: '24px',
            background: '#ffffff',
            border: `1px solid ${C.rule}`,
            borderRadius: '3px',
            padding: '14px 16px',
            fontSize: '0.85rem',
            color: C.ink,
            fontFamily: "'IM Fell English', serif",
            lineHeight: 1.7,
          }}>
            <div><strong>Name:</strong> {form.name}</div>
            <div><strong>Address:</strong> {form.address}</div>
            <div><strong>Amount:</strong> {form.amount}</div>
            {form.note && <div><strong>Note:</strong> {form.note}</div>}
          </div>

          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: C.forest,
                  colorBackground: '#ffffff',
                  colorText: C.ink,
                  colorDanger: '#8B1A1A',
                  fontFamily: "'IM Fell English', serif",
                  borderRadius: '3px',
                },
                rules: {
                  '.Input': { border: `1px solid ${C.rule}`, boxShadow: 'none' },
                  '.Input:focus': { border: `1px solid ${C.sage}`, boxShadow: 'none' },
                  '.Label': { color: C.warmGray, fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.15em' },
                },
              },
            }}
          >
            <CheckoutForm {...form} />
          </Elements>

          <button
            onClick={() => setStep('details')}
            style={{
              width: '100%',
              marginTop: '12px',
              fontSize: '0.7rem',
              color: C.warmGray,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              fontFamily: "'Courier Prime', monospace",
              letterSpacing: '0.1em',
            }}
          >← Go back</button>
        </>
      )}
    </div>
  )
}