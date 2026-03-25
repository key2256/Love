import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import stripePromise from '../lib/stripe';
import { toast } from 'sonner';

const CheckoutForm = ({ amount, onPaymentSuccess }: { amount: number, onPaymentSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { clientSecret } = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency: 'krw' }),
    }).then(res => res.json());

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      toast.error(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        onPaymentSuccess();
      }
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
      >
        {isProcessing ? '결제 처리 중...' : `${amount.toLocaleString()}원 결제하기`}
      </button>
    </form>
  );
};

export default function StripeCheckout({ amount, onPaymentSuccess }: { amount: number, onPaymentSuccess: () => void }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onPaymentSuccess={onPaymentSuccess} />
    </Elements>
  );
}
