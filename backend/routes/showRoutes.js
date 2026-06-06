const express = require("express");
const router = express.Router();

const { addShow, getShowsByMovie, getShowById } = require("../controllers/showController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/add", protect, isAdmin, addShow);
router.get("/movie/:movieId", getShowsByMovie);
router.get("/:showId", getShowById);

module.exports = router;