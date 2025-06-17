import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { GlobalContext } from "../../contexts/GlobalContext";

const Table = () => {
  const { inputValues = {},  formatRupiah,  handleSearch, HandleSalary, HandleSelect, fetchProjects, filteredData = [] } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(true);
  const [modalForm, setModalForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); 
  const { id } = useParams();
  const [idEdit, setIdEdit] = useState(null);
  const isEdit = Boolean(selectedProject);
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
  });
  const [page, setPage ] = useState([]);
  
  const navigate = useNavigate();


  const handleAddProject = () => {
    navigate(`/dashboard/projects/create`)   
  };




  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      navigate('/login');
    } else {
      if (fetchStatus) {
        axios.get("https://api.kyuib.my.id/api/v1/projects", {
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
            const Project = res.data.data;
            setFormData({
              name: Project.attributes.name,
            });
          })
          .catch((err) => console.error("Error fetching Project:", err));
      }
    }
    }, [id, isEdit]);
  
  console.log("panjang:", data.length);
  const handleDelete = (id) => {
    const token = Cookies.get('token');
    axios.delete(`https://api.kyuib.my.id/api/v1/projects/${id}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(() => {
        setFetchStatus(true);
        handleSearch();
        fetchProjects(); 
        setData((prevData) => prevData.filter((Project) => Project.id !== id));
      })
      .catch((err) => {
        console.error("Delete error:", err?.response?.data || err.message);
      });
  };

  const closeModal = () => {
    setModalForm(false); 
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
    };

    const token = Cookies.get("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const request = isEdit
      ? axios.put(`https://api.kyuib.my.id/api/v1/categories/${idEdit}`, updatedFormData, config)
      : axios.post('https://api.kyuib.my.id/api/v1/categories', updatedFormData, config);

    request
      .then(() => {
        fetchProjects(); 
        setFetchStatus(true);
        setModalForm(false);
      })
      .catch((err) => {
        console.error("Submit error:", err);
        alert("Failed to submit job posting, please try again.");
      });
  };

  const handleDetail = (project) => {
    if (project) {
      navigate(`/dashboard/projects/${project.attributes.slug}`);
    }
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
      <button onClick={handleAddProject} className="w-full lg:w-1/3 md:w-auto mt-5 lg:mt-0 bg-blue-500 text-white rounded-xl px-4 py-2 hover:bg-blue-400">Add Project</button>
    </div>

    <div className="w-full bg-white rounded-xl overflow-hidden">
      <div className="overflow-x-auto grid grid-cols-2 md:grid-cols-3 gap-4">
        {console.log("currentProject", data)}
            {data.map((project) => (
              <div key={project.id} className="shadow-lg bg-cover bg-center min-h-[20rem] w-full rounded-xl overflow-hidden flex flex-col justify-end relative" style={{backgroundImage: `url(${project.attributes.hero_image_url})`,}}>
                  <div className="p-3 bg-purple-300 min-h-[5rem] w-full">
                    <div className="bg-white shadow-xl p-3 rounded-lg grid grid-cols-7">

                      <div className="col-span-5">
                        <h2 className="font-bold truncate">{project.attributes.title}</h2>
                        <p className="text-sm"> {project.attributes.description.split(" ").slice(0, 3).join(" ") ?? ""}...</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2 col-span-2 ">
                        <div className="col-span-1 flex justify-end">
                          <button onClick={() => handleDetail(project)} className="bg-blue-400 hover:bg-blue-500 shadow-xl rounded-2xl h-[3rem] w-[3rem] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"/>
                            </svg>
                          </button>
                        </div>

                        <div className="col-span-1 flex justify-end">
                          <button onClick={() => handleDelete(project.id)} className="bg-red-400 hover:bg-red-500 shadow-xl rounded-2xl h-[3rem] w-[3rem] flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
            ))}
      </div>
    {modalForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
        <div className="bg-white w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-2xl p-4 sm:p-6 rounded-2xl shadow-xl space-y-4 overflow-y-auto max-h-screen relative text-sm text-black">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">{isEdit ? "Edit Project" : "Add New Project"}</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 px-4">
              <input type="text" placeholder="Project Name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className="border border-gray-300 mb-8 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              <div className="flex justify-between md:col-span-2 mt-4">
                <button type="button" onClick={closeModal} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-xl transition">Back</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition ">{isEdit ? "Update Project" : "Create Project"}</button>
              </div>
            </form>
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
