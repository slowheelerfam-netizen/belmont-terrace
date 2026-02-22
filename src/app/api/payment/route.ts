import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { amount, name, address, email, note } = await req.json()

    if (!amount || !name || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const amountInCents = Math.round(parseFloat(amount.replace('$', '')) * 100)

    if (isNaN(amountInCents) || amountInCents <= 0) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method_types: ['card', 'us_bank_account'],
      description: `Water bill payment — ${address}`,
      receipt_email: email || undefined,
      metadata: {
        resident_name: name,
        property_address: address,
        note: note || 'Water bill payment',
        source: 'Belmont Terrace Mutual Water Company',
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Payment failed. Please try again.' }, { status: 500 })
  }
}
