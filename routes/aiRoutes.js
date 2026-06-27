const express = require("express");
const multer = require("multer");
const protect = require("../middleware/authMiddleware");
const { getInsights, askQuestion, scanReceiptHandler } = require("../controllers/aiController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
    }
  },
});

const router = express.Router();

router.post("/insights", protect, getInsights);
router.post("/query", protect, askQuestion);
router.post("/receipt", protect, upload.single("receipt"), scanReceiptHandler);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "File too large. Max 5MB." });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

module.exports = router;
