import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

import api from "../../api/axios";
import Loader from "../../shared/Loader";

import qr from "../../assets/images/qr.jpg";
import noBookings from "../../assets/images/noBookings.png";

function Bookings() {

    const { user } = useContext(AuthContext);

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTicketDetails, setShowTicketDetails] = useState(null);

    useEffect(() => {
        if (!user) {
            setBookings([]);
            return;
        }

        const fetchBookingDetail = async () => {
            try {
                setLoading(true);
                const res = await api.get("/booking/my-bookings");
                setBookings(res.data);
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchBookingDetail();
    }, [user]);

    if (loading) {
        return <Loader loadingMessage={"Loading"} />;
    }

    return (
        <div className="px-5">

            {/* HEADER / EMPTY STATE */}
            {bookings.length === 0 || !user
                ? (
                    <div className="flex flex-col justify-center items-center h-[75vh]">
                        <img
                            src={noBookings}
                            alt="no-bookings"
                            className="w-64"
                        />
                        <h1 className="text-2xl font-semibold">
                            No bookings yet!
                        </h1>
                    </div>
                )
                : (
                    <div className="flex flex-col items-center mt-5">
                        <h1 className="text-2xl font-bold">
                            My Bookings
                        </h1>

                        <p className="text-gray-500 text-xs text-center sm:text-sm font-medium">
                            Check your tickets, dates, and showtimes
                        </p>
                    </div>
                )}

            {/* BOOKINGS LIST */}
            {user && bookings.length > 0 &&
                bookings.map((booking) => {
                    const date = new Date(booking.show.date);
                    const day = date.getDate();
                    const month = date.toLocaleString("en-US", { month: "short" });
                    const weekday = date.toLocaleString("en-US", { weekday: "short" });
                    let sortedSeats = [];

                    if (booking.seats) {
                        sortedSeats = [...booking.seats];

                        sortedSeats.sort((a, b) => (
                            a.localeCompare(b, undefined, { numeric: true })
                        ));
                    }
                    return (
                        <div
                            key={booking._id}
                            className="flex justify-center py-1 my-4"
                        >

                            {/* BOOKING CARD */}
                            <div
                                className="flex items-start 
                                gap-5 border 
                                border-gray-300/80 rounded-xl 
                                p-3 w-[450px] 
                                sm:w-[500px] lg:w-[600px]"
                            >
                                <img
                                    src={booking.show.movie.poster}
                                    alt="movie-poster"
                                    className="w-24 sm:w-28 aspect-[3/4] object-cover rounded-md"
                                />

                                <div>
                                    <h1 className="font-semibold line-clamp-1 mt-1">
                                        {booking.show.movie.title}
                                    </h1>
                                    <h1 className="text-sm font-medium line-clamp-1">
                                        {booking.show.theatre.theatreName}
                                    </h1>
                                    <button
                                        className="px-2 py-3 rounded-md w-28 bg-black text-sm font-semibold text-white mt-5"
                                        onClick={() => setShowTicketDetails(booking._id)}
                                    >
                                        View details
                                    </button>
                                </div>
                            </div>

                            {/* MODAl */}
                            {showTicketDetails === booking._id && (
                                <div
                                    className="fixed inset-0 
                                    flex justify-center 
                                    items-center bg-black/40 
                                    backdrop-blur-sm z-50"
                                >
                                    <div
                                        className="bg-white py-5 
                                        mx-4 rounded-2xl 
                                        w-full sm:w-[480px] 
                                        overflow-hidden"
                                    >

                                        {/* BACK BUTTON*/}
                                        <div
                                            className="flex items-center gap-1 px-3 cursor-pointer"
                                            onClick={() => setShowTicketDetails(null)}
                                        >
                                            <i className="ri-arrow-left-line" />
                                            <p className="text-sm font-semibold">Back</p>
                                        </div>

                                        {/* TOP */}
                                        <div className="flex justify-between pt-8 px-5 sm:px-8 gap-4">

                                            {/* SHOW DETAILS */}
                                            <div className="text-sm flex flex-col gap-4 min-w-0">
                                                <h1 className="font-semibold text-base">
                                                    {booking.show.movie.title}
                                                </h1>

                                                <div className="flex flex-wrap gap-3">
                                                    <p className="bg-black text-white px-3 py-1 rounded">
                                                        {booking.show.movie.movieCertificate}
                                                    </p>
                                                    <p className="bg-black text-white px-3 py-1 rounded">
                                                        {booking.show.movie.language}
                                                    </p>
                                                </div>

                                                <p className="font-medium max-w-[220px] line-clamp-2">
                                                    {booking.show.theatre.theatreName}
                                                </p>
                                            </div>

                                            <img
                                                src={booking.show.movie.poster}
                                                className="w-24 h-32 object-cover rounded-2xl flex-shrink-0"
                                            />
                                        </div>

                                        {/* DIVIDER */}
                                        <div className="flex items-center gap-3 my-5 px-5 sm:px-8">
                                            <hr className="flex-1 border-t-2 border-dashed border-black" />
                                            <p className="text-xs font-semibold text-black">
                                                Scan QR at Cinema
                                            </p>
                                            <hr className="flex-1 border-t-2 border-dashed border-black" />
                                        </div>

                                        {/* BOTTOM */}
                                        <div className="flex gap-5 justify-between items-start px-5 pb-5 sm:px-8">

                                            {/* SHOW TIMING, SEATS AND QR DETAILS */}
                                            <div className="text-sm font-semibold">
                                                <div className="mb-5">
                                                    <p className="text-black">
                                                        {`${weekday} ${day} ${month}`}
                                                    </p>
                                                    <p>
                                                        {booking.show.time}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-start gap-1">
                                                    <p>Seats :</p>
                                                    <div className="flex gap-1 flex-wrap">
                                                        <p>{booking.section} -</p>
                                                        {sortedSeats.map((seat, i) => (
                                                            <p key={i}>
                                                                {seat}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <img src={qr} className="w-20 rounded-md" alt="qr-code" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            }
        </div>
    );
}

export default Bookings;