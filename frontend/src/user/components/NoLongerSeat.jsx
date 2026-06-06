import noLongerTicket from "../../assets/images/noTicket.png";

function NoLongerSeat({ noLongerSeat, setNoLongerSeat }) {
    return (
        <div>
            {noLongerSeat &&
                <div
                    className="fixed inset-0 
                    flex justify-center 
                    items-end sm:items-center 
                    backdrop-blur-sm z-50 
                    bg-black/60"
                >

                    {/* SEATS ARE NO LONGER AVAILABLE */}
                    <div className="bg-white p-5 sm:py-14 rounded-t-2xl sm:rounded-2xl w-full sm:w-[600px]">
                        <div className="flex flex-col gap-3 items-center text-center">
                            <img
                                src={noLongerTicket}
                                alt="ticket not available"
                                className="w-14 sm:w-16"
                            />
                            <h1 className="font-semibold text-lg mt-4">
                                Some selected seats are no longer available
                            </h1>
                            <p className="text-xs sm:text-sm font-medium">
                                Unfortunately, these seats are no longer available. Please select different seats to continue.
                            </p>
                        </div>

                        {/* CHANGE SEATS BUTTON */}
                        <div className="flex justify-center">
                            <button
                                className="bg-black text-white 
                                font-bold rounded-lg 
                                px-5 sm:px-10 
                                py-4 mt-6 
                                w-80 sm:w-96
                                "
                                onClick={() => setNoLongerSeat(false)}
                            >
                                Change seats
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default NoLongerSeat;