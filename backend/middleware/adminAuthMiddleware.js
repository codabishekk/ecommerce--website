const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Role = require("../models/Role");

// ─── Protect: Verify JWT & Attach Admin to Request ───────────────────────────
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach admin doc (without password) to req
            // Now populating 'role' and its 'permissions'
            const admin = await Admin.findById(decoded.id)
                .select("-password")
                .populate({
                    path: 'role',
                    populate: { path: 'permissions' }
                });
            
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: "Admin account not found",
                });
            }

            if (!admin.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "Your account has been deactivated",
                });
            }

            // Map permissions to a flat array for easy checking
            const permissions = admin.role?.permissions?.map(p => p.name) || [];
            const roleName = admin.role?.name || "";

            req.user = {
                ...admin.toObject(),
                role: roleName, // Keep the string 'role' for backward compatibility in logic
                roleId: admin.role?._id,
                permissions: permissions
            };

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({
                success: false,
                message: "Not authorized – token invalid or expired",
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: "Not authorized – no token provided",
        });
    }
};

// ─── Admin Check: Requires Admin Role ────────────────────────────────────────
const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Access denied – admins only",
        });
    }
};

// ─── Superadmin Check ─────────────────────────────────────────────────────────
const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === "superadmin") {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Access denied – superadmins only",
        });
    }
};

// ─── Granular Permission Check ───────────────────────────────────────────────
const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        // Superadmins bypass permission checks
        if (req.user && req.user.role === "superadmin") {
            return next();
        }

        if (req.user && req.user.permissions && req.user.permissions.includes(requiredPermission)) {
            next();
        } else {
             res.status(403).json({
                success: false,
                message: `Access denied – requires permission: ${requiredPermission}`,
            });
        }
    };
};

module.exports = { protect, isAdmin, isSuperAdmin, checkPermission };
