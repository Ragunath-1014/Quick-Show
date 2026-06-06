import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// USER LAYOUT
import UserLayout from "./user/layout/UserLayout";

// USER PAGES
import Login from "./user/pages/Login";
import Signup from "./user/pages/Signup";
import Home from "./user/pages/Home";
import MovieDetails from "./user/pages/MovieDetails";
import SeatSelection from "./user/pages/SeatSelection";
import ReviewBooking from "./user/pages/ReviewBooking";
import Bookings from "./user/pages/Bookings";

// USER PROTECTED ROUTE
import BookingProtectedRoute from "./user/routes/BookingProtectedRoute";

// CONTEXTS
import MovieProvider from "./context/MovieContext";
import ShowProvider from "./context/ShowContext";

const ProtectedWithProviders = ({ children }) => (
  <MovieProvider>
    <ShowProvider>
      {children}
    </ShowProvider>
  </MovieProvider>
);

function App() {
  return (
    <BrowserRouter>

      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        transition={Slide}
        autoClose={2000}
        closeButton={false}
        closeOnClick={true}
        toastClassName={(context) =>
          `custom-toast ${context?.type === "error" ? "error-toast" : "success-toast"
          }`
        }
      />

      <Routes>
        <Route path="/" element={<UserLayout />}>

          {/* HOME */}
          <Route
            index
            element={<Home />}
          />

          {/* MOVIE DETAILS */}
          <Route
            path="/movie/:movieId"
            element={
              <ProtectedWithProviders>
                <MovieDetails />
              </ProtectedWithProviders>
            }
          />

          {/* SEAT SELECTION */}
          <Route
            path="/show/:showId"
            element={
              <ProtectedWithProviders>
                <SeatSelection />
              </ProtectedWithProviders>
            }
          />

          {/* REVIEW BOOKING */}
          <Route
            path="/review/booking"
            element={
              <ProtectedWithProviders>
                <BookingProtectedRoute>
                  <ReviewBooking />
                </BookingProtectedRoute>
              </ProtectedWithProviders>
            }
          />

          {/* BOOKINGS */}
          <Route
            path="/myBookings"
            element={<Bookings />}
          />

        </Route>

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;