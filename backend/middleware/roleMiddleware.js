/**
 * Role-based authorization middleware.
 * Usage: router.get('/route', protect, authorizeRoles('superadmin'), handler)
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not allowed to perform this action`,
            });
        }

        next();
    };
};

module.exports = { authorizeRoles };
