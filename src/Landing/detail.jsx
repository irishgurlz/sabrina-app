import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import '../App.css';

const Beranda = () => {
  const [projectDetail, setProjectDetail] = useState(null);
  const [projectImage, setProjectImage] = useState([]);
  const [projectArticle, setProjectArticle] = useState([]);
  const [singleImage, setSingleImage] = useState(null);
  const [articleBody, setArticleBody] = useState(null);

  const [loading, setLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [projectImageVisible, setProjectImageVisible] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      navigate('/dashboard');
    }

    if (!id) return;

    axios
      .get(`https://api.kyuib.my.id/api/v1/projects/${id}`)
      .then((res) => {
        setProjectDetail(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    axios
      .get(`https://api.kyuib.my.id/api/v1/projects/${id}/images`)
      .then((res) => {
        setProjectImage(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    axios
      .get(`https://api.kyuib.my.id/api/v1/projects/${id}/articles`)
      .then((res) => {
        setProjectArticle(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

  }, [id, navigate]);

  useEffect(() => {
    if (!selectedImageId) return;

    setLoading(true);
    axios
      .get(`https://api.kyuib.my.id/api/v1/projects/${id}/images/${selectedImageId}`)
      .then((res) => {
        setSingleImage(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [selectedImageId, id]);

  const handleProjectImage = (imageId) => {
    setSelectedImageId(imageId);
    setProjectImageVisible(true);
  };



  const handleResetImage = () => {
    setProjectImageVisible(false);
    setSingleImage(null);
    setSelectedImageId(null);
  };

  const handleArticleProject = (project) => {
    navigate(`/projects/${project}/articles`);
  };

  return (
    <section>
      <div className="mx-5 md:mx-12 mb-12 mt-24 pb-2 ">
        <div className="">

          <div className="md:col-span-2 animate-fadeSlideLeft">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="mb-4">
                <span className="inline-block bg-orange-200 text-orange-800 text-xs font-semibold px-4 py-1 rounded-full shadow">
                  {projectDetail?.relationships?.category?.name}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{projectDetail?.attributes?.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-5">
                <span className="font-medium ">Waktu Pengerjaan :</span>
                <span className="text-sm text-gray-600 font-medium ">
                  {projectDetail?.attributes?.start_date && (() => {
                    const [day, month, year] = projectDetail.attributes.start_date.split("-");
                    const startDate = new Date(`${year}-${month}-${day}`);
                    const formattedStart = startDate.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });

                    const finishRaw = projectDetail.attributes.finish_date?.trim();
                    let formattedFinish = "Now";
                    if (finishRaw) {
                      const [fDay, fMonth, fYear] = finishRaw.split("-");
                      const finishDate = new Date(`${fYear}-${fMonth}-${fDay}`);
                      formattedFinish = finishDate.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                    }

                    return `${formattedStart} - ${formattedFinish}`;
                  })()}
                </span>

              </div>
              <p className="text-gray-700 text-base leading-relaxed">{projectDetail?.attributes?.description}</p>
            </div>
          </div>

        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-7 gap-6 items-stretch pb-2">
          <div className="md:col-span-5 animate-fadeSlideRight ">
            <div className="relative">
              <div className="hero min-h-[15rem]  md:min-h-[35rem] bg-cover bg-center bg-no-repeat shadow-lg overflow-hidden rounded-2xl" style={{ backgroundImage: `url(${projectImageVisible ? singleImage?.attributes?.url : projectDetail?.attributes?.hero_image_url})`, }} />
              <div className="absolute bottom-0 bg-gray-800 bg-opacity-50 rounded-b-2xl w-full text-white p-4 font-semibold text-center">
                {projectImageVisible ? singleImage?.attributes?.name : projectDetail?.attributes?.title}
              </div>
            </div>
            {/* =============== Gallery ===================*/}
            <div className="rounded-xl mt-4">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 min-w-max py-2">
                  {/* Hero image button */}
                  <div className="flex-shrink-0">
                    <button onClick={handleResetImage}>
                      <img src={projectDetail?.attributes?.hero_image_url} alt="" className="w-[10rem] h-[6rem] object-cover rounded-lg hover:opacity-80 transition duration-200" />
                    </button>
                  </div>

                  {/* Project Images */}
                  {Array.isArray(projectImage) &&
                    projectImage.map((image, index) => (
                      <div key={image.id} className="flex-shrink-0">
                        <button onClick={() => handleProjectImage(String(image.id))}>
                          <img src={image.attributes.url} alt="" className="w-[10rem] h-[6rem] object-cover rounded-lg hover:opacity-80 transition duration-200" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>

          </div>

          <div className=" md:col-span-2 animate-fadeSlideLeft pb-2">

            <div className="relative rounded-2xl shadow-md h-full px-5 pt-14 pb-2 bg-white">

              <div className="absolute top-0 left-0 w-full bg-blue-400 bg-opacity-70 rounded-t-2xl py-3 flex justify-center items-center text-xs md:text-sm text-white font-semibold z-10">
                Article In This Project
              </div>

              <div className="max-h-[620px] overflow-y-auto space-y-4 scrollbar-hide rounded-xl ">
                {Array.isArray(projectArticle) && projectArticle.map((article) => (
                  <div key={article.id} className="group bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4 shadow-md flex gap-4 items-start" >
                    <img src={article.attributes.hero_image_url} alt="Article" className="w-[7rem] h-[5rem] object-cover rounded-lg border border-gray-200 shadow-sm" />

                    <div className="flex-1">
                      <h2 className="text-base font-semibold text-gray-800 leading-snug group-hover:text-purple-500 transition">
                        {article.attributes?.title}
                      </h2>

                      <div className="mt-3">
                        <button onClick={() => handleArticleProject(projectDetail?.attributes?.slug)} className="inline-flex items-center gap-2 bg-purple-400 hover:bg-purple-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow-md transition" >
                          <span>Read Article</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>



          </div>
        </div>


      </div>
    </section>
  );
};

export default Beranda;
