import { createContext, useState } from "react";

export const ShowContext = createContext();

function ShowProvider({ children }) {

    const [movieShows, setMovieShows] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDetails, setShowDetails] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [timerOver, setTimerOver] = useState(false);

    let value = {
        movieShows,
        setMovieShows,
        selectedDate,
        setSelectedDate,
        showDetails,
        setShowDetails,
        selectedSeats,
        setSelectedSeats,
        timerOver,
        setTimerOver,
    }

    return (
        <ShowContext.Provider value={value}>
            {children}
        </ShowContext.Provider>
    );
};

export default ShowProvider;