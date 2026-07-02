const Show = require("../models/Show");

const lockSeats = async (req, res) => {
    try {
        const { showId, seats } = req.body;
        const userId = req.user.id;

        seats.sort((a, b) =>
            a.localeCompare(b, undefined, { numeric: true })
        );

        const lockedSeats = [];

        for (const seatNumber of seats) {
            const result = await Show.updateOne(
                {
                    _id: showId,
                    "seats.rows.seats": {
                        $elemMatch: {
                            seatNumber,
                            status: "Available"
                        }
                    }
                },
                {
                    $set: {
                        "seats.$[].rows.$[].seats.$[seat].status": "Locked",
                        "seats.$[].rows.$[].seats.$[seat].lockedBy": userId,
                        "seats.$[].rows.$[].seats.$[seat].lockedAt": new Date()
                    }
                },
                {
                    arrayFilters: [
                        {
                            "seat.seatNumber": seatNumber,
                            "seat.status": "Available"
                        }
                    ]
                }
            );

            if (result.modifiedCount === 0) {

                // ROLLBACK PREVIOUSLY LOCKED SEATS
                for (const lockedSeat of lockedSeats) {
                    await Show.updateOne(
                        { _id: showId },
                        {
                            $set: {
                                "seats.$[].rows.$[].seats.$[seat].status": "Available",
                                "seats.$[].rows.$[].seats.$[seat].lockedBy": null,
                                "seats.$[].rows.$[].seats.$[seat].lockedAt": null
                            }
                        },
                        {
                            arrayFilters: [
                                {
                                    "seat.seatNumber": lockedSeat,
                                    "seat.lockedBy": userId
                                }
                            ]
                        }
                    );
                }

                return res.status(400).json({
                    message: `${seatNumber} is already unavailable`
                });
            }

            lockedSeats.push(seatNumber);
        }

        const io = req.app.get("io");
        io.to(showId).emit("seats-updated");

        return res.status(200).json({
            message: "Seats locked successfully"
        });

    }
    catch (err) {
        return res.status(500).json({
            message: "Error in locking seats"
        });
    }
}

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
        res.status(500).json({
            message: "Error in releasing seats"
        });
    }
}

module.exports = { lockSeats, releaseSeats };