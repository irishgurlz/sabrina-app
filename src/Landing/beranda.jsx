import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";
import Cookies from "js-cookie";
import "../App.css";
import { API_BASE_URL } from "../init";
import ProjectCard from "./component/projectCard";
import ArticleCard from "./component/articleCard";

const Beranda = () => {

  const [dataProject, setDataProject] = useState([]);
  const [dataArticle, setDataArticle] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [projectCategoryVisible, setProjectCategoryVisible] = useState(false);

  const [projectLoading, setProjectLoading] = useState(true);
  const [articleLoading, setArticleLoading] = useState(true);

  const fetchLandingPageData = async () => {
    axios
      .get(`${API_BASE_URL}/landing-pages/1`)
      .then((res) => {
        setDataUser(res.data.data);
      })
      .catch((error) => {
        console.error("Fetch Error: ", error);
      });
  };

  const fetchFeaturedProjectsData = async () => {
    axios
      .get(dataUser.relationships.related_projects.self)
      .then((res) => {
        setDataProject(res.data.data);
      })
      .catch((error) => {
        console.error("Fetch Error: ", error);
      })
      .finally(() => {
        setProjectLoading(false);
      });
  };

  const fetchArticleData = async () => {
    axios
      .get(dataUser.relationships.related_articles.self)
      .then((res) => {
        setDataArticle(res.data.data);
      })
      .catch((error) => {
        console.error("Fetch Error: ", error);
      })
      .finally(() => {
        setArticleLoading(false);
      });
  };

  useEffect(() => {
    fetchLandingPageData();
  }, []);

  useEffect(() => {
    if (
      dataUser?.relationships?.related_projects?.self &&
      dataProject.length === 0
    ) {
      fetchFeaturedProjectsData();
    }

    if (
      dataUser?.relationships?.related_projects?.self &&
      dataArticle.length === 0
    ) {
      fetchArticleData();
    }
  }, [dataUser, dataProject, dataArticle]);

  const handleMoreProject = () => {
    navigate(`/projects`);
  };

  const handleMoreArticles = () => {
    navigate(`/articles`);
  };

  const handleProjectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setProjectCategoryVisible(true);
  };

  const filteredProjects = useMemo(() => {
    if (!selectedCategoryId) return dataProject;
    return dataProject.filter(
      (project) => project.attributes.category_id === Number(selectedCategoryId)
    );
  }, [dataProject, selectedCategoryId]);


  return (
    <section className="bg-white">
      <div className="mb-12">
        <div className="w-full">
          {/* ======== CARD ATAS =========== */}
          <div className="hero min-h-[20rem] md:min-h-[30rem] bg-cover bg-center bg-no-repeat shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 mt-4 pt-5 shadow-xl"
            style={{ backgroundImage: `url(${dataUser?.attributes?.hero_image_url})`, }} >
            <div className="flex flex-col justify-end mt-16 px-6 md:pl-16 text-center md:text-left">
              <h1 className="hidden md:block text-3xl font-bold text-white">
                {dataUser?.attributes?.display_name}
              </h1>
              <h3 className="text-xl text-white mt-2 mb-4 typing-effect ">
                {dataUser?.attributes?.job_title}
              </h3>
            </div>
          </div>
        </div>

        {/* ===================================== Get To Know Me ===================================== */}
        <div className="px-8 md:px-16 grid md:grid-cols-2 xl:grid-cols-2 pt-5 gap-5 pb-5 w-full">
          <div
            className="hero min-h-[10rem] md:min-h-[20rem] bg-cover bg-center rounded-lg shadow-lg overflow-hidden mt-4 pt-5 shadow-xl animate-fadeSlideRight"
            style={{
              backgroundImage: `url(${dataUser?.attributes?.about_me_image_url})`,
            }}
          ></div>
          <div className="min-h-[10rem] md:min-h-[20rem] overflow-hidden mt-4 md:px-5  animate-fadeSlideLeft">
            <div className="">
              <h1 className="text-lg font-bold mb-2">Get to Know Me</h1>
              <h1 className="text-2xl font-bold mb-2">
                {dataUser?.attributes?.about_me_title}
              </h1>
              <p className="text-justify mb-2">
                {dataUser?.attributes?.about_me_body}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================== Featured Project ===================================== */}
        <div>
          <div className="pt-6 pb-2 mx-5 md:mx-16 animate-fadeSlideUp">
            <h2 className="text-xl mb-3 font-bold">Featured Projects</h2>
            <div className="slide-2 overflow-x-auto md:py-5 scrollbar-hide">
              <div className="flex gap-4 w-max">
                {projectLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                    <ProjectCard skeleton={true} key={index} />
                  ))
                  : Array.isArray(dataProject) &&
                  dataProject.map((project) => (
                    <ProjectCard
                      project={project}
                      skeleton={false}
                      key={project.id}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button onClick={() => handleMoreProject()} className="transition bg-black hover:bg-gray-700 active:bg-gray-600 p-4 shadow-xl rounded-2xl h-[3rem] w-auto flex items-center justify-center text-white" >
              More Projects
            </button>
          </div>
        </div>
        {/* ===================================== Featured Article ===================================== */}
        <div>
          <div className="py-6 mx-5 md:mx-16 overflow-x-auto scrollbar-hide animate-fadeSlideUp">
            <h2 className="text-xl mb-5 font-bold text-black">
              Featured Articles
            </h2>
            <div className="flex gap-4 w-max">
              {articleLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                  <ArticleCard skeleton={true} key={index} />
                ))
                : Array.isArray(dataArticle) &&
                dataArticle.map((article) => (
                  <ArticleCard article={article} skeleton={false} key={article.id} />
                ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button onClick={() => handleMoreArticles()} className="transition bg-black hover:bg-gray-700 active:bg-gray-600 p-4 shadow-xl rounded-2xl h-[3rem] w-auto flex items-center justify-center text-white" >
              More Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Beranda;
