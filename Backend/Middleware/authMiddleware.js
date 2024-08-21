const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Token blacklist (using Set to store revoked tokens)
const blacklist = new Set();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (blacklist.has(token)) {
        return res.status(403).json({ error: "Forbidden" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(403).json({ error: "Forbidden" });
        }
        req.user = user; // Attach user data to the request object for further use in routes
        next();
    });
}

module.exports = {
    authenticateToken,
    blacklist
};
