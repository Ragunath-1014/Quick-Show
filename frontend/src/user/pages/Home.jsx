import { useEffect, useState } from "react";

import api from "../../api/axios";
import Slider from "../components/Slider";
import MovieCard from "../components/MovieCard";
import UpComingMovies from "../components/UpComingMovies";
import Footer from "../components/Footer";
import Loader from "../../shared/Loader";

function Home() {
  const [movies, setMovies] = useState(null);
  const [sliderMovie, setSliderMovies] = useState(null);
  const [hideScrollMessage, setHideScrollMessage] = useState(false);
  const [upcomingMovie, setUpcomingMovies] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [moviesRes, upcomingRes] = await Promise.all([
          api.get("/movie"),
          api.get("/movie/upcomingMovies"),
        ]);

        setMovies(moviesRes.data);
        setSliderMovies(moviesRes.data.slice(0, 5));
        setUpcomingMovies(upcomingRes.data);

      }
      catch (err) {
        console.log(err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading || !movies) {
    return <Loader loadingMessage={"Loading"} />;
  }

  return (
    <div className="relative">

      <Slider sliderMovie={sliderMovie} />

      {/* HEADER */}
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-2xl font-bold">
          Now Showing
        </h1>

        <p className="text-gray-500 text-xs text-center sm:text-sm font-medium">
          Explore trending films and book your seats instantly
        </p>
      </div>

      {/* NOW SHOWING MOVIES */}
      <div
        className="flex px-5
        md:px-4 lg:px-10 gap-8 
        mt-5 overflow-x-auto 
        md:overflow-hidden scroll-mt-36
        md:grid md:grid-cols-3 md:gap-6
        lg:grid-cols-4 xl:grid-cols-5 
        2xl:grid-cols-6
        "
        id="nowShowing"
        onScroll={(e) => {
          if (e.target.scrollLeft > 12) {
            setHideScrollMessage(true);
          }
        }}
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
          />
        ))}
      </div>

      <div
        className={`
        flex items-center 
        justify-center gap-2 
        mt-5 transition-all
        duration-500 ease-out
        md:hidden
        ${hideScrollMessage
            ? "opacity-0 translate-y-2 pointer-events-none"
            : "opacity-100 translate-y-0"
          }
        `}
      >
        <p className="text-xs font-medium">
          Scroll to view movies playing now
        </p>
        <i className="ri-arrow-right-long-line font-extralight animate-scroll-arrow" />
      </div>

      {/* UPCOMING MOVIES */}
      <div className="flex flex-col items-center mt-6">
        <h1 className="text-2xl font-bold">
          Upcoming Movies
        </h1>

        <p className="text-gray-500 text-xs text-center sm:text-sm font-medium">
          Discover what's next on the big screen soon
        </p>
      </div>

      <UpComingMovies upcomingMovie={upcomingMovie} />

      <Footer />

    </div>
  );
}

export default Home;