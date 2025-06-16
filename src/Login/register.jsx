import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Cookies from "js-cookie"
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {

  let navigate = useNavigate()

  const [input, setInput] = useState({
    name: "",
    image_url: "",
    email: "",
    password: ""
  })

  const handleInput = (event) => {
    const { name, value } = event.target
    setInput({ ...input, [name]: value })
  }

  
  const [showNotif, setShowNotif] = useState(false);
  const handleRegister = (event) => {
    event.preventDefault()
    const { name, image_url, email, password } = input

    axios.post('https://final-project-api-alpha.vercel.app/api/auth/register', {
      name, image_url, email, password
    })
    .then((res) => {
      setShowNotif(true)
      navigate('/login')
      setTimeout(() => {
        setShowNotif(false)
        navigate('/login')
      }, 2000)
    })
    .catch((err) => {
      console.error(err)
    })
    navigate('/login')
  }

  useEffect(() => {
      const token = Cookies.get('token');
      if (token) {
          navigate('/dashboard');
      }
  }, [navigate]);

  return (
    
    <section className="bg-gradient-to-r from-blue-500 to-blue-300 w-full h-screen place-items-center grid md:grid-cols-1 lg:grid-cols-3 p-5 lg:p-0">
      {showNotif && (
        <div className="fixed top-5 right-5 bg-white text-black px-4 py-2 rounded-xl shadow-lg transition-all duration-300">
          Akun berhasil dibuat! Mengarahkan ke login...
        </div>
      )}

      <div className="relative w-full max-w-md h-auto rounded-3xl overflow-hidden shadow-xl col-span-full mx-auto">
        <div className="absolute inset-0 bg-cover bg-center opacity-70 blur-sm"
          style={{ backgroundImage: "url('https://i.pinimg.com/736x/6a/d2/5c/6ad25c4df026c0cfbd66ed533ac02a4c.jpg')" }}></div>

        <div className="relative z-10 p-10 lg:p-16 flex flex-col justify-center h-full bg-white/10 backdrop-blur-sm rounded-3xl">
          <div className="flex items-center justify-center mb-5">
            <img src="/images/Logo-K.png" alt="Logo" className="w-10 h-10 lg:w-10 lg:h-10"/>
            <p className="text-xl font-bold ml-1 text-black">Regist your account</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="mb-5">
              <label className="block font-bold mb-2 text-white">Name</label>
              <input value={input.name} onChange={handleInput} type="text" name="name" required className="px-4 w-full rounded-lg bg-white/80 border border-none" />
            </div>

            <div className="mb-5">
              <label className="block font-bold mb-2 text-white">Email Address</label>
              <input value={input.email} onChange={handleInput} type="email" name="email" required className="px-4 w-full rounded-lg bg-white/80 border border-none" />
            </div>

            <div className="mb-5">
              <label className="block font-bold mb-2 text-white">Password</label>
              <input value={input.password} onChange={handleInput} type="password" name="password" minLength={8} required className="px-4 w-full rounded-lg bg-white/80 border border-none" />
            </div>

            <div className="mb-5">
              <label className="block font-bold mb-2 text-white">Image URL</label>
              <input value={input.image_url} onChange={handleInput} type="text" name="image_url" required className="px-4 w-full rounded-lg bg-white/80 border border-none" />
            </div>


            <button type="submit" className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl w-full">
              Submit
            </button>
          </form>
          <p className="mt-5 text-sm text-center">
            Already have an account? <Link to="/login" className="text-blue-700 hover:text-blue-500">Login</Link>
          </p>
        </div>
      </div>

    </section>
  )
}

export default Register
