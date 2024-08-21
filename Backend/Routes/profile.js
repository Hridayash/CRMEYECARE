const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Middleware to authenticate token
const { authenticateToken } = require('../Middleware/authMiddleware');

// Create a new profile
router.post('/', authenticateToken, async (req, res) => {
    const { groupName, contactName, contactEmail, contactPhone, demographics, groupSize, specificRequirements } = req.body;
    const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user.id
  
    try {
      const newProfile = await prisma.profile.create({
        data: {
          groupName,
          contactName,
          contactEmail,
          contactPhone,
          demographics,
          groupSize,
          specificRequirements,
          userId,
        },
      });
      res.status(201).json(newProfile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ error: 'Failed to create profile' });
    }
  });

//Get all profiles
// router.get('/', authenticateToken, async (req, res) => {
//   const id = parseInt(req.user.id)
//   try {
//     const profiles = await prisma.profile.findFirst({
//       where: { userId: req.user.id },
//       select :{
//         groupName: true,
//         contactName: true,
//         contactEmail:true,
//         contactPhone: true,
//         demographics: true,
//         groupSize : true,
//         specificRequirements : true,
//         id : true
//       }

//     });
//     res.json(profiles);
//   } catch (error) {
//     console.error("Error fetching profiles:", error);
//     res.status(500).json({ error: 'Failed to fetch profiles' });
//   }
// });

router.get('/', authenticateToken, async (req, res) => {
  try {
    let profile = await prisma.profile.findFirst({
      where: { userId: req.user.id },
    });

    if (!profile) {
      // If no profile exists, return a default profile with empty strings
      profile = {
        id: '',
        groupName: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        demographics: '',
        groupSize: '',
        specificRequirements: ''
      };
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

//Get a single profile by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: parseInt(id), userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update a profile by ID
// Update a profile by ID
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { groupName, contactName, contactEmail, contactPhone, demographics, groupSize, specificRequirements } = req.body;

  try {
    // Check if the profile exists and belongs to the authenticated user
    const existingProfile = await prisma.profile.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProfile || existingProfile.userId !== req.user.id) {
      return res.status(404).json({ error: 'Profile not found or not authorized' });
    }

    // Update the profile
    const updatedProfile = await prisma.profile.update({
      where: { id: parseInt(id) },
      data: { groupName, contactName, contactEmail, contactPhone, demographics, groupSize, specificRequirements },
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete a profile by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.profile.delete({
      where: { id: parseInt(id), userId: req.user.id },
    });

    res.status(204).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

module.exports = router;
