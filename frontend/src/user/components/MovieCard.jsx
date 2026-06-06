import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div>
      <div
        className="w-48 sm:w-56 md:w-full cursor-pointer rounded-2xl"
        onClick={() => navigate(`/movie/${movie._id}`)}
      >

        {/* POSTER */}
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover rounded-t-2xl"
        />

        {/* CONTENT */}
        <div className="p-4 border border-gray-200 rounded-b-2xl">
          <h1 className="font-semibold text-sm sm:text-base text-black line-clamp-1">
            {movie.title}
          </h1>
          
          <div className="flex text-xs sm:text-sm font-medium text-gray-700 mt-1">
            <p>
              {movie.movieCertificate ? `${movie.movieCertificate} |` : ""}
            </p>
            <p className={`${movie.movieCertificate ? "ml-1" : ""}`}>
              {movie.language}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;