import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";
import Cookies from "js-cookie";
import "../App.css";
import { API_BASE_URL } from "../init";

const Beranda = () => {
  const {
    inputValues = {},
    formatRupiah,
    handleChange,
    handleSearch,
    HandleSelect,
    filteredData = [],
  } = useContext(GlobalContext);

  const [dataProject, setDataProject] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [projectCategoryVisible, setProjectCategoryVisible] = useState(false);

  const fetchProjects = async () => {
    axios
      .get(`${API_BASE_URL}/projects`)
      .then((res) => {
        setDataProject(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      }); 
  };

  const fetchCategories = async () => {
    axios
      .get(`${API_BASE_URL}/categories`)
      .then((res) => {
        setDataCategory(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  const fetchProjectsByCategory = async (category) => {
    setLoading(true);
    if (category) {
      const slug = category.attributes.slug;
      axios.get(`${API_BASE_URL}/categories/${slug}/projects`)
      .then((res) => {
        console.log(res.data.data);
        setDataProject(res.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      })
    }
  }

  useEffect(() => {
    if (dataProject.length === 0) {
      fetchProjects();
      fetchCategories();
    }
  }, []);

  useEffect(() => {
    console.log("Data project: ", dataProject);
  }, [dataProject]);

  const handleProjectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setProjectCategoryVisible(true);
  };

  const filteredProjects = useMemo(() => {
    if (!selectedCategoryId) return dataProject;
    return dataProject.filter(
      (project) =>
        project.relationships?.category?.id === String(selectedCategoryId)
    );
  }, [dataProject, selectedCategoryId]);

  const handleDetail = (project) => {
    navigate(`/detail-project/${project}`);
  };

  return (
    <section className="bg-white">
      <div className="mt-24 px-4 md:px-8 lg:px-16 mx-auto animate-fadeSlideUp">
        {/* Header */}
        <div className="w-full text-center">
          <h1 className="text-xl md:text-4xl font-bold text-black mb-6">
            My Project
          </h1>
        </div>

        {/* Search Box */}
        <div className="w-full py-6">
          <div className="relative">
            <input
              className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-3xl pl-3 pr-28 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-lg focus:shadow"
              placeholder="Search Here..."
              onChange={(e) => handleChange("title", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              className="absolute mt-1 top-1 right-1 flex items-center rounded-3xl bg-slate-800 py-2 px-8 border border-transparent text-sm text-white shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 mr-1"
              type="button"
              onClick={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Search
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6 mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 w-max">
            {Array.isArray(dataCategory) &&
              dataCategory.map((category) => (
                <button
                  key={category.id}
                  onClick={() => fetchProjectsByCategory(category)}
                  className="rounded-xl px-4 py-2 bg-orange-300 hover:bg-orange-400 active:bg-orange-500 flex-shrink-0"
                >
                  {category.attributes.name}
                </button>
              ))}
          </div>
        </div>

        {/* Project Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 pt-6 pb-12 w-full">
          {!projectCategoryVisible &&
            (loading ? (
              <div className="col-span-full flex justify-center items-center">
                <img
                  src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-05-37_512.gif"
                  className="w-[60px] h-[60px]"
                  alt="Loading..."
                />
              </div>
            ) : (
              dataProject.map((project) => (
                <div
                  key={project.id}
                  className="shadow-lg bg-cover bg-center min-h-[15rem] w-full rounded-xl overflow-hidden flex flex-col justify-end relative"
                  style={{
                    backgroundImage: `url(${project.attributes.hero_image_url})`,
                  }}
                >
                  <div className="p-3 bg-purple-300 min-h-[5rem] w-full">
                    <div className="bg-white shadow-xl p-3 rounded-lg grid grid-cols-6">
                      <div className="col-span-5">
                        <h2 className="font-bold truncate">
                          {project.attributes.title}
                        </h2>
                        <p className="text-sm">
                          {" "}
                          {/* {project.attributes.description
                            .split(" ")
                            .slice(0, 3)
                            .join(" ") ?? ""} */}
                          ...
                        </p>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => handleDetail(project.id)}
                          className="bg-pink-400 hover:bg-pink-500 shadow-xl rounded-2xl h-[3rem] w-[3rem] flex items-center justify-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ))}

          {projectCategoryVisible &&
            filteredProjects.map((projectCategory) => (
              <div
                key={projectCategory.id}
                className="shadow-lg bg-cover bg-center min-h-[15rem] w-full rounded-xl overflow-hidden flex flex-col justify-end relative"
                style={{
                  backgroundImage: `url(${projectCategory.attributes.hero_image_url})`,
                }}
              >
                <div className="p-3 bg-purple-300 min-h-[5rem] w-full">
                  <div className="bg-white shadow-xl p-3 rounded-lg grid grid-cols-6">
                    <div className="col-span-5">
                      <h2 className="font-bold truncate">
                        {projectCategory.attributes.title}
                      </h2>
                      <p className="text-sm">
                        {projectCategory.attributes.description
                          .split(" ")
                          .slice(0, 3)
                          .join(" ") ?? ""}
                        ...
                      </p>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => handleDetail(projectCategory.id)}
                        className="bg-pink-400 hover:bg-pink-500 shadow-xl rounded-2xl h-[3rem] w-[3rem] flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Beranda;
