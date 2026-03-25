import { loadStripe } from '@stripe/stripe-js';

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = key ? loadStripe(key) : null;

export default stripePromise;
