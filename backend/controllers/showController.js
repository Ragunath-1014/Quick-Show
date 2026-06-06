const Show = require("../models/Show");
const generateSeats = require("../utils/generateSeats");

const addShow = async (req, res) => {
    try {
        const {
            movieId,
            theatreId,
            date,
            time,
            cancellationPolicy
        } = req.body;

        const seats = generateSeats();

        const show = await Show.create({
            movie: movieId,
            theatre: theatreId,
            date,
            time,
            seats,
            cancellationPolicy
        });

        res.status(201).json({
            message: "Show added successfully",
            show
        });
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getShowsByMovie = async (req, res) => {
    try {
        const { movieId } = req.params;

        const shows = await Show.find({ movie: movieId })
            .populate("movie theatre");

        if (!shows) {
            return res.status(404).json({
                message: "No shows found"
            });
        }

        const grouped = {};

        for (const show of shows) {
            const formattedDate = new Date(show.date).toDateString();
            const theatreName = show.theatre.theatreName;
            const theatreLogo = show.theatre.theatreLogo;

            if (!grouped[formattedDate]) {
                grouped[formattedDate] = {}
            }

            if (!grouped[formattedDate][theatreName]) {
                grouped[formattedDate][theatreName] = {
                    theatreName,
                    theatreLogo,
                    cancellationPolicy: show.cancellationPolicy,
                    shows: []
                }
            }

            grouped[formattedDate][theatreName].shows.push(show);
        }

        const dates = Object.keys(grouped);

        const result = [];

        for (const date of dates) {
            const theatreList = Object.values(grouped[date]);

            result.push({
                date,
                theatres: theatreList
            });
        }

        res.status(200).json(result);
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getShowById = async (req, res) => {
    try {
        const { showId } = req.params;

        const show = await Show.findById(showId)
            .populate("movie theatre");

        if (!show) {
            return res.status(404).json({
                message: "Show not found"
            });
        }

        res.status(200).json(show);
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { addShow, getShowsByMovie, getShowById };