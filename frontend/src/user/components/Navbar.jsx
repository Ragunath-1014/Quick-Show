import { useContext, useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";

import api from "../../api/axios";

import logo from "../../assets/icons/logo.svg";
import profile from "../../assets/icons/userLogo.png";
import booking from "../../assets/icons/booking.svg";
import logout from "../../assets/icons/logout.svg";

function Navbar() {

    const navigate = useNavigate();

    const { user, setUser } = useContext(AuthContext);

    const [showLogin, setShowLogin] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const firstLetter = user?.name?.charAt(0)?.toUpperCase();

    const handleLogout = async () => {
        setShowProfile(false);

        try {
            await api.get("/auth/logout");

            setUser(null);

            navigate("/")

            toast.dismiss();
            toast.success("Logged out successfully");
        }
        catch (err) {
            console.log(err.message);

            toast.dismiss();
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        const isAnyModalOpen = showProfile;

        if (isAnyModalOpen) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showProfile]);


    const handleMyBooking = () => {
        navigate("/myBookings");
        setShowProfile(false);
    }

    return (
        <nav className="sticky top-0 z-40">
            <div
                className="px-5 h-20 
                bg-white shadow-md flex 
                items-center justify-between"
            >

                {/* LEFT SIDE SECTION */}
                <div className="flex items-center gap-2">
                    <img
                        src={logo}
                        alt="quick show"
                        className="cursor-pointer w-36 sm:w-40"
                        onClick={() => navigate("/")}
                    />
                    <span className="text-2xl hidden sm:block">
                        |
                    </span>
                    <i className="ri-map-pin-line text-2xl text-purple-600 hidden sm:block" />
                    <div className="hidden sm:block">
                        <h1 className="font-semibold text-black">
                            Chennai
                        </h1>
                        <p className="text-xs text-gray-700 font-semibold">
                            Tamil Nadu
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE SECTION */}
                {user ?
                    <div>
                        <img
                            src={profile}
                            alt="Profile-Icon"
                            className="w-7 cursor-pointer"
                            onClick={() => setShowProfile(true)}
                        />
                    </div>
                    :
                    <div>
                        <img
                            src={profile}
                            alt="Profile-Icon"
                            className="w-7 cursor-pointer"
                            onClick={() => setShowLogin(true)}
                        />
                    </div>
                }

                {user &&
                    <>
                        {/* PROFILE SIDEBAR-OVERLAY */}
                        <div
                            className={`
                            fixed inset-0 
                            bg-black/60 z-40 
                            transition-opacity duration-300
                            ${showProfile ? "opacity-100" : "opacity-0 pointer-events-none"}
                            `}
                            onClick={() => setShowProfile(false)}
                        />

                        {/* PROFILE SIDEBAR */}
                        <div
                            className={`
                            bg-[#F1F1F2] top-0 
                            h-screen w-full 
                            md:max-w-xl transition-all 
                            duration-300 fixed 
                            z-50 
                            ${showProfile ? "right-0" : "-right-full"}
                            `}
                        >

                            {/* HEADER */}
                            <div
                                className="flex items-center 
                                shadow-md gap-2 
                                px-5 h-20 
                                cursor-pointer bg-white
                                "
                                onClick={() => setShowProfile(false)}
                            >
                                <button>
                                    <i className="ri-arrow-left-line text-xl text-black" />
                                </button>
                                <h2 className="font-semibold text-lg text-black">
                                    Profile
                                </h2>
                            </div>

                            {/* USER INFO */}
                            <div className="flex items-center gap-4 px-5 mt-5">
                                <h2
                                    className="bg-[#D5CCFF] text-purple-600
                                    w-16 h-16
                                    sm:w-20 sm:h-20
                                    flex items-center 
                                    justify-center rounded-full 
                                    font-bold text-2xl
                                    sm:text-3xl
                                    "
                                >
                                    {firstLetter}
                                </h2>
                                <div>
                                    <p className="font-semibold text-black">
                                        {user?.name}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex flex-col gap-6 mx-5 mt-8">

                                {/* VIEW ALL BOOKINGS BUTTON */}
                                <button
                                    className="flex items-center 
                                    gap-4 bg-white 
                                    py-4 px-3 
                                    rounded-2xl border
                                    border-gray-300/80
                                    "
                                    onClick={handleMyBooking}>
                                    <img
                                        src={booking}
                                        alt="booking-logo"
                                    />
                                    <p className="text-gray-700 font-medium">
                                        View all bookings
                                    </p>
                                </button>

                                {/* LOGOUT BUTTON */}
                                <button
                                    className="flex items-center 
                                    gap-4 bg-white 
                                    py-4 px-3 
                                    rounded-2xl border
                                    border-gray-300/80
                                    "
                                    onClick={handleLogout}
                                >
                                    <img
                                        src={logout}
                                        alt="logout-logo"
                                    />
                                    <p className="text-gray-700 font-medium">
                                        Logout
                                    </p>
                                </button>
                            </div>
                        </div>
                    </>
                }

                {showLogin &&
                    <>
                        {/* LOGIN-OVERLAY */}
                        <div
                            className={`fixed inset-0 bg-black/60 z-40 cursor-pointer`}
                            onClick={() => setShowLogin(false)}
                        />

                        <div
                            className={`
                            bg-white px-5
                            absolute rounded-xl
                            right-2 top-16 
                            z-50 transition-all
                            duration-300
                            ${showLogin ? "opacity-100" : "opacity-0 pointer-events-none"}
                            `}
                        >
                            {/* ARROW */}
                            <div
                                className="absolute -top-[7px] 
                                right-4 w-0 h-0 
                                border-l-8 border-r-8 
                                border-b-8 border-l-transparent
                                border-b-white border-r-transparent"
                            />
                            <NavLink
                                to={"/login"}
                                className="flex items-center gap-3 p-3"
                            >
                                Login
                            </NavLink>
                        </div>
                    </>
                }
            </div>
        </nav >
    );
}

export default Navbar;