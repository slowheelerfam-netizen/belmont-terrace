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

function CheckoutForm({ name, address, email, note, amount }: {
  name: string
  address: string
  email: string
  note: string
  amount: string
}) {
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
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
        receipt_email: email,
      },
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
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {errorMsg}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || status === 'processing'}
        className="w-full mt-6 bg-blue-700 text-white py-4 rounded text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'processing' ? 'Processing...' : `Pay ${amount}`}
      </button>
    </form>
  )
}

export default function PaymentForm() {
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    address: '',
    email: '',
    amount: '',
    note: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }
      setClientSecret(data.clientSecret)
      setStep('payment')
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="bg-sky-50 border border-slate-200 rounded p-10">
      <h3 className="text-2xl font-light mb-2 text-slate-800">Make a Payment</h3>
      <p className="text-xs text-slate-400 mb-8">Processed securely via Stripe · Redwood Credit Union</p>

      {step === 'details' && (
        <>
          <div className="mb-4">
            <label className="block text-xs font-medium uppercase tracking-widest text-slate-400 mb-2">Full Name *</label>
            <input
              name="name"
              type="text"
              placeholder="Jane Smith"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium uppercase tracking-widest text-slate-400 mb-2">Property Address *</label>
            <input
              name="address"
              type="text"
              placeholder="123 Belmont Ave, Sebastopol CA"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium uppercase tracking-widest text-slate-400 mb-2">Email (for receipt)</label>
            <input
              name="email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium uppercase tracking-widest text-slate-400 mb-2">Payment Amount *</label>
            <input
              name="amount"
              type="text"
              placeholder="$0.00"
              value={form.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-medium uppercase tracking-widest text-slate-400 mb-2">Note / Memo</label>
            <input
              name="note"
              type="text"
              placeholder="e.g. Q1 2026 water bill"
              value={form.note}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
            />
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-6">
            <div className="text-xs text-amber-700 font-light">
              ⚠️ Your address and note will appear on the transaction record so your payment can be applied to the correct account.
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full bg-blue-700 text-white py-4 rounded text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer border-none disabled:opacity-50"
          >
            {loading ? 'Preparing...' : 'Continue to Payment →'}
          </button>
        </>
      )}

      {step === 'payment' && clientSecret && (
        <>
          <div className="mb-6 bg-white border border-slate-200 rounded p-4 text-sm text-slate-600">
            <div><span className="font-medium">Name:</span> {form.name}</div>
            <div><span className="font-medium">Address:</span> {form.address}</div>
            <div><span className="font-medium">Amount:</span> {form.amount}</div>
            {form.note && <div><span className="font-medium">Note:</span> {form.note}</div>}
          </div>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm {...form} />
          </Elements>
          <button
            onClick={() => setStep('details')}
            className="w-full mt-3 text-sm text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer py-2"
          >
            ← Go back
          </button>
        </>
      )}
    </div>
  )
}
