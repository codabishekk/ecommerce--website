const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── Storage Configuration ───────────────────────────────────────────────────
let storage;

if (process.env.CLOUDINARY_CLOUD_NAME) {
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: "sholash-products",
            allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
        },
    });
} else {
    storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, uploadDir);
        },
        filename(req, file, cb) {
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        },
    });
}

// ─── File Filter: Images Only ─────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, webp, gif)"));
    }
};

// ─── Multer Config ────────────────────────────────────────────────────────────
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 25 * 1024 * 1024, // 25 MB per file
    },
});

// Convenience wrappers
const uploadSingle = (fieldName) => upload.single(fieldName);
const uploadMultiple = (fieldName, maxCount = 15) =>
    upload.array(fieldName, maxCount);

module.exports = { upload, uploadSingle, uploadMultiple };
