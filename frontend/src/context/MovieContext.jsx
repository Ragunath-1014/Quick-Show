import { createContext, useState } from "react";

export const MovieContext = createContext();

function MovieProvider({ children }) {
    const [movie, setMovie] = useState(null);
    const [movieDetails, setMovieDetails] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);

    let value = {
        movie,
        setMovie,
        movieDetails,
        setMovieDetails,
        showTrailer,
        setShowTrailer
    }

    return (
        <MovieContext.Provider value={value}>
            {children}
        </MovieContext.Provider>
    );
};

export default MovieProvider;