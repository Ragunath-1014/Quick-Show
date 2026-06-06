const Show = require("../models/Show");

const lockSeats = async (req, res) => {
    try {
        const { showId, seats } = req.body;

        const userId = req.user.id;
        const show = await Show.findById(showId);

        if (!show) {
            return res.status(404).json({
                message: "Show not found"
            });
        }

        // UPDATE SEATS STATUS
        for (let section of show.seats) {
            for (let row of section.rows) {
                for (let seat of row.seats) {
                    if (seats.includes(seat.seatNumber)) {
                        if (seat.status === "Booked" || seat.status === "Locked") {
                            return res.status(400).json({
                                message: `${seat.seatNumber} is already unavailable`
                            });
                        }
                        seat.status = "Locked";
                        seat.lockedBy = userId;
                        seat.lockedAt = new Date();
                    }
                }
            }
        }

        await show.save();

        const io = req.app.get("io");
        io.to(showId).emit("seats-updated");

        res.status(200).json({
            message: "Seats locked successfully"
        });
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Error in Locking seats"
        });
    }
};

const releaseSeats = async (req, res) => {
    try {
        const { showId } = req.body;

        const userId = req.user.id;
        const show = await Show.findById(showId);

        if (!show) {
            return res.status(404).json({
                message: "Show not found"
            });
        }

        // UPDATE SEATS STATUS
        for (let section of show.seats) {
            for (let row of section.rows) {
                for (let seat of row.seats) {
                    if (seat.status === "Locked" && seat.lockedBy?.toString() === userId.toString()) {
                        seat.status = "Available";
                        seat.lockedBy = null;
                        seat.lockedAt = null;
                    }
                }
            }
        }

        await show.save();

        const io = req.app.get("io");
        io.to(showId).emit("seats-updated");

        res.status(200).json({
            message: "Seats released successfully"
        });
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Error in releasing seats"
        });
    }
};

module.exports = { lockSeats, releaseSeats };