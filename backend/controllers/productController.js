const mongoose = require("mongoose");
const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");

// ─── @desc   Create a Product
// ─── @route  POST /api/products
// ─── @access Private (Admin)
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock, brand, tagline, promoTitle, promoContent, color, target, features, beforeText, afterText, details } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "name, description, price, and category are required",
            });
        }

        let parsedTarget = [];
        let parsedFeatures = [];
        let parsedDetails = {};

        try {
            if (target) parsedTarget = JSON.parse(target);
            if (features) parsedFeatures = JSON.parse(features);
            if (details) parsedDetails = JSON.parse(details);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON format for target, features, or details",
            });
        }

        // If files were uploaded, save their paths to DB
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map((f) => {
                if (f.path && f.path.startsWith('http')) return f.path;
                return `uploads/${f.filename}`;
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            brand,
            tagline,
            promoTitle,
            promoContent,
            color,
            target: parsedTarget,
            features: parsedFeatures,
            beforeText,
            afterText,
            details: parsedDetails,
            images,
        });

        res.status(201).json({
            success: true,
            message: "Product created",
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Get All Products for Admin (including inactive)
// ─── @route  GET /api/products/admin/all
// ─── @access Private (Admin)
const getAllProductsAdmin = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.category) filter.category = req.query.category;
        if (req.query.search) {
            const searchWords = req.query.search.trim().split(/\s+/);
            filter.$and = searchWords.map(word => ({
                $or: [
                    { name: { $regex: word, $options: "i" } },
                    { brand: { $regex: word, $options: "i" } },
                ]
            }));
        }
        if (req.query.status === "active") filter.isActive = true;
        if (req.query.status === "inactive") filter.isActive = false;

        const sort = { createdAt: -1 };

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate("category", "name")
                .sort(sort)
                .skip(skip)
                .limit(limit),
            Product.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            message: "Admin products fetched",
            data: products,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

const fs = require("fs");

// ─── @desc   Get All Products (with search, filter & pagination)
// ─── @route  GET /api/products
// ─── @access Public
const getAllProducts = async (req, res, next) => {
    try {
        fs.appendFileSync("debug_api.txt", `Request: ${JSON.stringify(req.query)}\n`);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build query filters
        const filter = { isActive: true };

        if (req.query.category) filter.category = req.query.category;
        if (req.query.brand) filter.brand = { $regex: req.query.brand, $options: "i" };
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }
        if (req.query.search) {
            const searchWords = req.query.search.trim().split(/\s+/);
            // Match all words across name, brand, or description
            filter.$and = searchWords.map(word => ({
                $or: [
                    { name: { $regex: word, $options: "i" } },
                    { brand: { $regex: word, $options: "i" } },
                    { description: { $regex: word, $options: "i" } },
                ]
            }));
        }

        // Sorting
        const sortOptions = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            "price-asc": { price: 1 },
            "price-desc": { price: -1 },
            rating: { rating: -1 },
        };
        const sort = sortOptions[req.query.sort] || { createdAt: 1 };

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate("category", "name")
                .sort(sort)
                .skip(skip)
                .limit(limit),
            Product.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            message: "Products fetched",
            data: products,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        fs.appendFileSync("debug_api.txt", `Error: ${error.message}\nStack: ${error.stack}\n`);
        next(error);
    }
};

// ─── @desc   Get Product by ID
// ─── @route  GET /api/products/:id
// ─── @access Public
const getProductById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format",
            });
        }

        const product = await Product.findById(req.params.id)
            .populate("category", "name description")
            .populate({ path: "reviews", populate: { path: "user", select: "name" } });

        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched",
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Update Product
// ─── @route  PUT /api/products/:id
// ─── @access Private (Admin)
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Parse JSON fields if they are sent
        try {
            if (req.body.target && typeof req.body.target === 'string') req.body.target = JSON.parse(req.body.target);
            if (req.body.features && typeof req.body.features === 'string') req.body.features = JSON.parse(req.body.features);
            if (req.body.details && typeof req.body.details === 'string') req.body.details = JSON.parse(req.body.details);
            if (req.body.existingImages && typeof req.body.existingImages === 'string') {
                req.body.existingImages = JSON.parse(req.body.existingImages);
            }
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON format for target, features, details, or existingImages",
            });
        }

        // Handle new image uploads and existing images retention
        let currentImages = product.images;
        if (req.body.existingImages !== undefined) {
            currentImages = req.body.existingImages;
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((f) => {
                if (f.path && f.path.startsWith('http')) return f.path;
                return `uploads/${f.filename}`;
            });
            req.body.images = [...currentImages, ...newImages];
        } else {
            req.body.images = currentImages;
        }

        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after', runValidators: true }
        ).populate("category", "name");

        res.status(200).json({
            success: true,
            message: "Product updated",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Delete Product (soft delete)
// ─── @route  DELETE /api/products/:id
// ─── @access Private (Admin)
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Permanent delete as requested
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product permanently deleted",
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getAllProductsAdmin,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
