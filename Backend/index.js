const { PrismaClient } = require("@prisma/client");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { LoginRouter } = require('./Routes/login');
const { UserRouter } = require('./Routes/user');
const profileRouter = require('./Routes/profile');
const patientRouter  = require('./Routes/patient');
const doctorRouter = require('./Routes/doctor')
const appointmentRouter = require('./Routes/appointment')
const paymentRouter = require('./Routes/payment')
const dashboardRouter = require('./Routes/dashboard')
const serviceRouter = require('./Routes/services')
const salesRouter = require('./Routes/sales')
// Initialize app and Prisma client
dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/login', LoginRouter);
app.use('/user', UserRouter);
app.use('/profile', profileRouter);
app.use('/patients' , patientRouter);
app.use('/doctors' , doctorRouter)
app.use('/appointments' , appointmentRouter)
app.use('/payment', paymentRouter);
app.use('/dashboard', dashboardRouter);
app.use('/services', serviceRouter);
app.use('/sales', salesRouter);



// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
