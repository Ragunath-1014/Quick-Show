const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        movieCertificate: String,

        language: {
            type: String,
            required: true
        },

        duration: String,

        poster: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        category: String,

        cast: [
            {
                name: { type: String, required: true },
                image: { type: String, required: true }
            }
        ],

        trailer: {
            type: String,
            required: true
        },

        releaseDate: {
            type: Date,
            required: true
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Movie", movieSchema);