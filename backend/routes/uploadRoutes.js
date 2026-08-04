const express = require("express");
const router = express.Router();
const { uploadUserPhoto, deleteUserPhoto } = require("../controllers/uploadController");
const { uploadSingle } = require("../middleware/uploadMiddleware");

// Route for uploading a single photo
// 'photo' is the name of the field in the multipart form-data
router.post("/user-photo", uploadSingle("photo"), uploadUserPhoto);

// Route for deleting a photo
router.delete("/user-photo", deleteUserPhoto);

module.exports = router;
