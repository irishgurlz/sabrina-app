import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import '../../App.css';

const DetailProject = () => {
  const [projectDetail, setProjectDetail] = useState(null);
  const [projectImage, setProjectImage] = useState([]);
  const [singleImage, setSingleImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [projectImageVisible, setProjectImageVisible] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = Cookies.get('token');

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

  const handleEditPage = (Project) => {
    navigate(`/dashboard/projects/${Project}/edit`)
  };

  const handleArticleProject = (project) => {
    navigate(`/dashboard/projects/${project}/articles`);
  };

  return (
    <section>
        {/* <h1 className="text-3xl font-bold mt-10 mb-5">{projectDetail?.attributes?.title}</h1> */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-6 gap-4 mx-5 md:mx-12">
        <div className="md:col-span-4 animate-fadeSlideRight">
          <div className="hero min-h-[15rem] md:min-h-[25rem] md:min-h-[35rem] bg-cover bg-center bg-no-repeat shadow-lg overflow-hidden rounded-2xl"
          style={{ backgroundImage: `url(${ projectImageVisible ? singleImage?.attributes?.url : projectDetail?.attributes?.hero_image_url})`,}}/>

          {/* =============== Gallery ===================*/}
          <div className="bg-white rounded-xl py-4">
            <div className="max-w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
              <div className="flex gap-4">
                {projectImageVisible && (
                  <button onClick={handleResetImage} className="flex-shrink-0 relative inline-block">
                    <img src={projectDetail?.attributes?.hero_image_url} alt="" className="w-[10rem] h-[6rem] rounded-lg hover:opacity-80 transition duration-200" />
                  </button>
                )}

                {Array.isArray(projectImage) && projectImage.map((image, index) => (
                  <button key={image.id} onClick={() => handleProjectImage(String(image.id))} className="flex-shrink-0 relative inline-block">
                    <div className="absolute top-1 left-1 z-10 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded">{index + 1}</div>
                    <img src={image.attributes.url} alt="" className="w-[10rem] h-[6rem] object-cover rounded-lg hover:opacity-80 transition duration-200" />
                  </button>
                ))}

              </div>
            </div>
          </div>
        </div>
        <div className="md:mx-2 md:col-span-2 animate-fadeSlideLeft">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="grid grid-cols-3">
              <p className="rounded-xl shadow-xl mb-5 p-3 text-sm h-[1rem] w-[10rem] bg-orange-300 flex justify-center items-center relative text-xs text-gray-600">{projectDetail?.relationships?.category?.name}</p>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{projectDetail?.attributes?.title}</h1>
            <p className="text-gray-700 text-base leading-relaxed">{projectDetail?.attributes?.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-5">
              <span className="text-lg">⏳ :</span>
              <span className="font-medium">
                {projectDetail?.attributes?.start_date} - {projectDetail?.attributes?.finish_date ?? "-"}
              </span>
            </div>
          </div>

          <div className="flex gap-2 justify-center items-center">
            <button onClick={() => handleArticleProject(projectDetail?.attributes?.slug)} className="bg-purple-400 text-white font-semibold px-5 lg:px-8 py-1 rounded-lg shadow-lg h-8 hover:bg-purple-500 transition mt-4">
                Go to Article
            </button>
            {/* 
            <Link to={`/dashboard/articles/${projectDetail?.relationships?.articles}`} className="bg-purple-400 text-white font-semibold px-5 lg:px-8 py-1 rounded-lg shadow-lg h-8 hover:bg-purple-500 transition mt-4">
                Go to Article
            </Link> */}

            <Link to={projectDetail?.attributes?.redirect_url} className="bg-pink-400 text-white font-semibold px-5 lg:px-8 py-1 rounded-lg shadow-lg h-8 hover:bg-pink-500 transition mt-4">
                Redirect Link
            </Link>

            <div className="mt-4">
                <button onClick={() => handleEditPage(projectDetail?.attributes?.slug)} className="bg-orange-400 hover:bg-orange-500 shadow-xl rounded-lg h-[2rem] w-[5rem] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailProject;
