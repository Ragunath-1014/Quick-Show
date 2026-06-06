const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema(
    {
        theatreName: {
            type: String,
            required: true
        },
        
        theatreLogo: {
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model("Theatre", theatreSchema);