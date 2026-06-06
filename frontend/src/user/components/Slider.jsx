import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function Slider({ sliderMovie }) {

    const navigate = useNavigate();

    return (
        <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="slider__swiper overflow-hidden bg-black"
        >
            {sliderMovie.map((movie) => (
                <SwiperSlide key={movie._id}>
                    <div className="relative w-full h-[250px] md:h-[350px] lg:h-[400px] cursor-pointer"
                        onClick={() => navigate(`/movie/${movie._id}`)}
                    >
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="absolute inset-0 
                            w-full h-full 
                            object-cover object-[center_25%] 
                            blur-lg"
                        />

                        {/* WHITE MIX OVERLAY */}
                        <div className="absolute inset-0 bg-white/20" />

                        {/* DARK GRADIENT (For text visibility) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                        {/* MOVIE INFO */}
                        <div className="absolute inset-0 flex items-center justify-evenly px-2 md:px-10">

                            {/* LEFT CONTENT */}
                            <div className="text-white max-w-[60%]">
                                <h1
                                    className="line-clamp-2 xl:line-clamp-1 
                                    font-bold text-2xl 
                                    md:text-3xl"
                                >
                                    {movie.title}
                                </h1>

                                <p className="mt-3 md:text-lg font-medium">
                                    {movie.movieCertificate} | {movie.category}
                                </p>

                                <p className="hidden sm:line-clamp-2 md:line-clamp-3 mt-3 overflow-hidden">
                                    {movie.description}
                                </p>

                                <button
                                    className="mt-5 bg-black 
                                    px-5 py-3 md:px-7 rounded-lg 
                                    font-medium text-sm 
                                    md:text-base"
                                >
                                    Book now
                                </button>
                            </div>

                            {/* RIGHT IMAGE */}
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-32 md:w-44 
                                lg:w-52 aspect-[2/3] 
                                object-cover rounded-xl 
                                shadow-lg"
                            />

                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default Slider;