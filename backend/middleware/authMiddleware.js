const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

//Protect Routes : Verifies the JWT Token
const protect = async (req, res, next) => {
    let token;

    //check if the tokens exists in headers 
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from string
            token = req.headers.authorization.split(' ')[1];

            //Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //Get users from the token (exclude password) and attach
            req.user = await User.findById(decoded.id).select('-password');

            next(); //move to the next function/controller
        } catch (error) {
            res.status(401).json({ message: 'Not authorized to access this route' })
        }

    }
};

//Admin MiddleWare Checks if user is admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized to access this route' })
    }
};

module.exports = { protect, admin };
