import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import '../App.css';

const Beranda = () => {
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
      {/* <h1 className="text-3xl font-bold mt-10 mb-5">{projectDetail?.attributes?.title}</h1> */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-6 gap-4 mx-5 md:mx-12">
        <div className="md:col-span-4 animate-fadeSlideRight">
          <div className="hero min-h-[15rem] md:min-h-[25rem] md:min-h-[35rem] bg-cover bg-center bg-no-repeat shadow-lg overflow-hidden rounded-2xl"
            style={{ backgroundImage: `url(${projectImageVisible ? singleImage?.attributes?.url : projectDetail?.attributes?.hero_image_url})`, }} />
          <h1 className="text-xl font-bold mt-5">{projectDetail?.attributes?.title}</h1>

          {/* =============== Gallery ===================*/}
          <div className="bg-white rounded-xl py-4">
            <div className="max-w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
              <div className="flex gap-4">

                <div className="shadow-md rounded-xl p-2 my-2">
                  <button onClick={handleResetImage} className="flex-shrink-0 relative inline-block">
                    <img src={projectDetail?.attributes?.hero_image_url} alt="" className="w-[10rem] h-[6rem] rounded-lg hover:opacity-80 transition duration-200" />
                  </button>

                  <div>
                    <h1 className="text-xs font-bold mt-2">{projectDetail?.attributes?.title?.split(" ").slice(0, 4).join(" ")} ...</h1>
                  </div>
                </div>

                {Array.isArray(projectImage) && projectImage.map((image, index) => (
                  <div className="bg-white shadow-md rounded-xl p-2 my-2">
                    <button key={image.id} onClick={() => handleProjectImage(String(image.id))} className="flex-shrink-0 relative inline-block">
                      {/* <div className="absolute top-1 left-1 z-10 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded">{index + 1}</div> */}
                      <img src={image.attributes.url} alt="" className="w-[10rem] h-[6rem] object-cover rounded-lg hover:opacity-80 transition duration-200" />
                    </button>

                    <div>
                      <h1 className="text-xs font-bold mt-2">{image.attributes?.name.split(" ").slice(0, 4).join(" ")} ...</h1>
                    </div>
                  </div>
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
                {projectDetail?.attributes?.start_date} - {projectDetail?.attributes?.finish_date === "" ? "Now" : projectDetail?.attributes?.finish_date}
              </span>
            </div>
          </div>

          <div className="flex gap-2 justify-start items-center">
            <button onClick={() => handleArticleProject(projectDetail?.attributes?.slug)} className="bg-purple-400 text-white font-semibold px-5 lg:px-8 py-1 rounded-lg shadow-lg h-8 hover:bg-purple-500 transition mt-4">
              Go to Article
            </button>

            <Link to={projectDetail?.attributes?.redirect_url} className="bg-pink-400 text-white font-semibold px-5 lg:px-8 py-1 rounded-lg shadow-lg h-8 hover:bg-pink-500 transition mt-4">
              Redirect Link
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Beranda;
