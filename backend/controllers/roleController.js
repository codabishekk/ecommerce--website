const Role = require("../models/Role");
const Permission = require("../models/Permission");

// ─── @desc   Get All Roles
// ─── @route  GET /api/admin/roles
// ─── @access Private (Admin)
const getRoles = async (req, res, next) => {
    try {
        const roles = await Role.find().populate("permissions", "name description resource");
        res.status(200).json({
            success: true,
            data: roles,
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Create New Role
// ─── @route  POST /api/admin/roles
// ─── @access Private (SuperAdmin)
const createRole = async (req, res, next) => {
    try {
        const { name, description, permissions } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Role name is required" });
        }

        const roleExists = await Role.findOne({ name });
        if (roleExists) {
            return res.status(400).json({ success: false, message: "Role already exists" });
        }

        const role = await Role.create({
            name,
            description,
            permissions,
        });

        res.status(201).json({
            success: true,
            data: role,
            message: "Role created successfully",
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Get All Permissions
// ─── @route  GET /api/admin/permissions
// ─── @access Private (Admin)
const getPermissions = async (req, res, next) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json({
            success: true,
            data: permissions,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getRoles, createRole, getPermissions };
