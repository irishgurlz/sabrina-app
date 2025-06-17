import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

const Navbar = () => {
  let navigate = useNavigate()
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("")
  const handleDetail = (modalVisible) => {
    setModalVisible(true);
  };

  const handleLogout = (event) => {
    event.preventDefault()

    console.log(Cookies.get('token'));

    axios.post('https://api.kyuib.my.id/api/v1/logout', {}, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`
      }
    })
      .then(() => {
        Cookies.remove('token')
        Cookies.remove('name')
        navigate('/')
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data.msg === 'unauthenticated') {
            setError('Unauthenticated');
          }
        } else {
          setError('Network error. Please check your connection');
        }
      })
  }

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      navigate('/')
    }
  }, [])

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <nav className="fixed top-0 left-0 h-full z-50 bg-black text-white px-4 md:px-3 lg:px-5 py-3 shadow-md">
      <div className="flex flex-col h-full items-center">
        <div className="flex items-center space-x-3 mb-10">
          <img src="/images/balon.png" alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold hidden md:block">Portofolio</span>
        </div>

        <div className="space-y-4 text-sm font-medium flex-col">
          <NavLink to="/dashboard" end className={({ isActive }) => `transition flex items-center gap-4 rounded-lg px-5 py-2 text-sm ${isActive ? "bg-blue-400 text-white" : "hover:bg-blue-400 hover:text-white"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
            <span className="hidden md:block">Dashboard</span>
          </NavLink>

          <NavLink to="/category" end className={({ isActive }) => `transition flex items-center gap-4 rounded-lg px-5 py-2 text-sm ${isActive ? "bg-blue-400 text-white" : "hover:bg-blue-300 hover:text-white"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
            <span className="hidden md:block">Manage Category</span>
          </NavLink>

          <NavLink to="/dashboard/projects" end className={({ isActive }) => `transition flex items-center gap-4 rounded-lg px-5 py-2 text-sm ${isActive ? "bg-blue-400 text-white" : "hover:bg-blue-300 hover:text-white"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
            </svg>
            <span className="hidden md:block">Manage Project</span>
          </NavLink>

          <NavLink to="/dashboard/articles" end className={({ isActive }) => `transition flex items-center gap-4 rounded-lg px-5 py-2 text-sm ${isActive ? "bg-blue-400 text-white" : "hover:bg-blue-300 hover:text-white"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
            </svg>
            <span className="hidden md:block">Manage Article</span>
          </NavLink>


          <NavLink to="/landing" end className={({ isActive }) => `transition flex items-center gap-4 rounded-lg px-5 py-2 text-sm ${isActive ? "bg-blue-400 text-white" : "hover:bg-blue-300 hover:text-white"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
            <span className="hidden md:block">Manage Landing</span>
          </NavLink>
        </div>

        <div className="mt-auto">
          <button end className={`transition flex items-center gap-4 rounded-lg px-5 py-2 text-sm hover:bg-red-500 hover:text-white active:bg-red-600`} onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
            <span className="hidden md:block">Logout</span>
          </button>
        </div>


        {/* <div className=" md:block lg:hidden">
            <button onClick={() => handleDetail(true)} className="bg-white text-black font-semibold px-5 lg:px-8 py-1 rounded-full h-8 hover:bg-blue-500 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M3 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.25Zm0 4.5A.75.75 0 0 1 3.75 9h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            </button>
        </div>


        {modalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-11/12 max-w-sm p-6 rounded-2xl shadow-xl space-y-6 flex flex-col items-start text-black relative">
              <button onClick={closeModal} className="absolute top-3 right-3 text-red-500 font-bold text-xl hover:text-red-700">×</button>

              <NavLink to="/dashboard" onClick={closeModal}  className="hover:bg-blue-50 hover:p-3 w-full hover:rounded-xl">Dashboard</NavLink>
              <NavLink to="/dashboard/list-job-vacancy" onClick={closeModal}  className="hover:bg-blue-50 hover:p-3 w-full hover:rounded-xl">Table</NavLink>
              <NavLink to="/dashboard/list-job-vacancy/form" onClick={closeModal}  className="hover:bg-blue-50 hover:p-3 w-full hover:rounded-xl">Form</NavLink>
              <NavLink to="/dashboard/profile" onClick={closeModal} className="hover:bg-blue-50 hover:p-3 w-full hover:rounded-xl">Profile</NavLink>
              <NavLink to="/logout" onClick={closeModal}  className="hover:bg-blue-50 hover:p-3 w-full hover:rounded-xl">Logout</NavLink>
            </div>
          </div>
        )} */}
      </div>
    </nav>
  );
};

export default Navbar;
