import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Cookies from "js-cookie"
import { useNavigate } from 'react-router-dom'

const ChangePassword = () => {

    let navigate = useNavigate()

    const [input, setInput] = useState({
        current_password: "",
        new_password: "",
        new_confirm_password: ""
    })

    const handleInput = (event) => {
        let value = event.target.value
        let name = event.target.name
        setInput({ ...input, [name]: value })
    }

    const handleChangePassword = (event) => {
        event.preventDefault()

        let { current_password, new_password, new_confirm_password } = input
        const token = Cookies.get('token')
        console.log('Token:', token) 
        if (new_password !== new_confirm_password) {
            alert("Password baru dan konfirmasi password tidak cocok.")
            return
        }

        if (new_password.length < 8 || current_password.length < 8 || new_confirm_password.length < 8) {
            alert("Password harus memiliki minimal 8 karakter.")
            return
        }

        axios.post('https://final-project-api-alpha.vercel.app/api/auth/change-password', 
            { current_password, new_password, new_confirm_password },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
            console.log(res.data)
            alert("Password berhasil diubah.")
            navigate('/dashboard') 
        })
        .catch((error) => {
            console.log(error)
            console.log(current_password, new_password, new_confirm_password)
            alert("Gagal mengubah password. Silakan coba lagi.")
        })
    }

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            navigate('/login') 
        }
    }, [navigate])

    return (
        <section className="bg-gradient-to-r from-blue-500 to-blue-300 w-full h-screen place-items-center grid md:grid-cols-1 lg:grid-cols-3">
            <div className="relative w-full max-w-md h-auto rounded-3xl overflow-hidden shadow-xl col-span-full mx-auto">
                <div className="absolute inset-0 bg-cover bg-center opacity-70 blur-sm"
                    style={{ backgroundImage: "url('https://i.pinimg.com/736x/6a/d2/5c/6ad25c4df026c0cfbd66ed533ac02a4c.jpg')" }}></div>

                <div className="relative z-10 p-16 flex flex-col justify-center h-full bg-white/10 backdrop-blur-sm rounded-3xl">
                    <div className="flex items-center justify-center mb-5">
                        <img src="/images/Logo-K.png" alt="Logo" className="w-10 h-10 lg:w-10 lg:h-10" />
                        <p className="text-xl font-bold ml-1 text-black">Change Password</p>
                    </div>

                    <form onSubmit={handleChangePassword}>
                        <div className="mb-5">
                            <label className="block font-bold mb-2 text-white">Current Password</label>
                            <input value={input.current_password} onChange={handleInput} type="password" name="current_password" required className="px-4 w-full rounded-lg bg-white/80 border border-none" 
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block font-bold mb-2 text-white">New Password</label>
                            <input value={input.new_password} onChange={handleInput} type="password" name="new_password" required className="px-4 w-full rounded-lg bg-white/80 border border-none" />
                        </div>

                        <div className="mb-5">
                            <label className="block font-bold mb-2 text-white">Confirm New Password</label>
                            <input value={input.new_confirm_password} onChange={handleInput} type="password" name="new_confirm_password" required className="px-4 w-full rounded-lg bg-white/80 border border-none" 
                            />
                        </div>

                        <button type="submit" className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl w-full">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ChangePassword;
