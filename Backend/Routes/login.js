const express = require('express');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const {blacklist,  authenticateToken} = require('../Middleware/authMiddleware')
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const LoginRouter = express.Router();
dotenv.config();

LoginRouter.use(cors());

// Log in user and generate token
LoginRouter.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const findUser = await prisma.user.findUnique({ where: { email } });

        if (!findUser) {
            return res.status(400).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, findUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const user = { email: findUser.email, name: findUser.name  , id: findUser.id};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

        res.json({ message: "Login successful", user: findUser, accessToken });
    } catch (err) {
        res.status(500).json({ error: "Error during login" });
        console.log("Error:", err);
    }
});

LoginRouter.post('/logout' , authenticateToken, async(req,res)=>{
    const token = req.headers['authorization'].split(' ')[1];
    blacklist.add(token);
    res.json({ message: 'Logout successful' });

})

module.exports = { LoginRouter };
