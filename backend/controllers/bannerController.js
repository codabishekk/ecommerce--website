const Banner = require("../models/Banner");

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res, next) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: banners,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all banners for admin
// @route   GET /api/banners/admin
// @access  Private (Admin)
const getBannersAdmin = async (req, res, next) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: banners,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private (Admin)
const createBanner = async (req, res, next) => {
    try {
        const { title, description, link } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Banner image is required",
            });
        }

        const imagePath = req.file.path.startsWith('http') 
            ? req.file.path 
            : `uploads/${req.file.filename}`;

        const banner = await Banner.create({
            title,
            description,
            link,
            image: imagePath,
        });

        res.status(201).json({
            success: true,
            message: "Banner created successfully",
            data: banner,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private (Admin)
const deleteBanner = async (req, res, next) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }

        await Banner.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle banner status
// @route   PATCH /api/banners/:id/toggle
// @access  Private (Admin)
const toggleBannerStatus = async (req, res, next) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }

        banner.isActive = !banner.isActive;
        await banner.save();

        res.status(200).json({
            success: true,
            message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
            data: banner,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private (Admin)
const updateBanner = async (req, res, next) => {
    try {
        const { title, description, link, isActive } = req.body;
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }

        if (req.file) {
            banner.image = req.file.path.startsWith('http') 
                ? req.file.path 
                : `uploads/${req.file.filename}`;
        }

        if (title !== undefined) banner.title = title;
        if (description !== undefined) banner.description = description;
        if (link !== undefined) banner.link = link;
        if (isActive !== undefined) banner.isActive = isActive;

        await banner.save();

        res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: banner,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBanners,
    getBannersAdmin,
    createBanner,
    deleteBanner,
    toggleBannerStatus,
    updateBanner,
};
