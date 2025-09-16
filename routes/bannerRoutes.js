const express = require("express");
const multer = require("multer");
const path = require("path");
const { getBanners, uploadBanner, deleteBanner } = require("../controllers/bannerController");

const router = express.Router();

// Multer storage (local uploads folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/banner");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.get("/", getBanners);
router.post("/", upload.single("image"), uploadBanner);
router.delete("/:id", deleteBanner);

module.exports = router;
