const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/authMiddleware');
const dotenv = require('dotenv')

const prisma = new PrismaClient();
const UserRouter = express.Router();
dotenv.config();
// Create new user with hashed password
UserRouter.post('/createUser', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = { email: req.body.email, username: req.body.name, password: hashedPassword };
        const newUser = await prisma.user.create({ data: user });

        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
        console.log("Error:", error);
    }
});



// Get user information
UserRouter.get('/userInfo', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: req.user.email },
            select: { username: true, email: true , id: true }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Error fetching user information" });
        console.log("Error:", err);
    }
});

UserRouter.get('/' , authenticateToken , async (req,res)=>{
    try{
        const user = await prisma.user.findMany()
        res.json(user)

        
    }catch(err){
        console.log(err)
    }
 

})

UserRouter.post('/logout', authenticateToken, (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    blacklist.add(token);
    res.json({ message: 'Logout successful' });
});

module.exports = { UserRouter }; 
