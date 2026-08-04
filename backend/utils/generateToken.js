const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT token for a given id and role
 * @param {string} id  - MongoDB document _id
 * @param {string} role - 'admin' | 'superadmin'
 * @returns {string} signed JWT
 */
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d",
    });
};

module.exports = generateToken;
