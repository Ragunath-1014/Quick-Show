import { useContext } from "react";

import { MovieContext } from "../../context/MovieContext";

function TrailerModal() {

    const { movie, setShowTrailer } = useContext(MovieContext);

    return (
        <section
            className="fixed inset-0 
            bg-black/60 backdrop-blur-sm 
            flex items-center 
            justify-center z-[60] 
            p-4"
        >
            <div className="w-full max-w-6xl aspect-video relative">

                {/* TRAILER / VIDEO */}
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1`}
                    title="Trailer"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />

                {/* CLOSE BUTTON */}
                <button
                    className="flex items-center 
                    justify-center w-5 
                    h-5 sm:w-6 
                    sm:h-6 md:w-8 
                    md:h-8 bg-gray-200/10 
                    rounded-full text-white 
                    top-2 right-2 
                    sm:top-3 sm:right-3 
                    md:top-5 md:right-5
                    absolute
                    "
                    onClick={() => setShowTrailer(false)}
                >
                    <i className="ri-close-line font-medium text-sm sm:text-base md:text-lg" />
                </button>
            </div>
        </section>
    );
}

export default TrailerModal;