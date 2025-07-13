import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { GlobalContext } from "../../contexts/GlobalContext";

const Table = () => {
  const { inputValues = {}, handleSearch, fetchArticles = [] } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { id } = useParams();
  const [idEdit, setIdEdit] = useState(null);
  const isEdit = Boolean(selectedArticle);
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalForm, setModalForm] = useState(false);
  const [selectedArtcle, setSelectedArtcle] = useState(null);
  const [idArtcle, setIdArticle] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const [formData, setFormData] = useState({
    name: '',
  });
  const [page, setPage] = useState([]);

  const navigate = useNavigate();


  const handleAddArticle = () => {
    navigate(`/dashboard/Articles/create`)
  };

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      navigate('/login');
    } else {
      if (fetchStatus) {
        axios.get("https://api.kyuib.my.id/api/v1/articles", {
          headers: { Authorization: "Bearer " + token }
        })
          .then((res) => {
            console.log(res.data.data);
            setData(res.data.data);
            setPage(res.data);
            setFetchStatus(false);
          })
          .catch((error) => {
            console.error("Fetch error:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [navigate, fetchStatus]);


  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      if (isEdit) {
        axios
          .get(`https://api.kyuib.my.id/api/v1/categories/${idEdit}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            const Article = res.data.data;
            setFormData({
              name: Article.attributes.name,
            });
          })
          .catch((err) => console.error("Error fetching Article:", err));
      }
    }
  }, [id, isEdit]);

  const handleDelete = (id) => {
    const token = Cookies.get('token');
    axios.delete(`https://api.kyuib.my.id/api/v1/articles/${id}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(() => {
        setFetchStatus(true);
        handleSearch();
        fetchArticles();
        setData((prevData) => prevData.filter((Article) => Article.id !== id));
        setModalForm(false);
      })
      .catch((err) => {
        console.error("Delete error:", err?.response?.data || err.message);
      });
  };

  const closeModal = () => {
    setModalForm(false);
  };


  const handlePagination = (url) => {
    if (!url) return;

    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        setData(res.data.data);
        setPage(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDetail = (Article) => {
    if (Article) {
      navigate(`/dashboard/articles/${Article.attributes.slug}`);
    }
  };

  const handleEditPage = (Article) => {
    navigate(`/dashboard/Articles/${Article}/edit`)
  };


  const optionButton = (article, event) => {
    setSelectedArticle(article);
    setIdArticle(article.id);
    setModalForm(true);

    setFormData({
      id: article.id,
      attributes: {
        ...article.attributes
      }
    });

    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY - 80,
      left: rect.left + rect.width + 10
    });
  };

  const filteredArticles = data.filter((article) =>
    article.attributes.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <section className="bg-white min-h-screen px-4 lg:px-20 pt-20">
      <div className="w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="relative flex items-center w-full md:w-1/3 ">
            <input className="w-full bg-white text-sm border border-slate-200 rounded-xl pl-3 pr-28 py-2 shadow-sm focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-700" placeholder="Search Here..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") setFetchStatus(true); }} />
            <button className="absolute top-1 right-1 flex items-center rounded-xl bg-slate-800 py-1 px-2.5 text-sm text-white hover:bg-slate-700" onClick={handleSearch}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" /></svg>
              Search
            </button>
          </div>
          <button onClick={handleAddArticle} className="w-full lg:w-1/3 md:w-auto mt-5 lg:mt-0 bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-400">Add Article</button>
        </div>

        <div className="w-full bg-white rounded-xl overflow-hidden">
          <div className="overflow-x-auto grid grid-cols-2 md:grid-cols-3 gap-4">
            {console.log("currentArticle", data)}
            {filteredArticles.map((Article) => (
              <div key={Article.id} className="shadow-lg bg-cover bg-center min-h-[20rem] w-full rounded-xl overflow-hidden flex flex-col justify-end relative" style={{ backgroundImage: `url(${Article.attributes.hero_image_url})`, }}>
                <div className="p-3 bg-purple-300 min-h-[5rem] w-full">
                  <div className="bg-white shadow-xl p-3 rounded-lg grid grid-cols-7">

                    <div className="col-span-6">
                      <h2 className="font-bold truncate">{Article.attributes.title}</h2>
                    </div>

                    <div className="">
                      <button onClick={(e) => (modalForm ? closeModal() : optionButton(Article, e))} className="bg-black hover:bg-gray-800 shadow-xl rounded-2xl h-[3rem] w-[3rem] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                        </svg>
                        {console.log("formData?.attributes?.slug", formData?.attributes?.slug)}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {modalForm && (
            <div className="absolute flex justify-center items-center z-50 w-fit animate-fadeSlideRight" style={{ top: `${modalPosition.top}px`, left: `${modalPosition.left}px` }}>
              <div className="bg-white w-full max-w-sm sm:max-w-md md:max-w-3xl p-2 lg:p-4 lg:max-w-2xl rounded-2xl shadow-2xl space-y-4 overflow-y-auto max-h-screen relative text-sm text-black">
                <div className="">
                  {console.log("form", formData)}
                  <button onClick={() => handleDetail(formData)} className="bg-blue-400 hover:bg-blue-500 shadow-xl rounded-2xl h-[3rem] w-[3rem] flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </button>

                  <div className="">
                    <button onClick={() => handleEditPage(selectedArticle?.attributes?.slug)} className="bg-orange-400 hover:bg-orange-500 shadow-xl rounded-2xl h-[3rem] w-[3rem] flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                  </div>

                  <button onClick={() => handleDelete(formData?.id)} className="bg-red-400 hover:bg-red-500 shadow-xl rounded-2xl h-[3rem] w-[3rem] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                  </button>

                </div>
              </div>
            </div>
          )}


        </div>
        {console.log("Page", page)}
        <div className="w-full flex justify-center py-4 mb-2">
          {page?.links && (
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 shadow-sm">
              <button disabled={!page.links.first} onClick={() => handlePagination(page.links.first)} className="px-3 py-1 rounded-md transition hover:bg-blue-100 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed">First</button>
              <button disabled={!page.links.prev} onClick={() => handlePagination(page.links.prev)} className="px-3 py-1 rounded-md transition hover:bg-blue-100 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed">Prev</button>
              <div className="bg-blue-300 rounded-md py-1 px-3">
                <span className="text-sm font-semibold text-gray-700 ">{page.meta?.current_page}</span>
              </div>
              <button disabled={!page.links.next} onClick={() => handlePagination(page.links.next)} className="px-3 py-1 rounded-md transition hover:bg-blue-100 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed">Next</button>
              <button disabled={!page.links.last} onClick={() => handlePagination(page.links.last)} className="px-3 py-1 rounded-md transition hover:bg-blue-100 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed">Last</button>
            </div>
          )}
        </div>
      </div>
    </section>

  );
};

export default Table;
