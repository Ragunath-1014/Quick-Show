const Show = require("../models/Show");

// AUTO UNLOCK LOCKED SEATS AFTER 5 MINUTES
const seatAutoRelease = (io) => {
    setInterval(async () => {
        try {
            const shows = await Show.find();
            const now = new Date();

            for (let show of shows) {
                let updated = false;

                for (let section of show.seats) {
                    for (let row of section.rows) {
                        for (let seat of row.seats) {
                            const isExpired =
                                seat.status === "Locked" &&
                                seat.lockedAt &&
                                (now - seat.lockedAt) > 5 * 60 * 1000;

                            if (isExpired) {
                                seat.status = "Available";
                                seat.lockedBy = null;
                                seat.lockedAt = null;

                                updated = true;
                            }
                        }
                    }
                }

                if (updated) {
                    await show.save();

                    const showId = show._id.toString();
                    io.to(showId).emit("seats-updated");
                }
            }
        }
        catch (err) {
            console.log(err.message);
        }
    }, 5000);
}

module.exports = seatAutoRelease;