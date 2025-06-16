import React from "react";
import Navbar from "../component/navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
<div className="grid grid-cols-7 min-h-screen">
  <div className="col-span-1">
    <Navbar />
  </div>
  <div className="col-span-6">
    <Outlet />
  </div>
</div>


    </>
  );
};

export default Layout;
