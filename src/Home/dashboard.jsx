import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Cookies from "js-cookie"
import { GlobalContext } from "../contexts/GlobalContext";

const Dashboard = () => {
  const { filteredData = [] } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();
  const [totalArticleCount, setTotalArticleCount] = useState(0);
  const [totalProjectCount, setTotalProjectCount] = useState(0);
  const [totalCategoryCount, setTotalCategoryCount] = useState(0);



  useEffect(() => {
    const token = Cookies.get('token');
    const name = Cookies.get('name');
    // const image = Cookies.get('image_url');
    console.log('Name: ', name);

    if (!token) {
      navigate('/login');
      return;
    }

    setName(name);
    setImage(image);

    axios.get("URL_API_KAMU", {
      headers: { "Authorization": "Bearer " + token }
    })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [navigate]);


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`https://api.kyuib.my.id/api/v1/articles`);
        const total = res.data.meta?.total || 0;
        setTotalArticleCount(total);
      } catch (error) {
        console.error("Fetch Error: ", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await axios.get(`https://api.kyuib.my.id/api/v1/projects`);
        const total = res.data.meta?.total || 0;
        setTotalProjectCount(total);
      } catch (error) {
        console.error("Fetch Error: ", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`https://api.kyuib.my.id/api/v1/categories`);
        const total = res.data.meta?.total || 0;
        setTotalCategoryCount(total);
      } catch (error) {
        console.error("Fetch Error: ", error);
      }
    };


    fetchArticles();
    fetchProjects();
    fetchCategories();
  }, []);

  const handleProjectPage = () => {
    navigate('/dashboard/projects');
  };

  const handleCategoryPage = () => {
    navigate('/dashboard/category');
  };

  const handleArticlePage = () => {
    navigate('/dashboard/articles');
  };

  return (
    <section className="px-8 py-6">
      <div className="flex flex-col gap-6">
        <div className="w-full bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 rounded-2xl p-6 text-white shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome Back, {name}!</h1>
            <p className="text-sm mt-1">Glad to see you again. Here's a quick overview of your dashboard today</p>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button onClick={handleCategoryPage} className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-purple-200 p-4 rounded-xl text-purple-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.04 16.5.5-1.5h6.42l.5 1.5H8.29Zm7.46-12a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm-3 2.25a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 1.5 0V9Zm-3 2.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Categories</h2>
              <p className="text-sm text-gray-500 text-start">{totalCategoryCount} Total</p>
            </div>
          </button>

          <button onClick={handleProjectPage} className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-pink-200 p-4 rounded-xl text-pink-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Projects</h2>
              <p className="text-sm text-gray-500 text-start">{totalProjectCount} Total</p>
            </div>
          </button>

          <button onClick={handleArticlePage} className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-blue-200 p-4 rounded-xl text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clipRule="evenodd" />
                <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Articles</h2>
              <p className="text-sm text-gray-500 text-start">{totalArticleCount} Total</p>
            </div>
          </button>
        </div>
      </div>
    </section>

  );
};

export default Dashboard;
