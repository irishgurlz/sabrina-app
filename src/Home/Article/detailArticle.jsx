import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import '../../App.css';

const DetailArticle = () => {
  const [ArticleDetail, setArticleDetail] = useState(null);
  const [ArticleImage, setArticleImage] = useState([]);
  const [singleImage, setSingleImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [ArticleImageVisible, setArticleImageVisible] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!id) return;

    axios
      .get(`https://api.kyuib.my.id/api/v1/articles/${id}`)
      .then((res) => {
        setArticleDetail(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    axios
      .get(`https://api.kyuib.my.id/api/v1/articles/${id}/images`)
      .then((res) => {
        setArticleImage(res.data.data);
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
      .get(`https://api.kyuib.my.id/api/v1/articles/${id}/images/${selectedImageId}`)
      .then((res) => {
        setSingleImage(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [selectedImageId, id]);

  const handleArticleImage = (imageId) => {
    setSelectedImageId(imageId);
    setArticleImageVisible(true);
  };

  const handleResetImage = () => {
    setArticleImageVisible(false);
    setSingleImage(null);
    setSelectedImageId(null);
  };

  const handleEditPage = (Article) => {
    navigate(`/dashboard/Articles/${Article}/edit`)
  };

  return (
    <section>
        {/* <h1 className="text-3xl font-bold mt-10 mb-5">{ArticleDetail?.attributes?.title}</h1> */}
      <div className="mt-16 grid grid-cols-1 gap-4 mx-5 md:mx-12">
        <div className="md:col-span-4 animate-fadeSlideRight">
          <div className="hero min-h-[15rem] md:min-h-[25rem] md:min-h-[35rem] bg-cover bg-center bg-no-repeat shadow-lg overflow-hidden rounded-2xl"
          style={{ backgroundImage: `url(${ ArticleImageVisible ? singleImage?.attributes?.url : ArticleDetail?.attributes?.hero_image_url})`,}}/>

          {/* =============== Gallery ===================*/}
          
        </div>
        <div className="md:mx-2 md:col-span-2 animate-fadeSlideLeft mb-24 mt-4">
          <div className="flex gap-2 justify-start items-center">
            <button className="bg-purple-400 text-white font-semibold px-5 lg:px-8 py-1 rounded-lg shadow-lg h-8 hover:bg-purple-500 transition mt-4">
                {ArticleDetail?.relationships?.project?.attributes?.title}
            </button>

            {/* <Link to={ArticleDetail?.attributes?.redirect_url} className="bg-pink-400 text-white font-semibold px-5 lg:px-8 py-1 rounded-lg shadow-lg h-8 hover:bg-pink-500 transition mt-4">
                Redirect Link
            </Link> */}

            <div className="mt-4">
                <button onClick={() => handleEditPage(ArticleDetail?.attributes?.slug)} className="bg-orange-400 hover:bg-orange-500 shadow-xl rounded-lg h-[2rem] w-[5rem] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                </button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{ArticleDetail?.attributes?.title}</h1>
            <p className="text-gray-700 text-base leading-relaxed">{ArticleDetail?.attributes?.body}</p>
            
          </div>

        </div>
      </div>
    </section>
  );
};

export default DetailArticle;
