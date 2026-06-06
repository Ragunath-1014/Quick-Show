const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
    createBookingOrder,
    verifyPaymentAndBook,
    getMyBookings
} = require("../controllers/bookingController");


router.post("/create-order", protect, createBookingOrder);
router.post("/verify-payment", protect, verifyPaymentAndBook);
router.get("/my-bookings", protect, getMyBookings);

module.exports = router;