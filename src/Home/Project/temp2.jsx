import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project, skeleton }) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!skeleton) {
      const img = new Image();
      img.src = project.attributes.hero_image_url;
      img.onload = () => setLoaded(true);
    }
  }, [project, skeleton]);

  const handleDetail = () => {
    navigate(`/projects/${project.attributes.slug}`);
  };

  const handleCategory = () => {
    const slug = project.relationships.category?.slug;
    if (slug) navigate(`/categories/${slug}/projects`);
  };

  return (
    <div
      className={`relative flex flex-col justify-end min-h-[20rem] w-[18rem] rounded-2xl overflow-hidden shadow-lg group transition-all duration-500 ${loaded ? "" : "bg-slate-200 animate-pulse"
        }`}
      style={
        loaded && !skeleton
          ? {
            backgroundImage: `url(${project.attributes.hero_image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
          : {}
      }>

      <div className={`p-4 w-full backdrop-blur-sm bg-white/80 transition`}>
        <div className="flex flex-col gap-2">
          {skeleton ? (
            <>
              <div className="w-full h-4 rounded bg-slate-300"></div>
              <div className="w-1/3 h-4 rounded bg-slate-300"></div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-4">
                <div className="col-span-3">
                  <h2 onClick={handleDetail} className="font-semibold text-slate-800 text-sm md:text-base truncate cursor-pointer hover:underline underline-offset-2 transition" >
                    {project.attributes.title}
                  </h2>
                  <span onClick={handleCategory} className="inline-block w-fit px-2 py-1 text-xs rounded-full text-violet-900 bg-violet-200 shadow-sm cursor-pointer hover:bg-violet-300 active:bg-violet-400 transition" >
                    {project.relationships.category?.name}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <button onClick={handleDetail} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold p-3 rounded-xl shadow-md hover:opacity-90 active:scale-95 transition" >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path fillRule="evenodd" d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z" clipRule="evenodd" />
                    </svg>

                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Button */}
      {/* {!skeleton && (
        <button onClick={handleDetail} className="absolute top-4 right-4 z-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md hover:opacity-90 active:scale-95 transition" >
          Lihat Detail
        </button>
      )} */}
    </div>
  );
}
