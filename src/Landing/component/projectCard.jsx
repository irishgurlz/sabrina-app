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

  const handleDetail = (project) => {
    if (project) {
      navigate(`/projects/${project.attributes.slug}`);
    }
  };

  const handleCategory = (project) => {
    if (project) {
      navigate(`/categories/${project.relationships.category?.slug}/projects`);
    }
  }

  return (
    <div
      className={`shadow-lg bg-cover bg-center min-h-[15rem] md:min-h-[20rem] w-[18rem] rounded-xl overflow-hidden flex-shrink-0 flex flex-col justify-end relative transition-all duration-500 ${
        loaded ? "" : "bg-slate-300 animate-pulse"
      }`}
      style={
        loaded && !skeleton
          ? { backgroundImage: `url(${project.attributes.hero_image_url})` }
          : {}
      }
    >
      <div
        className={`p-2 min-h-[5rem] w-full ${
          skeleton ? "bg-slate-300" : "bg-purple-300 "
        }`}
      >
        <div className="flex flex-col gap-2 bg-white shadow-xl p-4 rounded-lg">
          {skeleton ? (
            <>
              <div className="w-full h-4 rounded-lg bg-slate-300"></div>
              <div className="w-24 h-4 rounded-lg bg-slate-300"></div>
            </>
          ) : (
            <>
              <h2
                className="font-bold overflow-hidden text-ellipsis whitespace-nowrap w-full max-w-full transition underline-offset-2 hover:cursor-pointer hover:underline active:text-pink-400"
                onClick={() => handleDetail(project)}
              >
                {project.attributes.title}
              </h2>
              <p className="rounded-xl shadow-xl px-2 py-1 text-xxs bg-orange-300 w-fit transition hover:cursor-pointer hover:bg-orange-400 active:bg-orange-300" onClick={() => handleCategory(project)}>
                {project.relationships.category?.name}
              </p>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => handleDetail(project)}
        className={`rounded-2xl h-[3rem] w-[3rem] z-50 absolute top-24 md:top-40 right-2 flex items-center justify-center shadow-md transition 
					${skeleton ? "bg-slate-400" : "bg-pink-400 hover:bg-pink-500 active:bg-pink-400 transition-all"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </button>
    </div>
  );
}
