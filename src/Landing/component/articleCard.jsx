import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ArticleCard({ article, skeleton }) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    if (!skeleton) {
      const img = new Image();
      img.src = article.attributes.hero_image_url;
      img.onload = () => setLoaded(true);
    }
  }, [article, skeleton]);

  const handleDetailArticle = () => {
    const slug = article.attributes.slug;
    if (!token) {
      navigate(`/articles/${slug}`);
    } else {
      navigate(`/dashboard/articles/${slug}`);
    }
  };

  return (
    <div className="w-[18rem] rounded-2xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
      <div className={`h-[10rem] w-full bg-cover bg-center transition-all duration-500 ${loaded ? "" : "bg-slate-300 animate-pulse"
        }`}
        style={
          loaded && !skeleton
            ? { backgroundImage: `url(${article.attributes.hero_image_url})` }
            : {}
        }
      ></div>

      <div className="px-4 py-3">
        {skeleton ? (
          <div className="w-2/3 h-4 rounded-lg bg-slate-300 "></div>
        ) : (
          <>
            <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-2">
              {article.attributes.title
                .split(" ")
                .slice(0, 3)
                .join(" ") + (article.attributes.title.split(" ").length > 3 ? "..." : "")}
            </h3>

            <button onClick={handleDetailArticle}
              className="mt-auto text-xs font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:bg-blue-700 hover:opacity-70 active:scale-95 transition p-1 rounded-lg w-full"
            >
              Detail Article
            </button>
          </>
        )}
      </div>
    </div>
  );
}
