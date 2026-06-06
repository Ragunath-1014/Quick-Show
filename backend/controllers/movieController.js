const Movie = require("../models/Movie");

const addMovie = async (req, res) => {
    try {
        const {
            title,
            movieCertificate,
            language,
            duration,
            description,
            category,
            trailer,
            releaseDate,
            castNames
        } = req.body;

        const names = JSON.parse(castNames);

        const moviePoster = req.files.poster[0].path;

        const images = req.files.castImages.map((castImage) => (
            castImage.path
        ));

        if (images.length !== names.length) {
            return res.status(400).json({
                message: "Cast names and images count mismatch"
            });
        }

        const cast = names.map((name, index) => ({
            name,
            image: images[index]
        }));

        const movie = await Movie.create({
            title,
            movieCertificate,
            language,
            duration,
            poster: moviePoster,
            description,
            category,
            cast,
            trailer,
            releaseDate
        });

        res.status(201).json({
            message: "Movie added successfully",
            movie
        });
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getAllMovies = async (req, res) => {
    try {
        const todayDate = new Date();
        todayDate.setHours(23, 59, 59, 999);

        const movies = await Movie.find({ releaseDate: { $lte: todayDate } })
            .sort({ releaseDate: -1 });

        if (!movies) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json(movies);
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getMovieById = async (req, res) => {
    try {
        const { movieId } = req.params;

        const movie = await Movie.findById(movieId);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json(movie);
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getUpcomingMovies = async (req, res) => {
    try {
        const date = new Date();

        const tomorrow = new Date();

        tomorrow.setDate(date.getDate() + 1);

        const upcomingMovies = await Movie.find({ releaseDate: { $gte: tomorrow } })
            .sort({ releaseDate: 1 });

        if (!upcomingMovies) {
            return res.status(404).json({
                message: "No upcoming movies found"
            });
        }

        res.status(200).json(upcomingMovies);
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { addMovie, getAllMovies, getMovieById, getUpcomingMovies };