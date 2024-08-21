// salesRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

const prisma = new PrismaClient();

router.use(express.json());

// Get all sales
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sales = await prisma.sales.findMany({
      include: {
        user: true,
        customer: true,
      },
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sales' });
  }
});

// Get a single sale by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const sale = await prisma.sales.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: true,
        customer: true,
      },
    });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sale' });
  }
});

// Create a new sale
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { employeeId, customerId, serviceId, date, serviceDuration, totalAmount } = req.body;
    const newSale = await prisma.sales.create({
      data: {
        employeeId: parseInt(employeeId),
        customerId: parseInt(customerId),
        serviceId: parseInt(serviceId),
        date: new Date(date),
        serviceDuration: parseInt(serviceDuration),
        totalAmount: parseInt(totalAmount),
      },
    });
    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ error: 'Error creating sale' });
  }
});

// Update a sale
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { employeeId, customerId, serviceId, date, serviceDuration, totalAmount } = req.body;
    const updatedSale = await prisma.sales.update({
      where: { id: parseInt(req.params.id) },
      data: {
        employeeId: parseInt(employeeId),
        customerId: parseInt(customerId),
        serviceId: parseInt(serviceId),
        date: new Date(date),
        serviceDuration: parseInt(serviceDuration),
        totalAmount: parseInt(totalAmount),
      },
    });
    res.json(updatedSale);
  } catch (error) {
    res.status(500).json({ error: 'Error updating sale' });
  }
});

// Delete a sale
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.sales.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting sale' });
  }
});

module.exports = router;
