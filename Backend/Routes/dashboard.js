const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/authMiddleware');
const cors = require('cors');
const prisma = new PrismaClient();
const router = express.Router();

router.use(express.json());
router.use(cors());

router.get('/', authenticateToken, async (req, res) => {
  try {
    // Fetch all data
    const patients = await prisma.patient.findMany();
    const appointments = await prisma.appointment.findMany();
    const revenue = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
    });
    const revenueData = revenue._sum.amount || 0;
    const appointmentsByDay = await prisma.appointment.groupBy({
      by: ['date'],
      _count: {
        id: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
    // const salesData = await prisma.sales.groupBy({
    //   by: ['serviceId'],
    //   _sum: { totalAmount: true },
    //   include: {
    //     services: true,
    //   },
    // });

    // // Format sales data
    // const formattedSalesData = salesData.map(sale => ({
    //   serviceName: sale.service.name,
    //   totalSales: sale._sum.totalAmount,
    // }));

    // Format chart data
    const chartData = appointmentsByDay.map(entry => ({
      date: entry.date.toISOString().split('T')[0],
      count: entry._count.id,
    }));

    // Prepare the response data
    const response = {
      totalAppointment: appointments.length,
      totalPatient: patients.length,
      revenueData,
      chartData,
      // formattedSalesData,
    };

    // Send the response
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

module.exports = router;
