const Category = require("../models/Category");

// ─── @desc   Create Category
// ─── @route  POST /api/categories
// ─── @access Private (Admin)
const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        const exists = await Category.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Category already exists",
            });
        }

        const category = await Category.create({ name, description });

        res.status(201).json({
            success: true,
            message: "Category created",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Get All Categories
// ─── @route  GET /api/categories
// ─── @access Public
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            message: "Categories fetched",
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Update Category
// ─── @route  PUT /api/categories/:id
// ─── @access Private (Admin)
const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after', runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Delete Category
// ─── @route  DELETE /api/categories/:id
// ─── @access Private (Admin)
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted",
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
