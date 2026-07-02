import { useContext, useEffect } from "react";

import { MovieContext } from "../../context/MovieContext";

import TrailerModal from "./TrailerModal";

import film from "../../assets/icons/film.svg";
import language from "../../assets/icons/language.svg";
import masks from "../../assets/icons/masks.svg";

function AboutMovie() {

    const {
        movie,
        movieDetails,
        setMovieDetails,
        showTrailer,
        setShowTrailer
    } = useContext(MovieContext);

    useEffect(() => {
        if (movieDetails) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [movieDetails]);

    const links = [
        { name: "Description", id: "description" },
        { name: "Cast & Crew", id: "castAndCrew" },
        { name: "Videos", id: "videos" },
        { name: "Posters", id: "posters" }
    ];

    const handleScroll = (id) => {
        const isDesktop = window.innerWidth >= 640;
        const finalId = isDesktop ? `${id}-desktop` : `${id}-mobile`;

        const element = document.getElementById(finalId);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    return (
        <div>

            {/* OVERLAY */}
            {movieDetails && (
                <div className="fixed inset-0 bg-black/60 z-40"
                    onClick={() => setMovieDetails(false)}
                />
            )}

            {/* MOBILE VIEW */}
            <div
                className={`
                fixed bottom-0 
                left-0 w-full 
                bg-white z-50 
                rounded-t-3xl transform 
                transition-transform 
                duration-500 sm:hidden
                ${movieDetails ? "translate-y-0" : "translate-y-full"}
                `}
            >

                {/* FIXED HEADER + TABS */}
                <div
                    className="sticky top-0 
                    z-20 rounded-t-3xl 
                    px-5 pt-5 
                    pb-3 shadow"
                >

                    {/* HEADER */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg font-semibold">
                            Movie Details
                        </h1>
                        <button
                            className="flex items-center 
                            justify-center w-8 
                            h-8 bg-gray-300/40 
                            rounded-full
                            "
                            onClick={() => setMovieDetails(false)}
                        >
                            <i className="ri-close-line text-lg font-medium" />
                        </button>
                    </div>

                    {/* MOVIE TITLE */}
                    <p className="text-xs font-medium mt-1">
                        {movie.title}
                    </p>

                    {/* TABS */}
                    <div className="mt-4">
                        <ul className="flex gap-6 font-semibold text-sm overflow-x-auto">
                            {links.map((link, index) => (
                                <li key={index}>
                                    <button onClick={() => handleScroll(link.id)}
                                        className="whitespace-nowrap"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="pb-10 max-h-[65vh] overflow-y-auto">

                    {/* DESCRIPTION */}
                    <div id="description-mobile" className="mt-5 scroll-mt-2 text-sm mx-5">
                        <h2 className="font-semibold text-base">
                            Description
                        </h2>
                        <p className="mt-2">
                            {movie.description}
                        </p>
                        <div className="flex gap-2 mt-4">
                            {movie.movieCertificate &&
                                <img
                                    src={film}
                                    alt="film-certificate"
                                    className="w-6"
                                />
                            }
                            <p>
                                {movie.movieCertificate}
                            </p>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <img
                                src={language}
                                alt="film-language"
                                className="w-6"
                            />
                            <p>
                                {movie.language}
                            </p>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <img
                                src={masks}
                                alt="film-category"
                                className="w-6"
                            />
                            <p>
                                {movie.category}
                            </p>
                        </div>
                    </div>

                    {/* CAST */}
                    <div id="castAndCrew-mobile" className="mt-8 scroll-mt-2">
                        <h2 className="font-semibold text-base mx-5">
                            Cast & Crew
                        </h2>
                        <div className="overflow-x-auto flex gap-3 mt-4 px-3">
                            {movie.cast.map((cast) => (
                                <div
                                    key={cast._id}
                                    className="flex flex-col items-center text-center flex-shrink-0"
                                >
                                    <div className="w-20 h-20  rounded-full overflow-hidden">
                                        <img
                                            src={cast.image}
                                            alt={cast.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="text-xs mt-2 font-medium w-24 line-clamp-2">
                                        {cast.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TRAILER / VIDEOS */}
                    <div id="videos-mobile" className="mt-8 scroll-mt-2 mx-5">
                        <h2 className="font-semibold text-base">
                            Videos
                        </h2>
                        <div className="mt-4 relative w-40">
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-40 aspect-[2/3] object-cover rounded-xl"
                            />

                            <button
                                className="absolute inset-0
                                flex items-center 
                                justify-center
                                "
                                onClick={() => setShowTrailer(true)}
                            >
                                <div
                                    className="
                                    w-10 h-10
                                    bg-black/70
                                    rounded-full
                                    flex items-center justify-center"
                                >
                                    <i className="ri-play-large-line text-lg text-white" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* POSTERS */}
                    <div id="posters-mobile" className="mt-8 scroll-mt-2 mx-5">
                        <h2 className="font-semibold text-base">
                            Posters
                        </h2>
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="mt-3 rounded-2xl w-96"
                        />
                    </div>
                </div>
            </div>

            {/* DESKTOP VIEW */}
            <div
                className={`
                hidden sm:fixed 
                sm:top-0 sm:right-0 
                sm:max-w-screen-sm sm:bg-white
                sm:z-50 sm:transform 
                sm:transition-transform sm:duration-500 
                sm:block sm:h-full
                ${movieDetails ? "sm:translate-x-0" : "sm:translate-x-full"}
                `}
            >

                {/* FIXED HEADER + TABS */}
                <div
                    className="sticky top-0 
                    z-20 rounded-t-3xl 
                    px-5 pt-5 
                    pb-3 shadow"
                >

                    {/* HEADER */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg font-semibold">
                            Movie Details
                        </h1>
                        <button
                            className="flex items-center 
                            justify-center w-8 
                            h-8 bg-gray-300/40 
                            rounded-full
                            "
                            onClick={() => setMovieDetails(false)}
                        >
                            <i className="ri-close-line text-lg font-medium" />
                        </button>
                    </div>

                    {/* MOVIE TITLE */}
                    <p className="text-xs mt-1">
                        {movie.title}
                    </p>

                    {/* TABS */}
                    <div className="mt-4">
                        <ul className="flex gap-6 font-semibold text-sm overflow-x-auto">
                            {links.map((link, index) => (
                                <li key={index}>
                                    <button onClick={() => handleScroll(link.id)}
                                        className="whitespace-nowrap"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="px-5 pb-10 max-h-[85vh] overflow-y-auto">

                    {/* DESCRIPTION */}
                    <div id="description-desktop" className="mt-5 scroll-mt-2 text-sm">
                        <h2 className="font-semibold text-base">
                            Description
                        </h2>
                        <p className="mt-2">
                            {movie.description}
                        </p>
                        <div className="flex gap-2 mt-4">
                            {movie.movieCertificate &&
                                <img
                                    src={film}
                                    alt="film-certificate"
                                    className="w-6"
                                />
                            }
                            <p>
                                {movie.movieCertificate}
                            </p>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <img
                                src={language}
                                alt="film-language"
                                className="w-6"
                            />
                            <p>
                                {movie.language}
                            </p>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <img
                                src={masks}
                                alt="film-category"
                                className="w-6"
                            />
                            <p>
                                {movie.category}
                            </p>
                        </div>
                    </div>

                    {/* CAST */}
                    <div id="castAndCrew-desktop" className="mt-8 scroll-mt-2">
                        <h2 className="font-semibold text-base">
                            Cast & Crew
                        </h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-5 mt-4">
                            {movie.cast.map((cast) => (
                                <div key={cast._id}
                                    className="flex flex-col items-center text-center"
                                >
                                    <img
                                        src={cast.image}
                                        alt={cast.name}
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                                    />
                                    <p className="text-xs mt-2 font-medium">
                                        {cast.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TRAILER / VIDEOS */}
                    <div id="videos-desktop" className="mt-8 scroll-mt-2">
                        <h2 className="font-semibold text-base">
                            Videos
                        </h2>
                        <div className="mt-4 relative w-40">
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-40 aspect-[2/3] object-cover rounded-xl"
                            />

                            <button
                                className="absolute inset-0
                                flex items-center 
                                justify-center
                                "
                                onClick={() => setShowTrailer(true)}
                            >
                                <div
                                    className="w-10 h-10
                                    bg-black/80 rounded-full
                                    flex items-center
                                    justify-center"
                                >
                                    <i className="ri-play-large-line text-lg text-white" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* POSTERS */}
                    <div id="posters-desktop" className="mt-8 scroll-mt-2">
                        <h2 className="font-semibold text-base">
                            Posters
                        </h2>
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="mt-3 rounded-2xl w-80"
                        />
                    </div>
                </div>
            </div >

            {/* TRAILER MODAL - It is Disaplyed when setShowTraile(true) */}
            {
                showTrailer && (
                    <TrailerModal />
                )
            }
        </div >
    );
}

export default AboutMovie;