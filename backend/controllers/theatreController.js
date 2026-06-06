const Theatre = require("../models/Theatre");

const addTheatre = async (req, res) => {
    try {
        const { theatreName } = req.body;

        const theatreLogo = req.file.path;

        const theatreExists = await Theatre.findOne({ theatreName });

        if (theatreExists) {
            return res.status(400).json({
                message: "Theatre already exists"
            });
        }

        const theatre = await Theatre.create({
            theatreName,
            theatreLogo
        });

        res.status(201).json({
            message: "Theatre added successfully"
        });
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const updateTheatre = async (req, res) => {
    try {
        const { theatreId, newTheatreName } = req.body;

        const theatre = await Theatre.findByIdAndUpdate(
            theatreId,
            { theatreName: newTheatreName },
            { returnDocument: "after" }
        );

        if (!theatre) {
            return res.status(404).json({
                message: "Theatre not found"
            });
        }

        res.status(200).json({
            message: "Theatre updated successfully"
        });
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const deleteTheatre = async (req, res) => {
    try {
        const { theatreId } = req.body;

        const theatre = await Theatre.findByIdAndDelete(theatreId);

        if (!theatre) {
            return res.status(404).json({
                message: "Theatre not found"
            });
        }

        res.status(200).json({
            message: "Theatre deleted successfully"
        });
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { addTheatre, updateTheatre, deleteTheatre };