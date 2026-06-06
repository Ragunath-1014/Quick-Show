import MovieCard from "./MovieCard";

function UpComingMovies({ upcomingMovie }) {

    return (
        <div
            className="flex 
            px-5 md:px-4
            lg:px-10 gap-8 
            mt-5 overflow-x-auto 
            md:overflow-hidden scroll-mt-36
            md:grid md:grid-cols-3
            lg:grid-cols-4 xl:grid-cols-5 
            2xl:grid-cols-6
            "
            id="upcomingMovies"
        >
            {upcomingMovie.map((movie) => {
                const date = new Date(movie.releaseDate);
                const formattedDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                });
                return (
                    <div className="relative" key={movie._id}>
                        <MovieCard movie={movie}
                        />
                        <div className="bg-gray-400/20 w-24 py-1 rounded-md absolute top-3 left-3">
                            <p className="text-sm text-center text-white font-medium">
                                {formattedDate}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export default UpComingMovies;