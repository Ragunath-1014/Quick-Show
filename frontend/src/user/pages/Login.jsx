import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";

import api from "../../api/axios";

function Login() {

    const navigate = useNavigate();

    const { setUser } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const res = await api.post("/auth/login", { email, password });
            setUser(res.data.user);

            toast.dismiss();
            toast.success(res.data?.message);
            navigate("/");
        }
        catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <section className="min-h-dvh flex flex-col items-center justify-center px-5">

            {/* HEADER */}
            <h1 className="text-3xl sm:text-4xl font-bold text-center">
                Login to your <span className="text-purple-600">Q</span>uickShow account.
            </h1>

            {/* LOGIN FORM */}
            <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 mt-10">

                {/* EMAIL FIELD */}
                <div
                    className="bg-white text-black 
                    flex items-center 
                    w-80 sm:w-96 
                    py-4 px-4 
                    rounded-3xl font-medium
                    border border-gray-300"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent w-full outline-none"
                        required
                    />
                    <i className="ri-mail-fill text-lg" />
                </div>

                {/* PASSWORD FIELD */}
                <div
                    className="bg-white text-black 
                    flex items-center 
                    w-80 sm:w-96 
                    py-4 px-4 
                    rounded-3xl font-medium
                    border border-gray-300"
                >
                    <input
                        type={`${showPassword ? "text" : "password"}`}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-transparent w-full outline-none"
                    />
                    <i
                        className={`
                        ${showPassword ? "ri-eye-fill" : "ri-eye-off-fill"} text-lg cursor-pointer
                        `}
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>

                {/* LOGIN BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white 
                    font-medium w-80 
                    sm:w-96 py-5 
                    rounded-full mt-6 
                    disabled:opacity-50
                    transition-all duration-300
                    hover:opacity-80"
                >
                    {loading
                        ? (
                            <div className="flex items-center justify-center gap-3">
                                <span>Logging in</span>
                                <div
                                    className="h-4 w-4 
                                    border-2 border-white 
                                    border-t-transparent rounded-full 
                                    animate-spin"
                                />
                            </div>
                        )
                        : (
                            <span>
                                Login
                            </span>
                        )}
                </button>

                <div className="text-sm sm:text-base flex gap-1">
                    <p>
                        If you don't have an account?
                    </p>
                    <Link to={"/signup"} className="text-purple-600 font-semibold">
                        SignUp
                    </Link>
                </div>
            </form>
        </section>
    );
}

export default Login;