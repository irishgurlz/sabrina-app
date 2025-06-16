import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white text-black px-4 py-3 shadow-md">
      <div className="mx-auto">
        <ul className="flex justify-between items-center text-sm font-medium space-x-4 lg:space-x-10">

          <li className="flex items-center">
            <img src="/images/balon.png" alt="Logo" className="w-6 h-6 lg:w-10 lg:h-10" />
          </li>

          <li className="flex items-center space-x-4 lg:space-x-10">
            <NavLink to="/" className={({ isActive }) => `transition ${isActive ? "text-blue-500" : "hover:text-blue-300"}`}>Home</NavLink>
            <NavLink to="/job-vacancy" className={({ isActive }) => `transition ${isActive ? "text-blue-500" : "hover:text-blue-300"}`}>Works</NavLink>
            <NavLink to="/job-vacancy" className={({ isActive }) => `transition ${isActive ? "text-blue-500" : "hover:text-blue-300"}`}>About</NavLink>
            <NavLink to="/job-vacancy" className={({ isActive }) => `transition ${isActive ? "text-blue-500" : "hover:text-blue-300"}`}>Contact</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
