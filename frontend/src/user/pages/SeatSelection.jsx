import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";

import { ShowContext } from "../../context/ShowContext";

import api from "../../api/axios";
import Loader from "../../shared/Loader";
import Seats from "../components/Seats";
import socket from "../../socket";

function SeatSelection() {

  const { showId } = useParams();

  const { showDetails, setShowDetails, setSelectedSeats } = useContext(ShowContext);

  const [loading, setLoading] = useState(true);

  const fetchSeats = async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const res = await api.get(`/show/${showId}`);

      setShowDetails(res.data);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats(true);

    socket.emit("join-show", showId);

    const stored = JSON.parse(localStorage.getItem("selectedSeats"));

    if (stored) {
      const { showId: storedShowId, seats, expiry } = stored;

      if (Date.now() > expiry) {
        localStorage.removeItem("selectedSeats");
        setSelectedSeats([]);
      }
      else if (storedShowId === showId) {
        setSelectedSeats(seats);
      }
    }

    // REMOVES THE OLD LISTENER BEFORE CREATING NEW LISTENER
    socket.off("seats-updated");

    socket.on("seats-updated", () => {
      fetchSeats();
    });

    return () => {
      socket.emit("leave-show", showId);
      socket.off("seats-updated");
    };

  }, [showId]);

  if (loading) {
    return <Loader loadingMessage={"Loading Seats"} />;
  }

  const date = new Date(showDetails.date);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const weekday = date.toLocaleString("en-US", { weekday: "short" });

  return (
    <section className="mt-5 md:mt-4">

      {/* SHOW INFO */}
      <div className="text-xs sm:text-sm text-black text-center px-5">
        <p className="underline underline-offset-1">
          {`${showDetails.movie.title} - ${weekday} ${day} ${month}, ${showDetails.time} at ${showDetails.theatre.theatreName}`}
        </p>
      </div>

      {/* SEATS UI */}
      <Seats showId={showId} refreshSeats={fetchSeats} />

      {/* ABOUT SEATS */}
      <div
        className="fixed bottom-0 
        left-0 right-0 
        bg-white h-20 
        flex flex-col 
        gap-2 items-center 
        justify-center border-t 
        border-gray-300/80"
      >
        <h1 className="font-semibold text-sm">
          SCREEN THIS WAY
        </h1>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <p className="w-5 h-5 border border-gray-300 rounded" />
            <p className="text-sm text-black">
              Available
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p
              className="w-5 h-5 
              bg-gray-100 border 
              border-gray-300 rounded 
              text-xs text-gray-500/60
              flex items-center
              justify-center"
            >
              <i className="ri-close-line" />
            </p>
            <p className="text-sm text-black">
              Occupied
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p className="w-5 h-5 border border-purple-600 bg-purple-600 rounded" />
            <p className="text-sm text-black">
              Selected
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SeatSelection;