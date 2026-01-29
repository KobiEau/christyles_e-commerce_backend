const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinaryConfig = require("../config/cloudinary.config");

//setting up cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinaryConfig,
    params: {
        folder: "Christyles", //folder name
        allowed_formats: ["jpeg", "jpg", "png"]
    }
});

//Initalizing multer with cloudinary storage
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } //5mb
});

module.exports = upload;