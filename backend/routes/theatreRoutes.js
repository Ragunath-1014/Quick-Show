const express = require("express");
const router = express.Router();

const { addTheatre, updateTheatre, deleteTheatre } = require("../controllers/theatreController");

const { protect, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/add", protect, isAdmin, upload.single("theatreLogo"), addTheatre);
router.put("/update", updateTheatre);
router.delete("/delete", deleteTheatre);

module.exports = router;