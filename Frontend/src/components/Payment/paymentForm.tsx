import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const stripePromise = loadStripe('pk_test_51PcZBZRwGItDqvajMed86oFa87BScl59eMDZK3l0O6KmaElx6XKhGswzXmMLs31LLO1yb23da8wpIL1DqlvO4J0c00A0LlXR7o'); // Replace with your Stripe public key

interface FormState {
  amount: number;
  currency: string;
  appointmentId: number;
  postalCode: string;
}

const PaymentForm: React.FC = () => {
    const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    amount: 0,
    currency: 'usd',
    appointmentId: 0,
    postalCode: '',
  });

  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: name === 'amount' || name === 'appointmentId' ? parseFloat(value) : value,
    }));
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setForm(prevForm => ({
  //       ...prevForm,
  //       file: e.target.files[0],
  //     }));
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3002/payment/create-payment-intent', {
        amount: form.amount,
        currency: form.currency,
        appointmentId: form.appointmentId,
        
      });
  
      const clientSecret = response.data.clientSecret;
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'Customer Name', // Replace with actual customer name if available
            address: {
              postal_code: form.postalCode, // Include postal code here
            },
          },
        },
      });
  
      if (result.error) {
        console.error(result.error.message);
        // Handle error display or logging here
      } else if (result.paymentIntent?.status === 'succeeded') {
        console.log('Payment successful!');
        navigate('/payment')
        // Handle post-payment success (e.g., update your database, show a success message)
      }
    } catch (error) {
      console.error('Error creating or confirming payment intent:', error);
      // Handle more specific error cases or display an error message
    }
  };
  
  

  const handleCancle = () => {
    navigate('/payment')
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="currency">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="usd">USD</option>
            <option value="cad">CAD</option>
            {/* Add more currencies as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="appointmentId">
            Appointment ID
          </label>
          <input
            type="number"
            id="appointmentId"
            name="appointmentId"
            value={form.appointmentId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="postalCode">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <CardElement className="p-4 border rounded-md" />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          disabled={!stripe}
        >
          Pay
        </button>
      </form>
      <button
      onClick={handleCancle}
       
        className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  );
};

const PaymentForms: React.FC = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentForms;
