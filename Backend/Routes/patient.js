const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new patient
router.post('/', authenticateToken, async (req, res) => {
  const { name, age, gender, email, phone, address } = req.body;

  try {
    const newPatient = await prisma.patient.create({
      data: {
        name,
        age,
        gender,
        email,
        phone :phone.toString(),
        address,
      },
    });
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// Get all patients
router.get('/', authenticateToken, async (req, res) => {
  try {
    const patients = await prisma.patient.findMany();
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Get a patient by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await prisma.patient.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Update a patient by ID
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, email, phone, address } = req.body;

  try {
    const updatedPatient = await prisma.patient.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        age,
        gender,
        email,
        phone :phone.toString(),
        address,
      },
    });

    res.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// Delete a patient by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.patient.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(204).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

module.exports = router;
