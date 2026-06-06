import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { ShowContext } from "../../context/ShowContext";

import api from "../../api/axios";
import Loader from "../../shared/Loader";

import caption from "../../assets/icons/caption.svg";

const ShowDetail = ({ movieId }) => {

    const navigate = useNavigate();

    const {
        movieShows,
        setMovieShows,
        selectedDate,
        setSelectedDate,
    } = useContext(ShowContext);

    const filteredShows = movieShows.filter((movieShow) => {
        return movieShow.date === selectedDate;
    });

    return (
        <div className="mt-10">

            {/* DATE SELECTOR */}
            <div className="overflow-x-auto w-full flex gap-3 px-5 ">
                {movieShows.map((movieShow) => {
                    const date = new Date(movieShow.date);
                    const dateKey = date.toDateString();
                    const day = date.getDate();
                    const month = date.toLocaleString("en-US", { month: "short" });
                    const weekday = date.toLocaleString("en-US", { weekday: "short" });

                    return (
                        <div
                            key={movieShow.date}
                            className={`
                            w-[70px] text-center 
                            cursor-pointer p-3 
                            rounded-2xl
                            ${selectedDate === dateKey ? "bg-black text-white" : ""}
                            `}
                            onClick={() => setSelectedDate(dateKey)}
                        >
                            <p className="text-sm">
                                {weekday}
                            </p>
                            <p className="text-lg font-bold">
                                {day}
                            </p>
                            <p className="text-sm">
                                {month}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* BORDER */}
            <p className="border-t border-gray-300/80 mt-5" />

            {/* ABOUT SHOWS - ONLY FOR UI */}
            {movieShows.length > 0 &&
                < div
                    className="bg-gray-100 
                    w-full mt-5 
                    py-2 px-3 
                    text-black rounded 
                    flex gap-3 
                    overflow-x-auto whitespace-nowrap
                    font-medium"
                >
                    <div className="text-xs sm:text-sm flex gap-1 items-center">
                        <img
                            src={caption}
                            alt="caption"
                            className="w-4 sm:w-5"
                        />
                        <p>
                            English subtitle
                        </p>
                    </div>

                    <div className="text-xs sm:text-sm flex gap-1 items-center ml-5">
                        <i className="ri-circle-fill text-xs text-black" />
                        <p>
                            Available
                        </p>
                    </div>

                    <div className="text-xs sm:text-sm flex gap-1 items-center ml-2">
                        <i className="ri-circle-fill text-xs text-yellow-400" />
                        <p>
                            Filling fast
                        </p>
                    </div>

                    <div className="text-xs sm:text-sm flex gap-1 items-center ml-2">
                        <i className="ri-circle-fill text-xs text-red-500" />
                        <p>
                            Almost full
                        </p>
                    </div>
                </div>
            }

            {/* SHOWS TIMINGS */}
            <div className="px-5">
                {filteredShows.length === 0
                    ? (
                        <p className="flex items-center justify-center h-[30vh] font-medium text-lg">
                            Coming Soon!
                        </p>
                    )
                    : (
                        filteredShows.map((show) => (
                            <div key={show.date}>
                                {show.theatres.map((theatre) => (
                                    <div key={theatre.theatreName}>

                                        {/* THEATRE INFO */}
                                        <div className="flex items-center gap-2 mt-8">
                                            <img
                                                src={theatre.theatreLogo}
                                                alt={theatre.theatreName}
                                                className="w-16 h-16 border border-gray-300 rounded-full"
                                            />
                                            <div>
                                                <h1 className="font-semibold">
                                                    {theatre.theatreName}
                                                </h1>
                                                <p className="text-gray-700 text-sm font-medium">
                                                    {theatre.cancellationPolicy}
                                                </p>
                                            </div>
                                        </div>

                                        {/* SHOW TIMINGS */}
                                        <div className="flex flex-wrap gap-5 mt-5">
                                            {theatre.shows.map((showTiming) => (
                                                <button
                                                    key={showTiming._id}
                                                    className="border border-black/20 w-24 py-2 rounded-lg"
                                                    onClick={() => navigate(`/show/${showTiming._id}`)}
                                                >
                                                    {showTiming.time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )
                }
            </div>
        </div >
    );
};

export default ShowDetail;