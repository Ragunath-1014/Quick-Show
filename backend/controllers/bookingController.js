const Show = require("../models/Show");
const Booking = require("../models/Booking");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");

const createBookingOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(201).json(order);
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const verifyPaymentAndBook = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        showId,
        selectedSeats,
        ticketDetails,
        amount
    } = req.body;

    const userId = req.user.id;
    const userName = req.user.name;

    try {

        // VERIFY SIGNATURE
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (expectedSign !== razorpay_signature) {
            return res.status(400).json({
                message: "Payment verification failed"
            });
        }

        // UPDATE SEATS STATUS
        const show = await Show.findById(showId);

        for (let section of show.seats) {
            for (let row of section.rows) {
                for (let seat of row.seats) {

                    if (selectedSeats.includes(seat.seatNumber)) {

                        if (!seat.lockedBy || seat.lockedBy.toString() !== userId.toString()) {
                            return res.status(400).json({
                                message: "Not your seat"
                            });
                        }

                        seat.status = "Booked";
                    }

                }
            }
        }

        await show.save();

        const booking = await Booking.create({
            user: userId,
            userName: userName,
            show: showId,
            seats: selectedSeats,
            section: ticketDetails.section,
            totalPrice: amount,
            paymentStatus: "Paid",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id
        });

        const io = req.app.get("io");
        io.to(showId).emit("refresh-seats");

        res.status(200).json({
            message: "Booking successful",
            booking
        });

    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate({
                path: "show",
                populate: {
                    path: "movie theatre"
                }
            })
            .sort({ createdAt: -1 });

        if (!bookings) {
            return res.status(400).json({
                message: "No bookings found"
            });
        }

        res.status(200).json(bookings);
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { createBookingOrder, verifyPaymentAndBook, getMyBookings };