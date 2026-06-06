const express = require("express");
const router = express.Router();

const {
    addMovie,
    getAllMovies,
    getMovieById,
    getUpcomingMovies
} = require("../controllers/movieController");

const { protect, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/add", protect, isAdmin, upload.fields(
    [
        { name: "poster", maxCount: 1 },
        { name: "castImages", maxCount: 10 }
    ]
), addMovie);
router.get("/", getAllMovies);
router.get("/upcomingMovies", getUpcomingMovies);
router.get("/:movieId", getMovieById);

module.exports = router;