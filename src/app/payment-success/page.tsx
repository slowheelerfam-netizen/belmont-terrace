'use client'
import Link from 'next/link';

export default function PaymentSuccess() {
  return (
    <main className="min-h-screen bg-sky-50 flex items-center justify-center px-6">
      <div className="bg-white border border-slate-200 rounded-xl p-12 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✅</span>
        </div>
        <h1 className="text-3xl font-light text-slate-800 mb-3">Payment Received</h1>
        <p className="text-sm text-slate-500 font-light leading-relaxed mb-8">
          Thank you! Your water bill payment has been submitted. A receipt will be sent to your email. Your payment will be applied to your account within 1–2 business days.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-700 text-white px-8 py-3 rounded text-sm font-medium no-underline hover:bg-blue-600 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </main>
  )
}
