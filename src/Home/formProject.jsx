import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { GlobalContext } from "../contexts/GlobalContext";

const Form = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchProjects } = useContext(GlobalContext);
  const [dataCategory, setDataCategory] = useState([]);
  const [name, setName] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    hero_image_url: '',
    description: '',
    redirect_url: '',
    start_date: '',
    finish_date: '',
    category_id: '',      
    // owner_id: '',   
  });

  const token = Cookies.get("token");
  const isEdit = Boolean(id);

  useEffect(() => {
    const name = Cookies.get('id');
    console.log(name);

    if (!token) {
      navigate('/login');
    } else {
      if (isEdit) {
        axios
          .get(`https://api.kyuib.my.id/api/v1/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            const project = res.data.data;
            setFormData({
                title: project.attributes.title,
                hero_image_url: project.attributes.hero_image_url,
                description: project.attributes.description,
                redirect_url: project.attributes.redirect_url,
                start_date: project.attributes.start_date,
                finish_date: project.attributes.finish_date,
                category_id: project.attributes.category_id,      
                // owner_id: project.owner_id,  
            });
          })
          .catch((err) => console.error("Error fetching job:", err));
      }
    }
    }, [id, isEdit]);

  useEffect(() => {
    axios.get("https://api.kyuib.my.id/api/v1/categories")
          .then((res) => {
            setDataCategory(res.data.data);
          })
          .catch((error) => {
            console.error("Fetch error:", error);
          });
  }, [navigate]);


  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formToSend = new FormData();
    formToSend.append("title", formData.title);
    formToSend.append("description", formData.description);
    formToSend.append("redirect_url", formData.redirect_url);
    formToSend.append("start_date", formData.start_date);
    formToSend.append("finish_date", formData.finish_date);
    formToSend.append("category_id", formData.category_id);
    formToSend.append("hero_image", formData.hero_image_url); 

    const token = Cookies.get("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    };

    const request = isEdit
      ? axios.put(`https://api.kyuib.my.id/api/v1/projects/${id}`, formToSend, config)
      : axios.post(`https://api.kyuib.my.id/api/v1/projects`, formToSend, config);

    request
      .then(() => {
        fetchProjects();
        navigate("/project");
      })
      .catch((err) => {
        console.error("Submit error:", err.response?.data || err.message);
        alert("Failed to submit project, please check your input.");
      });
  };

  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      {console.log(formData)}
      <div className="w-full max-w-5xl bg-white p-10 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">{isEdit ? "Edit Project" : "Add New Project"}</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">Project Title</span>
            <input type="text" placeholder="Input Project Title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">Hero Image</span>
            <input type="file" accept="image/*" onChange={(e) => handleChange("hero_image_url", e.target.files[0])} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">Description</span>
            <input type="text" placeholder="Input Description" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">URL</span>
            <input type="text" placeholder="Input URL" value={formData.redirect_url} onChange={(e) => handleChange("redirect_url", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">Start Date</span>
            <input type="date" placeholder="Start Date" value={formData.start_date} onChange={(e) => handleChange("start_date", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">Finish Date</span>
            <input type="date" placeholder="Finish Date" value={formData.finish_date} onChange={(e) => handleChange("finish_date", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">Category</span>
            <select value={formData.category_id} onChange={(e) => handleChange("category_id",e.target.value)} className="md:col-span-2 border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">-- Pilih Kategori --</option>
              {dataCategory.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.attributes.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between md:col-span-2 mt-4">
            <button type="button" onClick={() => navigate("/project")} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-xl transition">Back</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition">{isEdit ? "Update Project" : "Create Project"}</button>
          </div>
        </form>
      </div>
    </section>

  );
};

export default Form;
