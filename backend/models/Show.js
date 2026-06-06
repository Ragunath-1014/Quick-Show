const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
    {
        seatNumber: String,

        status: {
            type: String,
            enum: ["Available", "Locked", "Booked"],
            default: "Available"
        },

        lockedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        lockedAt: {
            type: Date,
            default: null
        }
    }
);

const rowSchema = new mongoose.Schema(
    {
        row: String,
        seats: [seatSchema]
    }
);

const sectionSchema = new mongoose.Schema(
    {
        section: String,
        price: Number,
        rows: [rowSchema]
    }
);

const showSchema = new mongoose.Schema(
    {
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie"
        },

        theatre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Theatre"
        },

        date: {
            type: Date,
            required: true
        },

        time: {
            type: String,
            required: true
        },

        seats: [sectionSchema],

        cancellationPolicy: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Show", showSchema);