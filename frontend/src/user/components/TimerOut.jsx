import { useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ShowContext } from "../../context/ShowContext";

import timeOver from "../../assets/icons/timeOver.svg";

function TimerOut({ showId }) {

    const navigate = useNavigate();

    const { timerOver, setTimerOver } = useContext(ShowContext);

    return (
        <div>
            {timerOver &&
                <div
                    className="fixed inset-0 
                    flex justify-center 
                    items-end sm:items-center
                    backdrop-blur-sm z-50
                    bg-black/60"
                >

                    {/* SESSION EXPIRED */}
                    <div className="bg-white p-5 sm:py-14 rounded-t-2xl sm:rounded-2xl w-full sm:w-[600px]">
                        <div className="flex flex-col gap-2 items-center">
                            <img
                                src={timeOver}
                                alt="time-over"
                                className="w-14 sm:w-16"
                            />
                            <h1 className="font-semibold text-xl mt-4">
                                Time's up
                            </h1>
                            <p className="text-sm text-center font-medium">
                                Your session has expired. Please try booking again
                            </p>
                        </div>

                        {/* TRY AGAIN BUTTON */}
                        <div className="flex justify-center">
                            <button
                                className="bg-black text-white 
                                font-bold rounded-lg 
                                px-5 sm:px-10 
                                py-4 mt-6 
                                w-80 sm:w-96
                                "
                                onClick={() => {
                                    setTimerOver(false);
                                    navigate(`/show/${showId}`);
                                }}
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default TimerOut;