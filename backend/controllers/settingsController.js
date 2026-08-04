const Settings = require("../models/Settings");

// ─── @desc   Get All Settings
// ─── @route  GET /api/admin/settings
// ─── @access Private (Admin)
const getSettings = async (req, res, next) => {
    try {
        const settings = await Settings.find();
        res.status(200).json({
            success: true,
            message: "Settings fetched successfully",
            data: settings,
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Update Settings
// ─── @route  PUT /api/admin/settings
// ─── @access Private (Admin/SuperAdmin - based on context, usually SuperAdmin)
const updateSettings = async (req, res, next) => {
    try {
        const { settings } = req.body; // Expecting an array of { key, value }

        if (!Array.isArray(settings)) {
            return res.status(400).json({
                success: false,
                message: "Settings must be an array of { key, value } objects",
            });
        }

        const updatePromises = settings.map((s) =>
            Settings.findOneAndUpdate(
                { key: s.key },
                { $set: { value: s.value, ...(s.group && { group: s.group }) } },
                { returnDocument: 'after', upsert: true }
            )
        );

        const updatedSettings = await Promise.all(updatePromises);

        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            data: updatedSettings,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getSettings, updateSettings };
