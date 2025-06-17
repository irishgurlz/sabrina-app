import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import '../App.css';
import ArticleCard from './component/articleCard';


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

  return (
    <section className="bg-white min-h-screen px-4 lg:px-20 pt-20 mt-12">
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
        
    </section>



  );
};

export default DetailArticle;
