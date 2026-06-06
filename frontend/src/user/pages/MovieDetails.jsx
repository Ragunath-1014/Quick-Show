import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";

import { MovieContext } from "../../context/MovieContext";
import { ShowContext } from "../../context/ShowContext";

import api from "../../api/axios";
import Loader from "../../shared/Loader";
import AboutMovie from "../components/AboutMovie";
import ShowDetail from "../components/ShowDetail";

function MovieDetails() {

    const { movie, setMovie, setMovieDetails } = useContext(MovieContext);

    const {
        movieShows,
        setMovieShows,
        selectedDate,
        setSelectedDate,
    } = useContext(ShowContext);

    const { movieId } = useParams();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMovieById = async () => {
            try {
                setLoading(true);

                const [movieRes, showRes] = await Promise.all([
                    api.get(`/movie/${movieId}`),
                    api.get(`/show/movie/${movieId}`),
                ]);

                setMovie(movieRes.data);
                setMovieShows(showRes.data);

                if (showRes.data.length > 0) {
                    const firstDate = showRes.data[0].date
                    setSelectedDate(firstDate);
                }

            }
            catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchMovieById();
    }, [movieId]);

    if (!movie || !movieShows) {
        return <Loader loadingMessage={"Loading"} />
    }

    return (
        <section className="my-10 flex justify-center">
            <div className="w-full max-w-6xl">

                {/* MOVIE DETAILS */}
                <div className="flex items-center gap-5 px-5">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-40 sm:w-48 aspect-[2/3] rounded-xl object-cover"
                    />
                    <div className="flex flex-col gap-1">
                        <h1 className="font-semibold text-xl">
                            {movie.title}
                        </h1>
                        <div className="text-xs sm:text-sm text-gray-700 font-medium">
                            <p>
                                {movie.movieCertificate ? `${movie.movieCertificate} | ` : ""}
                                {movie.language ? `${movie.language}` : ""}
                                {movie.duration ? ` | ${movie.duration}` : ""}
                            </p>
                        </div>
                        <button
                            className="py-3 mt-3
                            rounded-lg text-black
                            cursor-pointer text-sm
                            font-semibold bg-white 
                            border border-black w-32
                            "
                            onClick={() => setMovieDetails(true)}
                        >
                            View Details
                        </button>
                    </div>
                </div>

                <AboutMovie />

                <ShowDetail movieId={movieId} />
            </div>
        </section>
    );
}

export default MovieDetails;