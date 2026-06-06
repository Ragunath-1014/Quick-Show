import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";
import { ShowContext } from "../../context/ShowContext";

import api from "../../api/axios";
import Loader from "../../shared/Loader";
import TimerOut from "../components/TimerOut";

import cancel from "../../assets/icons/cancel.svg"
import profile from "../../assets/icons/profile.svg";

function ReviewBooking() {

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { setSelectedSeats, selectedSeats, setTimerOver } = useContext(ShowContext);

  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showId, setShowId] = useState(null);

  const [showDetails, setShowDetails] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);

  const [showOrderBreakdown, setShowOrderBreakdown] = useState(false);
  const [showBookingCharges, setShowBookingCharges] = useState(false);

  const tax = 40;
  const seatCount = ticketDetails?.seats?.length || 0;
  const ticketPrice = ticketDetails?.details?.price || 0;
  const subTotal = seatCount * ticketPrice;
  const totalAmount = subTotal + tax;
  const isNearExpiry = timeLeft <= 30;

  let sortedSeats = [];

  if (ticketDetails?.seats) {
    sortedSeats = [...ticketDetails.seats];

    sortedSeats.sort((a, b) => (
      a.localeCompare(b, undefined, { numeric: true })
    ));
  }

  if (!user) {
    navigate("/");
  }

  const getStoredBooking = () => {
    return JSON.parse(localStorage.getItem("selectedSeats"));
  }

  const clearStoredBooking = () => {
    return localStorage.removeItem("selectedSeats")
  }

  useEffect(() => {
    const storedBooking = getStoredBooking();

    if (!storedBooking) return;

    setTicketDetails(storedBooking);
    setShowId(storedBooking.showId);
  }, []);

  useEffect(() => {
    if (!showId) return;

    const fetchShowDetails = async () => {
      try {
        const res = await api.get(`/show/${showId}`);

        setShowDetails(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }

    fetchShowDetails();
  }, [showId]);

  const handleExpire = async () => {
    try {
      const storedBooking = getStoredBooking();

      if (storedBooking) {
        await api.post("/seat/release", { showId: storedBooking.showId });
      }
    }
    catch (err) {
      console.log(err);
    }

    clearStoredBooking();

    setSelectedSeats([]);

    setTimerOver(true);
  }

  useEffect(() => {
    const storedBooking = getStoredBooking();

    if (!storedBooking) return;

    const updateTimer = () => {

      // THIS GIVES THE TIME IN SECONDS - (BY CONVERTING THE MILLISECONDS TO SECONDS)
      const remainingSeconds = Math.floor((storedBooking.expiry - Date.now()) / 1000);

      if (remainingSeconds <= 0) {
        setTimeLeft(0);
        handleExpire();
        return;
      }

      setTimeLeft(remainingSeconds);
    }

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePayment = async () => {
    try {
      const storedBooking = getStoredBooking();

      // THIS GIVES REMAINING TIME IN MILLISECONDS
      const razorPayTimeleft = timeLeft * 1000;

      if (!storedBooking || Date.now() > storedBooking.expiry) {
        navigate(`/show/${showId}`);
      }

      setLoading(true);

      const { data: order } = await api.post("/booking/create-order", {
        amount: totalAmount
      });

      // OPEN RAZORPAY
      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Quick Show",
        description: "Ticket Payment",
        order_id: order.id,

        timeout: timeLeft,

        theme: {
          color: "#7C3AED"
        },

        handler: async (response) => {
          toast.dismiss();
          toast.success("You'll be redirected shortly");

          await api.post("/booking/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            showId,
            ticketDetails,
            selectedSeats,
            amount: totalAmount
          });

          toast.dismiss();
          toast.success("Ticket booked successfully");

          clearStoredBooking();

          setSelectedSeats([]);

          navigate("/myBookings");
        }
      }

      const razor = new window.Razorpay(options);
      razor.open();

      // SET TIMEOUT EXPECTS THE TIME IN MILLISECONDS, (Example: 300000 milliseconds -> 5 minutes)
      setTimeout(() => {
        if (razor.open) {
          razor.close();
          toast.dismiss();
          toast.error("Session expired");
        }
      }, razorPayTimeleft);
    }
    catch (err) {
      console.log(err);

      toast.dismiss();
      toast.error("Something went wrong");
    }
    finally {
      setLoading(false);
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return {
      day: date.getDate(),
      month: date.toLocaleString("en-US", { month: "short" }),
      weekday: date.toLocaleString("en-US", { weekday: "short" })
    }
  }

  if (!ticketDetails || !showDetails) {
    return <Loader loadingMessage={"Just a moment"} />
  }

  const { day, month, weekday } = formatDate(showDetails.date)

  return (
    <section>
      <TimerOut showId={showId} />

      {/* TIMER */}
      <div
        className="flex justify-center 
        py-2 gap-1 
        bg-purple-100 text-xs 
        sm:text-sm font-medium 
        sticky top-20"
      >
        <p>
          Complete your booking in
        </p>
        <p
          className={`
          ${timeLeft <= 60
              ? "text-red-600"
              : timeLeft <= 180
                ? "text-yellow-500"
                : "text-green-600"
            }
          `}
        >
          {formatTime(timeLeft)}
        </p>
        <p>
          mins
        </p>
      </div>

      {/* BOOKING OVERALL DETAILS */}
      <div className="md:flex md:justify-center md:items-center gap-5 xl:gap-10 px-5">
        <div
          className="border 
          border-gray-300
          rounded-2xl md:w-[500px] 
          xl:w-[600px] mt-8 
          md:mt-0 overflow-hidden"
        >

          {/* BOOKING TOP SECTION */}
          <div className="flex justify-between gap-2 items-center px-3 sm:px-5 pt-3 sm:pt-5">

            {/* MOVIE DETAILS */}
            <div className="flex flex-col gap-1 sm:gap-2">
              <h1 className="text-lg font-semibold">
                {showDetails.movie.title}
              </h1>
              <div className="text-xs sm:text-sm flex gap-1 font-medium">
                <p>
                  {showDetails.movie.movieCertificate} |
                </p>
                <p>
                  {showDetails.movie.language}
                </p>
              </div>
              <p className="text-xs sm:text-sm font-medium line-clamp-2">
                {showDetails.theatre.theatreName}
              </p>
            </div>

            {/* MOVIE POSTER */}
            <img
              src={showDetails.movie.poster}
              alt="movie-poster"
              className="w-20 aspect-[3/4] object-cover rounded-md"
            />
          </div>

          <hr className="my-4 border-gray-300 mx-3 sm:mx-5" />

          {/* BOOKING MIDDLE SECTION */}
          <div className="text-sm font-medium px-3 sm:px-5">
            <p>
              {weekday}, {day} {month}
            </p>
            <p>
              {showDetails.time}
            </p>
          </div>

          <hr className="my-4 border-gray-300 mx-3 sm:mx-5" />

          {/* BOOKING BOTTOM SECTION */}
          <div className="flex justify-between px-3 sm:px-5 pb-5">

            {/* SELECTED SEATS */}
            <div>
              <h1 className="text-lg font-semibold">
                {seatCount} {seatCount > 1 ? "Tickets" : "Ticket"}
              </h1>
              <div className="flex gap-1 items-center text-xs sm:text-sm font-medium">
                <p>
                  {ticketDetails?.details?.section || "N/A"} -
                </p>
                {
                  sortedSeats.map((seat, index) => (
                    <p key={index}>
                      {seat}
                    </p>
                  ))
                }
              </div>
            </div>

            {/* TOTAL AMOUNT */}
            <div>
              <p className="font-semibold">
                ₹ {subTotal}
              </p>
            </div>
          </div>

          {/* CANCELLATION UNAVAILABLE */}
          <div className="flex items-center gap-3 bg-gray-100 px-3 sm:px-5 py-2">
            <img
              src={cancel}
              alt="cancel"
            />
            <span className="text-xs text-gray-500 font-semibold">
              Cancellation is unavailable
            </span>
          </div>
        </div>

        {/* PAYMENT SUMMARY + PROFILE DETAILS */}
        <div className="mt-5 md:w-[500px] md:h-96">
          <div>
            <h1 className="text-lg font-semibold mt-6">
              Payment Summary
            </h1>

            <div className="mt-2 border border-gray-300 rounded-2xl p-3 sm:p-5">

              {/* Order details */}
              <div className="font-medium text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p>
                    Order amount
                  </p>
                  <i
                    className={`
                      ri-arrow-down-s-line inline-block 
                      transition-transform duration-300 
                      cursor-pointer
                      ${showOrderBreakdown ? "rotate-180" : "rotate-0"} text-lg
                      `}
                    onClick={() => setShowOrderBreakdown(!showOrderBreakdown)}
                  />
                </div>

                {/* ORDER AMOUNT */}
                <p>
                  ₹ {subTotal}.00
                </p>
              </div>

              {/* ORDER BREAKDOWN IN DETAIL */}
              {showOrderBreakdown &&
                <p className="text-xs sm:text-sm pl-5 pt-1 text-gray-700 font-medium">
                  {seatCount} X {ticketDetails.details.section} @ {ticketDetails.details.price}.00 each
                </p>
              }

              {/* BOOKING CHARGE */}
              <div className="font-medium text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p>
                    Booking charge (incl. of GST)
                  </p>
                  <i
                    className={`
                      ri-arrow-down-s-line inline-block 
                      transition-transform duration-300 
                      cursor-pointer
                      ${showBookingCharges ? "rotate-180" : "rotate-0"} text-lg
                      `}
                    onClick={() => setShowBookingCharges(!showBookingCharges)}
                  />
                </div>
                <p>
                  ₹ {tax}.00
                </p>
              </div>

              {/* BOOKING CHARGE IN DETAIL */}
              {showBookingCharges &&
                <div className="text-xs sm:text-sm pl-5 pt-1 text-gray-700 font-medium">
                  <p>
                    Booking Charge ₹30.00
                  </p>
                  <p>
                    IGST ₹10.00
                  </p>
                </div>
              }

              <hr className="my-4 border-gray-300" />

              {/* TOTAL AMOUNT */}
              <div className="flex justify-between font-semibold">
                <h1>
                  To be paid
                </h1>
                <h1>
                  ₹ {totalAmount}
                </h1>
              </div>
            </div>
          </div>

          {/* YOUR DETAILS */}
          <div className="mt-5">
            <h1 className="text-lg font-semibold">
              Your details
            </h1>
            <div
              className="mt-2 flex 
              gap-3 items-start 
              border border-gray-300 
              rounded-2xl p-3 
              sm:p-5"
            >
              <img
                src={profile}
                alt="profile"
                className="w-6 mt-1"
              />
              <div className="font-medium flex flex-col gap-1">
                <h1>
                  {user.name}
                </h1>
                <p className="text-sm">
                  {user.email}
                </p>
                <p className="text-sm text-gray-700">
                  TamilNadu
                </p>
              </div>
            </div>
          </div>

          {/* PROCEED TO PAY BUTTON */}
          <div className="flex justify-center md:justify-start">
            <div
              className={`mt-5 
              text-white font-bold 
              rounded-lg px-5 
              py-5 mb-5 
              w-80 flex
              justify-center items-center
              transition-all duration-200
              hover:bg-black/90
              ${isNearExpiry || loading
                  ? "bg-black/60 cursor-not-allowed"
                  : "bg-black cursor-pointer"
                }
            `}
              onClick={!isNearExpiry && !loading ? handlePayment : null}
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <span>
                    Processing
                  </span>
                  <div
                    className="h-4 w-4 
                    border-2 border-white 
                    border-t-transparent rounded-full 
                    animate-spin"
                  />
                </div>
              ) : (
                <div className="flex justify-between w-full">
                  <h1>
                    ₹ {totalAmount}
                  </h1>
                  <h1>
                    Pay now
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReviewBooking;