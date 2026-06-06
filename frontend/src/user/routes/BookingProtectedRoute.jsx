import { Navigate } from "react-router-dom";

function BookingProtectedRoute({ children }) {
    const stored = JSON.parse(localStorage.getItem("selectedSeats"));

    if (!stored) {
        return <Navigate to={"/"} />
    }

    if (Date.now > stored.expiry) {
        localStorage.removeItem("selectedSeats");
        return <Navigate to={`/show/${stored.showId}`} />;
    }

    return children;
}

export default BookingProtectedRoute;