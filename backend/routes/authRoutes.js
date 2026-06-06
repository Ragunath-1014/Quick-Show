const express = require("express");
const router = express.Router();

const { signupUser, loginUser, logoutUser, getProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", protect, getProfile);

module.exports = router;