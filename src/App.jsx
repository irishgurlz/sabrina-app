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
import DetailArticleLanding from "./Landing/detailArticle";


import Dashboard from './Home/dashboard';
import Category from './Home/category';
import Form from './Home/Project/formProject';
import ManageProject from './Home/Project/project';
import DetailProject from './Home/Project/detailProject';

import Article from './Home/Article/article';
import DetailArticle from "./Home/Article/detailArticle";
import FormArticle from "./Home/Article/formArticle";
import ArticleProject from "./Home/Project/articleProject";
import ArticleProjectLanding from "./Landing/articleProject";
import ManageLanding from './Home/ManageLanding/landing';


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
            <Route path="/projects/:id/articles" element={<ArticleProjectLanding />} />
            <Route path="/projects/:id" element={<Detail />} />
            <Route path="/articles/:id" element={<DetailArticleLanding />} />
            <Route path="/detail-project/:id" element={<Detail />} />

          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />

          <Route element={<LayoutHome />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/category" element={<Category />} />
            <Route path="/dashboard/projects" element={<ManageProject />} />
            <Route path="/dashboard/projects/create" element={<Form />} />
            <Route path="/dashboard/projects/:id/edit" element={<Form />} />
            <Route path="/dashboard/projects/:id" element={<DetailProject />} />
            <Route path="/dashboard/projects/:id/articles" element={<ArticleProject />} />

            <Route path="/dashboard/articles" element={<Article />} />
            <Route path="/dashboard/articles/:id" element={<DetailArticle />} />
            <Route path="/dashboard/articles/create" element={<FormArticle />} />
            <Route path="/dashboard/articles/:id/edit" element={<FormArticle />} />

            <Route path="/dashboard/landing" element={<ManageLanding />} />


          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
};

export default App;
