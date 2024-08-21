const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
router.post('/create-payment-intent', async (req, res) => {
    const { amount, currency, appointmentId } = req.body;
  
    try {
      // Check if appointment exists
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });
  
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
  
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert amount to cents
        currency,
        metadata: { appointmentId: appointmentId.toString() },
      });
  
      // Save payment information to the database
      await prisma.payment.create({
        data: {
          amount,
          currency,
          status : 'succeeded',
          appointmentId,
          
        },
      });
  
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Retrieve payment details
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: { appointment: true },
    });

    if (!payment) {
      return res.status(404).send({ error: 'Payment not found' });
    }

    res.status(200).send(payment);
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

// List all payments
router.get('/', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { appointment: true },
    });
    res.status(200).send(payments);
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

module.exports = router;
