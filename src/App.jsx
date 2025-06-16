import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "./contexts/GlobalContext";

import Login from './Login/login';
import Register from './Login/register';
import Logout from './Login/logout';
import ChangePassword from './Login/change-password';

import Layout from './layout/Layout';
import LayoutHome from './Home/layoutHome/layoutHome';

import Beranda from './Landing/beranda';
import Project from './Landing/projects';
import Detail from "./Landing/detail";

import Dashboard from './Home/dashboard';
import Category from './Home/category';
import Form from './Home/formProject';
import ManageProject from './Home/project';


import NotFound from './NotFound'; 


const App = () => {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>

          <Route element={<Layout />}>
            <Route path="/" element={<Beranda />} />

            {/* Projects Route */}
            <Route path="/projects" element={<Project />} />
            <Route path="/projects/:id" element={<Detail />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />

          <Route element={<LayoutHome />}>
            {/* <Route path="/dashboard/change-password" element={<ChangePassword />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/category" element={<Category />} />
            {/* <Route path="/category/create" element={<Form />} />
            <Route path="/category/edit-category/:id" element={<Form />} /> */}

            <Route path="/dashboard/projects" element={<ManageProject />} />
            <Route path="/dashboard/projects/create" element={<Form />} />
            <Route path="/dashboard/projects/:id/edit" element={<Form />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
};

export default App;
