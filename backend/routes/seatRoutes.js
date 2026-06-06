const express = require("express");
const router = express.Router();

const { lockSeats, releaseSeats } = require("../controllers/seatController");
const { protect } = require("../middleware/authMiddleware");

router.post("/lock", protect, lockSeats);
router.post("/release", protect, releaseSeats);

module.exports = router;