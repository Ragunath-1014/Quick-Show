import { useState } from "react";
import { Link } from "react-router-dom";

import googlePlay from "../../assets/icons/googlePlay.svg";
import apple from "../../assets/icons/apple.svg";

function Footer() {

    const [browseAll, setBrowseAll] = useState(false);
    const [links, setLinks] = useState(false);
    const [theatre, setTheatre] = useState(false);
    const [enquiry, setEnquiry] = useState(false);

    const theatreNames = [
        { id: 1, name: "AGS Cinemas, T. Nagar, Chennai" },
        { id: 2, name: "INOX The Marina Mall OMR, Egatoor, Chennai" },
        { id: 3, name: "PVR VR Mall, Anna Nagar, Chennai" },
        { id: 4, name: "Seven Screen's Cinemas, Kilambakkam, Chennai" }
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);

        if (element) {
            const yOffset = -140;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({
                top: y,
                behavior: "smooth"
            });
        }
    };

    const handleScroll = (id) => {
        setBrowseAll(false);

        setTimeout(() => {
            scrollToSection(id);
        }, 100);
    };

    return (
        <footer className="bg-[#F1F1F2] w-full px-5 mt-16">

            {/* SMALL SCREEN DEVICE */}
            <section className="md:hidden pt-8">

                {/* PLAYSTORE & APPSTORE */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-medium">
                        Download the app
                    </h1>
                    <div className="flex gap-5">
                        <img src={googlePlay} alt="googlePlay" className="w-32" />
                        <img src={apple} alt="apple" className="w-32" />
                    </div>
                </div>

                <div>

                    {/* BROWSE ALL */}
                    <div className="flex justify-between mt-5 font-medium">
                        <h1>
                            Browse All
                        </h1>
                        <i
                            className={`
                            ri-arrow-down-s-line 
                            inline-block transition-transform 
                            duration-300 cursor-pointer 
                            ${browseAll ? "rotate-180" : "rotate-0"} text-lg
                            `}
                            onClick={() => setBrowseAll(!browseAll)}
                        />
                    </div>

                    <p className="border-t-2 border-gray-300/80 my-3" />

                    {browseAll &&
                        <div className="flex flex-col gap-1 text-blue-600 font-medium px-5 mt-2">
                            <p onClick={() => handleScroll("nowShowing")}>
                                Now Showing
                            </p>
                            <p className="border-t-2 border-gray-300/80 my-2" />
                            <p onClick={() => handleScroll("upcomingMovies")}>
                                Upcoming Movies
                            </p>
                            <p className="border-t-2 border-gray-300/80 my-2" />
                        </div>
                    }

                    {/* LINKS */}
                    <div className="flex justify-between mt-5 font-medium">
                        <h1>
                            Links
                        </h1>
                        <i
                            className={`
                            ri-arrow-down-s-line 
                            inline-block transition-transform 
                            duration-300 cursor-pointer 
                            ${links ? "rotate-180" : "rotate-0"} text-lg
                            `}
                            onClick={() => setLinks(!links)}
                        />
                    </div>

                    <p className="border-t-2 border-gray-300/80 my-3" />

                    {links &&
                        <div className="flex flex-col gap-1 text-blue-600 font-medium px-5 mt-2">
                            <Link to={"/signup"}>
                                Signup
                            </Link>
                            <p className="border-t-2 border-gray-300/80 my-2" />
                            <Link to={"/login"}>
                                Login
                            </Link>
                            <p className="border-t-2 border-gray-300/80 my-2" />
                        </div>
                    }

                    {/* THEATRES */}
                    <div className="flex justify-between mt-5 font-medium">
                        <h1>
                            Theatres
                        </h1>
                        <i
                            className={`
                            ri-arrow-down-s-line 
                            inline-block transition-transform 
                            duration-300 cursor-pointer 
                            ${theatre ? "rotate-180" : "rotate-0"} text-lg
                            `}
                            onClick={() => setTheatre(!theatre)}
                        />
                    </div>

                    <p className="border-t-2 border-gray-300/80 my-2" />

                    {theatre &&
                        <div className="mt-2">
                            {theatreNames.map((theatreName) => (
                                <div
                                    key={theatreName.id}
                                    className="flex flex-col gap-1 text-blue-600 font-medium px-5"
                                >
                                    <p>
                                        {theatreName.name}
                                    </p>
                                    <p className="border-t-2 border-gray-300/80 my-2" />
                                </div>
                            ))}
                        </div>
                    }

                    {/* ENQUIRY */}
                    <div className="flex justify-between mt-5 font-medium">
                        <h1>
                            Enquiry
                        </h1>
                        <i
                            className={`
                            ri-arrow-down-s-line 
                            inline-block transition-transform 
                            duration-300 cursor-pointer 
                            ${enquiry ? "rotate-180" : "rotate-0"} text-lg
                            `}
                            onClick={() => setEnquiry(!enquiry)}
                        />
                    </div>

                    <p className="border-t-2 border-gray-300/80 my-2" />

                    {enquiry &&
                        <div className="text-blue-600 font-medium px-5 mt-2">
                            <p>
                                Support Service (24x7)
                            </p>
                            <p className="border-t-2 border-gray-300/80 my-2" />
                        </div>
                    }

                </div>

                {/* COPYRIGHT */}
                <p className="text-xs font-medium text-center mt-5 pb-5">
                    Copyright &#169; 2026 CodeWithRagu. All Rights Reserved.
                </p>
            </section>

            {/* LARGE SCREEN DEVICE */}
            <section className="flex justify-center">
                <div className="hidden md:block pt-8">

                    {/* PLAYSTORE & APPSTORE */}
                    <div className="flex items-center gap-16">
                        <h1 className="text-xl font-medium">
                            Download the app
                        </h1>
                        <div className="flex gap-5">
                            <img src={googlePlay} alt="googlePlay" className="w-40" />
                            <img src={apple} alt="apple" className="w-40" />
                        </div>
                    </div>

                    <p className="border-t-2 border-gray-300/80 my-8" />

                    <div className="font-medium flex items-start gap-12 lg:gap-32 xl:gap-40">

                        {/* BROWSE ALL */}
                        <div>
                            <h1>
                                Browse All
                            </h1>
                            <div className="flex flex-col gap-1 text-blue-600 mt-2">
                                <a href="#nowShowing">
                                    Now Showing
                                </a>
                                <a href="#upcomingMovies">
                                    Upcoming Movies
                                </a>
                            </div>
                        </div>

                        {/* LINKS */}
                        <div>
                            <h1>
                                Links
                            </h1>
                            <div className="flex flex-col gap-1 text-blue-600 mt-2">
                                <Link to={"/signup"}>
                                    Signup
                                </Link>
                                <Link to={"/login"}>
                                    Login
                                </Link>
                            </div>
                        </div>

                        {/* THEATRES */}
                        <div>
                            <h1>
                                Theatres
                            </h1>
                            <div className="mt-2 flex flex-col gap-1">
                                {theatreNames.map((theatreName) => (
                                    <div
                                        key={theatreName.id}
                                        className="text-blue-600 font-medium"
                                    >
                                        <p>
                                            {theatreName.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ENQUIRY */}
                        <div>
                            <h1>
                                Enquiry
                            </h1>
                            <p className="text-blue-600 font-medium mt-2">
                                Support Service (24x7)
                            </p>
                        </div>
                    </div>

                    <p className="border-t-2 border-gray-300/80 my-5" />

                    {/* COPYRIGHT */}
                    <p className="text-sm font-medium text-center pb-5">
                        Copyright &#169; 2026 CodeWithRagu. All Rights Reserved.
                    </p>
                </div>
            </section>
        </footer>
    );
}

export default Footer;