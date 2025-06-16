import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext"; 
import Cookies from "js-cookie"
import '../App.css';

const Beranda = () => {
  const { inputValues = {}, handleChange, handleSearch, HandleSalary, filtereddataProject = [] } = useContext(GlobalContext); 
  const [dataProject, setdataProject] = useState([]);
  const [dataArticle, setdataArticle] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [projectCategoryVisible, setProjectCategoryVisible] = useState(false); 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userRes = await axios.get("https://api.kyuib.my.id/api/v1/landing-pages/1");
        setDataUser(userRes.data.data);

        const featuredResponse = await axios.get("https://api.kyuib.my.id/api/v1/landing-pages/1/featured-projects");
        const featuredProjects = featuredResponse.data.data;

        const detailResponses = await Promise.all(
          featuredProjects.map(item => axios.get(item.links.self))
        );
        
        const detailedProjects = detailResponses.map(res => res.data.data);
        setdataProject(detailedProjects);

        // const categoryRes = await axios.get("https://api.kyuib.my.id/api/v1/categories");
        // setdataCategory(categoryRes.data.data);

        const articleRes = await axios.get("https://api.kyuib.my.id/api/v1/landing-pages/1/featured-articles");
        setdataArticle(articleRes.data.data);

      } catch (error) {
        console.error("Error saat fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleDetail = (project) => {
    navigate(`/detail-project/${project}`);
  };

  const handleMoreProject = () => {
    navigate(`/all-project`);
  };

  const handleProjectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setProjectCategoryVisible(true);
  };

  const filteredProjects = useMemo(() => {
    if (!selectedCategoryId) return dataProject;
    return dataProject.filter(project => 
      project.attributes.category_id === Number(selectedCategoryId)
    );

  }, [dataProject, selectedCategoryId]);


  const baseColors = [
    "bg-blue-300",
    "bg-red-300",
    "bg-pink-300",
    "bg-green-300",
    "bg-yellow-300",
    "bg-orange-300"
  ];

  const hoverColors = [
    "hover:bg-blue-400",
    "hover:bg-red-400",
    "hover:bg-pink-400",
    "hover:bg-green-400",
    "hover:bg-yellow-400",
    "hover:bg-orange-400"
  ];



  return (
    <section className="bg-white">
      <div className="">
        <div className="w-full">
        {/* ======== CARD ATAS =========== */}
        <div className="hero min-h-[20rem] md:min-h-[30rem] bg-cover bg-center bg-no-repeat shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 mt-4 pt-5 shadow-xl" style={{ backgroundImage: `url(${dataUser?.attributes?.hero_image_url})` }}>
            <div className="flex flex-col justify-end mt-16 px-6 md:pl-16 text-center md:text-left">
              {console.log("data:", dataUser?.attributes?.display_name)}
              <h1 className="hidden md:block text-3xl font-bold text-white">{dataUser?.attributes?.display_name}</h1>
              <h3 className="text-xl text-white mt-2 mb-4 typing-effect ">{dataUser?.attributes?.job_title}</h3>
            </div>
          </div>
        </div>

        {/* ===================================== Get To Know Me ===================================== */}
        <div className="px-8 md:px-16 grid md:grid-cols-2 xl:grid-cols-2 pt-5 gap-5 pb-5 w-full">
          <div className="hero min-h-[10rem] md:min-h-[20rem] bg-cover bg-center rounded-lg shadow-lg overflow-hidden mt-4 pt-5 shadow-xl animate-fadeSlideRight" style={{ backgroundImage:`url(${dataUser?.attributes?.about_me_image_url})` }}>
            
          </div>
          <div className="min-h-[10rem] md:min-h-[20rem] overflow-hidden mt-4 md:px-5  animate-fadeSlideLeft">
            <div className="">
              <h1 className="text-lg font-bold mb-2">Get to Know Me</h1>
              <h1 className="text-2xl font-bold mb-2">{dataUser?.attributes?.about_me_title}</h1>
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
              { (
                loading ? (
                  <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
                    <img src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-05-37_512.gif" className="w-[60px] h-[60px]" alt="" />
                  </div>
                ) : (
                  Array.isArray(dataProject) && dataProject.map((project) => (
                    <div key={project.id} className="shadow-lg bg-cover bg-center min-h-[15rem] md:min-h-[20rem] w-[18rem] rounded-xl overflow-hidden flex-shrink-0 flex flex-col justify-end relative"
                      style={{ backgroundImage: `url(${project.attributes.hero_image_url})` }}>
                      <div className="px-3 py-2 bg-purple-300 min-h-[5rem] w-full">
                        <div className="flex flex-col gap-1 bg-white shadow-xl p-3 rounded-lg">
                          <h2 className="font-bold overflow-hidden text-ellipsis whitespace-nowrap w-full max-w-full">{project.attributes.title}</h2>
                          <p className="rounded-xl shadow-xl px-2 py-1 text-xxs bg-orange-300 w-fit">{project.relationships.category?.name}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDetail(project.attributes.slug)} className="bg-pink-400 hover:bg-pink-500 rounded-2xl h-[3rem] w-[3rem] z-50 absolute top-24 md:top-44 right-2 flex items-center justify-center shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                      </button>
                    </div>
                  ))
                )
              )}

              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
              <button onClick={() => handleMoreProject()} className="bg-pink-400 hover:bg-pink-500 p-5 shadow-xl rounded-xl h-[3rem] w-auto flex items-center justify-center shadow-lg text-white">
                More Projects
              </button>
            </div>
          </div>
        {/* ===================================== Featured Article ===================================== */}
        <div>
          <div className="py-6 mx-5 md:mx-16 overflow-x-auto scrollbar-hide animate-fadeSlideUp">
            <h2 className="text-xl mb-5 font-bold text-black">Featured Articles</h2>
            <div className="flex gap-4 w-max">
            {(
              loading ? (
                <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
                  <img src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-05-37_512.gif" className="w-[60px] h-[60px]" alt="" />
                </div>
                ) : (Array.isArray(dataArticle) && dataArticle.map((article) => (
                  <div>
                    <div key={article.attributes.id} className="bg-cover bg-center min-h-[10rem] md:min-h-[10rem] w-[18rem] shadow-lg rounded-xl overflow-hidden flex-shrink-0 flex flex-col justify-end"
                    style={{ backgroundImage: `url(${article.attributes.hero_image_url})` }}>  
                    </div>
                    <div className="w-[18rem] px-2 py-3">
                      <h2 className=" font-bold overflow-hidden text-ellipsis whitespace-nowrap w-full max-w-full">{article.attributes.title}</h2>
                      {/* <p className="text-sm">{article.attributes.description.split(' ').slice(0, 3).join(' ') ?? ''}</p> */}
                    </div>
                  </div>
                ))
              )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Beranda;
