import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Cookies from "js-cookie"
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {


    let navigate = useNavigate()

    const [input, setInput] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState("")
    const [validationError, setValidationError] = useState({}); 

    const handleInput = (event) => {
        const { name, value } = event.target;
        setInput((prev) => ({ ...prev, [name]: value }));
        setValidationError((prev) => ({ ...prev, [name]: "" })); 
    };

    const handleLogin = (event) => {
        event.preventDefault()

        let { email, password } = input
        axios.post('https://api.kyuib.my.id/api/v1/login', { email, password })
            .then((res) => {
                console.log(res.data.data)
                let data = res.data.data
                Cookies.set('token', data.token, { expires: 1 })
                Cookies.set('name', data.name)
                console.log(Cookies.get('token'));
                navigate('/dashboard')
            })
            .catch((error) => {
                if (error.response) {
                    const resData = error.response.data;

                    if (resData.msg === 'Invalid credentials') {
                        setError('Invalid credentials');
                        setValidationError({});
                    }
                    else if (resData.errors) {
                        const fieldErrors = {};
                        for (const key in resData.errors) {
                            fieldErrors[key] = resData.errors[key][0]; 
                        }
                        setValidationError(fieldErrors);
                        setError("");
                    }
                } else {
                    setError('Network error. Please check your connection');
                }
            });
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            // navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <section className="bg-cover bg-center w-full h-screen" style={{ backgroundImage: "url('/images/Wall.png')" }}>
            <div className="flex justify-end items-stretch h-full">
                <div className="relative w-full max-w-2xl h-full overflow-hidden p-12">
                    <div className="absolute inset-0 bg-white"></div>

                    <div className="relative z-10 p-10 lg:p-16 flex flex-col justify-center h-full bg-white/10 backdrop-blur-sm">
                        <div className="flex items-center justify-center mb-5">
                            <p className="text-2xl font-bold text-blue-800 ml-3">Welcome Back</p>
                        </div>

                        {/* General error */}
                        {error && (
                            <div className="bg-red-400 text-white text-center px-4 py-2 mb-3 rounded-xl" role="alert">
                                <span>{error}</span>
                            </div>
                        )}

                        {error && <div className="bg-red-400 text-white text-center px-4 py-2 mb-3 rounded-xl" role="alert"><span>{error}</span></div>}

                        <form onSubmit={handleLogin}>
                            <div className="mb-5">
                                <label className="block text-black mb-1">Email Address</label>
                                <input value={input.email} onChange={handleInput} type="text" name="email" required className="px-4 w-full rounded-lg bg-white/80 border-gray-300 hover:border-2 hover:border-orange-300 shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-2 focus:border-orange-300" />
                                {validationError.email && (
                                    <p className="text-sm text-red-500 mt-1">{validationError.email}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-black mb-1">Password</label>
                                <input value={input.password} onChange={handleInput} type="password" name="password" required className="px-4 w-full rounded-lg bg-white/80 border-gray-300 hover:border-2 hover:border-orange-300 shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-2 focus:border-orange-300" />
                                {validationError.password && (
                                    <p className="text-sm text-red-500 mt-1">{validationError.password}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-3 mb-5">
                                <label className="inline-flex items-center text-sm text-gray-700">
                                    <input type="checkbox" className="form-checkbox accent-orange-400 mr-2" />
                                    Remember me
                                </label>
                                <Link to="" className="text-sm text-gray-800 font-bold opacity-70 hover:opacity-100">
                                    Forgot Your Password?
                                </Link>
                            </div>


                            <button type="submit" className="mt-10 bg-orange-300 hover:bg-orange-200 text-white font-bold py-2 px-4 rounded-xl w-full">
                                Sign In
                            </button>
                        </form>

                        <p className="mt-5 text-sm text-center text-blue-800">
                            Don't have an account?
                            <Link to="/register" className="text-blue-700 font-bold hover:text-blue-500 ml-1">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
