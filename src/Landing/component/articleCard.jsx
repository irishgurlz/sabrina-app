import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


export default function ArticleCard({ article, skeleton }) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const token = Cookies.get('token');


  useEffect(() => {
    if (!skeleton) {
      const img = new Image();
      img.src = article.attributes.hero_image_url;
      img.onload = () => setLoaded(true);
    }
  }, [article, skeleton]);

  const handleDetailArticle = (article) => {
    if(!token){
      if (article) {
        navigate(`/articles/${article.attributes.slug}`);
      }
    }
    else{
      navigate(`/dashboard/articles/${article.attributes.slug}`);
    }
  };

  return (
    <div>
      <div
        className={`bg-cover bg-center min-h-[10rem] md:min-h-[10rem] w-[18rem] shadow-lg rounded-xl overflow-hidden flex-shrink-0 flex flex-col justify-end ${
          loaded ? "" : "bg-slate-300 animate-pulse"
        }`}
        style={
          loaded && !skeleton
            ? { backgroundImage: `url(${article.attributes.hero_image_url})` }
            : {}
        }
      ></div>
      <div className="w-[18rem] px-2 py-3">
        {skeleton ? (
          <div className="w-2/3 h-4 rounded-lg bg-slate-300"></div>
        ) : (
          <div
            className="font-bold overflow-hidden text-ellipsis whitespace-nowrap w-full max-w-full transition underline-offset-2 hover:cursor-pointer hover:underline active:text-pink-400"
            onClick={() => handleDetailArticle(article)}
          >
            {article.attributes.title}
          </div>
        )}
      </div>
    </div>
  );
}
