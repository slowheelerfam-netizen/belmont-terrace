'use client'

import { useEffect } from 'react'
import PaymentForm from '@/app/components/PaymentForm'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>Pay Water Bill</h2>
            <p className="text-xs text-slate-400 mt-0.5">Belmont Terrace Mutual Water Company</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors border-none cursor-pointer text-slate-500 text-lg"
          >
            ×
          </button>
        </div>
        {/* Form */}
        <div className="px-8 py-6">
          <PaymentForm />
        </div>
      </div>
    </div>
  )
}
