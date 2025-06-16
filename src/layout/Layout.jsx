import React from "react";
import Navbar from "../Landing/navbar";
import Footer from "../Landing/component/footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
