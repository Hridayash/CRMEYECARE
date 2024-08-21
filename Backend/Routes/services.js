// servicesRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

const prisma = new PrismaClient();

router.use(express.json());

// Get all services
router.get('/', authenticateToken, async (req, res) => {
  try {
    const services = await prisma.services.findMany();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching services' });
  }
});

// Get a single service by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await prisma.services.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching service' });
  }
});

// Create a new service
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    const newService = await prisma.services.create({
      data: {
        name,
        description,
        price: parseInt(price),
        duration,
      },
    });
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: 'Error creating service' });
  }
});

// Update a service
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    const updatedService = await prisma.services.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        description,
        price: parseInt(price),
        duration,
      },
    });
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: 'Error updating service' });
  }
});

// Delete a service
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.services.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting service' });
  }
});

module.exports = router;
