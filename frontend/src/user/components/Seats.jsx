import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";
import { ShowContext } from "../../context/ShowContext";

import api from "../../api/axios";
import SwitchSeats from "./SwitchSeats";
import NoLongerSeat from "./NoLongerSeat";
import Loader from "../../shared/Loader";
import socket from "../../socket";

import screen from "../../assets/images/screen.png";
import logo from "../../assets/icons/logo.svg";

function Seats({ showId, refreshSeats }) {

    const { user } = useContext(AuthContext);
    const { showDetails, selectedSeats, setSelectedSeats } = useContext(ShowContext);

    const navigate = useNavigate();

    const [theatreSection, setTheatreSection] = useState(null);
    const [noLongerSeat, setNoLongerSeat] = useState(false);
    const [seatChange, setSeatChange] = useState(false);
    const [theatreDetails, setTheatreDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const stored = JSON.parse(localStorage.getItem("selectedSeats"));

    let DefaultButtonText = false;

    if (stored && Array.isArray(stored.seats)) {
        const isSame = stored.seats.length === selectedSeats.length &&
            stored.seats.every((seat) =>
                selectedSeats.includes(seat)
            );

        if (isSame) {
            DefaultButtonText = true;
        }
    }

    useEffect(() => {
        if (stored && stored.expiry > Date.now() && stored.showId === showId) {
            setSelectedSeats(stored.seats || []);
            setTheatreSection(stored.section || null);
            setTheatreDetails(stored.details || null);
        }
        else {
            setSelectedSeats([]);
            setTheatreSection(null);
            setTheatreDetails(null);
        }
    }, [showId]);

    useEffect(() => {
        const unavailableSeats = [];

        for (let section of showDetails.seats) {
            for (let row of section.rows) {
                for (let seat of row.seats) {
                    const isUnavailable =
                        seat.status === "Booked" ||
                        (seat.status === "Locked" && seat.lockedBy !== user?._id);

                    if (isUnavailable) {
                        unavailableSeats.push(seat.seatNumber);
                    }
                }
            }
        }

        const hasUnavailableSelectedSeat = selectedSeats.some((seatNumber) =>
            unavailableSeats.includes(seatNumber)
        );

        if (hasUnavailableSelectedSeat) {
            setNoLongerSeat(true);
        }

        setSelectedSeats((prevSeat) =>
            prevSeat.filter((seatNumber) =>
                !unavailableSeats.includes(seatNumber)
            )
        );

    }, [showDetails, user]);

    const handleSeatClick = (seat, seatSection) => {

        setTheatreDetails(seatSection);

        if (selectedSeats.length === 5 && !selectedSeats.includes(seat.seatNumber)) {
            toast.dismiss();
            return toast.error("Seat limit reached");
        }

        if (seat.status === "Booked" || (seat.status === "Locked" && seat.lockedBy !== user?._id)) {
            setSelectedSeats([]);
            return setNoLongerSeat(true);
        }

        if (selectedSeats.length > 0 && theatreSection && theatreSection !== seatSection.section) {
            setTheatreSection(seatSection.section);
            setSelectedSeats([seat.seatNumber]);
            return setSeatChange(true);
        }

        setTheatreSection(seatSection.section);

        setSelectedSeats((prevSeats) => {
            if (prevSeats.includes(seat.seatNumber)) {
                return prevSeats.filter((prevSeat) =>
                    prevSeat !== seat.seatNumber
                );
            }

            return [...prevSeats, seat.seatNumber];
        });
    }

    const handleLockSeats = async () => {
        try {
            await api.post("/seat/lock", { showId, seats: selectedSeats });

            const expiry = Date.now() + 5 * 60 * 1000;

            localStorage.setItem("selectedSeats", JSON.stringify({
                showId,
                seats: selectedSeats,
                section: theatreSection,
                details: theatreDetails,
                expiry
            }));
        }
        catch (err) {
            console.log(err.message);

            toast.dismiss();
            toast.error("Something went wrong");
        }
    }

    const handleProceed = async () => {
        try {
            if (!user) {
                toast.dismiss();
                toast.error("Login to reserve your seats");

                setSelectedSeats([]);
                return;
            }

            setLoading(true);

            if (stored && Array.isArray(stored.seats)) {

                const isSame = stored.seats.length === selectedSeats.length &&
                    stored.seats.every((seat) =>
                        selectedSeats.includes(seat)
                    );

                if (isSame) {
                    return navigate("/review/booking");
                }
                else {
                    try {
                        await api.post("/seat/release", { showId: showId });
                    }
                    catch (err) {
                        console.log(err.message);
                    }
                }
            }

            await handleLockSeats();

            setLoading(false);

            navigate("/review/booking");
        }
        catch (err) {
            console.log(err.message);

            toast.dismiss();
            toast.error("Something went wrong");
        }
    }

    const date = new Date(showDetails.date);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const weekday = date.toLocaleString("en-US", { weekday: "short" });

    return (
        <div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto mt-5 px-5 pb-[105px] sm:pb-6">

                {/* SHOW INFO */}
                <div className="text-xs sm:text-sm text-black text-center px-5">
                    <p className="underline underline-offset-1">
                        {`${showDetails.movie.title} - ${weekday} ${day} ${month}, ${showDetails.time} at ${showDetails.theatre.theatreName}`}
                    </p>
                </div>

                {/* SEATS UI */}
                <div className="overflow-x-auto">
                    {showDetails.seats.map((seatsBySection) => (
                        <div
                            key={seatsBySection._id}
                            className="flex flex-col items-center min-w-max"
                        >

                            {/* SECTION HEADER */}
                            <span className="text-sm sm:text-base font-semibold mt-5">
                                {seatsBySection.section.toUpperCase()} : ₹{seatsBySection.price}
                            </span>

                            {/* SEATS BY ROWS */}
                            {seatsBySection.rows.map((row) => (
                                <div
                                    key={row._id}
                                    className="flex items-center"
                                >

                                    {/* ROW NAME (Example - A B C) */}
                                    <span className="text-sm sm:text-base font-semibold mt-3 w-8">
                                        {row.row}
                                    </span>

                                    {/* SEATS */}
                                    <div className="flex items-center mt-3 gap-3">
                                        {row.seats.map((seat, index) => (
                                            <button
                                                key={seat._id}
                                                className={`
                                                w-8 h-8
                                                sm:w-10 sm:h-10
                                                border border-gray-300
                                                rounded-md shrink-0 
                                                text-xs sm:text-sm
                                                flex items-center
                                                justify-center
                                                ${index === 10 ? "ml-24" : ""}
                                                ${selectedSeats.includes(seat.seatNumber)
                                                        ? "bg-purple-500 border-purple-500 text-white"
                                                        : ""
                                                    }
                                                ${seat.status === "Booked" || (seat.status === "Locked" && seat.lockedBy !== user?._id)
                                                        ? "bg-gray-100 disabled"
                                                        : ""
                                                    }
                                                `}
                                                onClick={() => handleSeatClick(seat, seatsBySection)}
                                            >
                                                {(seat.status === "Booked") || (seat.status === "Locked" && seat.lockedBy !== user?._id)
                                                    ? (<i className="ri-close-line text-gray-500/60 text-base" />)
                                                    : (seat.seatNumber)
                                                }
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* SCREEN IMAGE*/}
                <div className="flex justify-center pt-10">
                    <img
                        src={screen}
                        alt="screen"
                        className="w-full max-w-3xl object-contain"
                    />
                </div>
            </div>

            {/* PROCEED BUTTON */}
            <div
                className={`
                z-30 fixed 
                left-0 right-0 
                bottom-0 bg-white 
                h-16 transform 
                transition-transform duration-500 
                ease-in-out
                ${selectedSeats.length > 0 ? "translate-y-0" : "translate-y-full"}
                `}
            >
                <div className="flex items-center justify-evenly gap-20">
                    <div className="flex flex-col font-medium">
                        <p className="text-sm text-gray-700">
                            Selected
                        </p>
                        <h1>
                            {selectedSeats.length} {selectedSeats.length > 1 ? "Seats" : "Seat"}
                        </h1>
                    </div>
                    <button
                        onClick={handleProceed}
                        disabled={loading}
                        className={`
                        w-36 rounded-lg 
                        px-3 py-3
                        text-white text-sm font-semibold
                        flex items-center justify-center
                        transition-all duration-200
                        hover:bg-black/90
                        ${loading
                                ? "bg-black/60 cursor-not-allowed"
                                : "bg-black"}
                        `}
                    >
                        {loading
                            ? (
                                <div className="flex items-center gap-2">
                                    <span>
                                        {DefaultButtonText ? "Continuing" : "Processing"}
                                    </span>
                                    <div
                                        className="h-4 w-4 
                                        border-2 border-white 
                                        border-t-transparent rounded-full 
                                        animate-spin"
                                    />
                                </div>
                            )
                            : (
                                <span>
                                    {DefaultButtonText ? "Continue" : "Proceed"}
                                </span>
                            )}
                    </button>
                </div>
            </div>

            <NoLongerSeat
                noLongerSeat={noLongerSeat}
                setNoLongerSeat={setNoLongerSeat}
            />

            <SwitchSeats
                setSeatChange={setSeatChange}
                seatChange={seatChange}
                theatreSection={theatreSection}
                theatreDetails={theatreDetails}
            />
        </div>
    );
}

export default Seats;