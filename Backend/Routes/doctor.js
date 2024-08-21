const express = require('express');
const { PrismaClient } = require('@prisma/client');
const {authenticateToken} = require('../middleware/authMiddleware')
const cors = require('cors')
const prisma = new PrismaClient();
const router = express.Router();

// Middleware to parse JSON request bodies
router.use(express.json());
router.use(cors())

// GET all doctors
router.get('/', authenticateToken, async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching doctors' });
  }
});

// GET doctor by ID
router.get('/:id', authenticateToken , async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
    });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching doctor' });
  }
});

// POST create a new doctor
router.post('/', authenticateToken ,  async (req, res) => {
  const { name, speciality} = req.body;
  try {
    const newDoctor = await prisma.doctor.create({
      data: {
        name,
        speciality,
      },
    });
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(400).json({ error: 'Error creating doctor' });
  }
});

// PUT update doctor by ID
router.put('/:id', authenticateToken ,  async (req, res) => {
  const { id } = req.params;
  const { name, speciality } = req.body;
  try {
    const updatedDoctor = await prisma.doctor.update({
      where: { id: parseInt(id) },
      data: {
        name,
        speciality,
      },
    });
    res.json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ error: 'Error updating doctor' });
  }
});

// DELETE doctor by ID
router.delete('/:id', authenticateToken , async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.doctor.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting doctor' });
  }
});

module.exports = router;
