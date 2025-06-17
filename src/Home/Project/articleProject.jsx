import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import '../../App.css';
import ArticleCard from '../../Landing/component/articleCard';
import { GlobalContext } from "../../contexts/GlobalContext";


const DetailArticle = () => {
  const [ArticleDetail, setArticleDetail] = useState(null);
  const [ArticleImage, setArticleImage] = useState([]);
  const [singleImage, setSingleImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [ArticleImageVisible, setArticleImageVisible] = useState(false);
  const { inputValues = {},  handleSearch, fetchArticles= [] } = useContext(GlobalContext);
  

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!id) return;
    axios
    .get(`https://api.kyuib.my.id/api/v1/projects/${id}/articles`)
    .then((res) => {
        setArticleDetail(res.data.data);
        console.log("data", ArticleDetail) 
        setLoading(false);
      })
      .catch(() => {
        console.error("Fetch Error: ", error);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [id, navigate]);


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
  const handleAddArticle = () => {
    navigate(`/dashboard/Articles/create`)   
  };

  return (
    <section className="bg-white min-h-screen px-4 lg:px-20 pt-20">
      <div className="w-full space-y-6">
       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="relative flex items-center w-full md:w-1/3 ">
        <input className="w-full bg-white text-sm border border-slate-200 rounded-xl pl-3 pr-28 py-2 shadow-sm focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-700" placeholder="Search Here..." value={inputValues.title || ''} onChange={(e) => handleChange("title", e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
        <button className="absolute top-1 right-1 flex items-center rounded-xl bg-slate-800 py-1 px-2.5 text-sm text-white hover:bg-slate-700" onClick={handleSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" /></svg>
          Search
        </button>
      </div>
      <button onClick={handleAddArticle} className="w-full lg:w-1/3 md:w-auto mt-5 lg:mt-0 bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-400">Add Article</button>
    </div>
      <div className="flex gap-4 w-max">
        {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <ArticleCard skeleton={true} key={index} />
            ))
            : Array.isArray(ArticleDetail) &&
            ArticleDetail.map((article) => (
                <ArticleCard
                article={article}
                skeleton={false}
                key={article.id}
                />
            ))}
        </div>
      </div>
        
    </section>



  );
};

export default DetailArticle;
