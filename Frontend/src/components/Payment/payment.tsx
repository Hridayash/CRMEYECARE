import  { useState, useEffect } from 'react';
 // Assuming PaymentForm component is in './PaymentForm'
import axios from 'axios';
import {   Link} from 'react-router-dom';


const Payments = () => {
  const [payments, setPayments] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:3002/payment')
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        console.error('Error fetching payments:', error);
      });
  }, []);



  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex justify-between'>
        <h1 className="text-3xl font-semibold mb-6">Payments</h1>
        <Link to={'/add-payment'}>
            <button className='bg-blue-500 text-white rounded-xl px-4'>
              +Add
            </button>

        </Link>
      </div>
     

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Make Payment</h2>
          
          
          <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Payments List</h2>
          <ul className="divide-y divide-gray-200">
            {payments.map((payment: any) => (
              <li key={payment.id} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">ID: {payment.id}</p>
                    <p className="text-lg font-semibold">Amount: ${payment.amount}</p>
                    <p className="text-gray-500">Currency: {payment.currency}</p>
                  </div>
                  <p className={`px-3 py-1 rounded-md ${payment.status === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {payment.status}
                  </p>
                </div>
                <p className="mt-2 text-sm text-gray-600">Date: {new Date(payment.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
        </div>

     
      </div>
    </div>
  );
};

export default Payments;
