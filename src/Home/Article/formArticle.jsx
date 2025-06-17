import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { GlobalContext } from "../../contexts/GlobalContext";

const Form = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchArticles } = useContext(GlobalContext);
  const [dataProject, setDataProject] = useState([]);
  const [name, setName] = useState('');
  const [selectedHeroImage, setSelectedHeroImage] = useState(null);


  const [formData, setFormData] = useState({
    title: '',
    hero_image_url: '',
    body: '',
    article_id: '',      
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
          .get(`https://api.kyuib.my.id/api/v1/articles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            const article = res.data.data;
            setFormData({
                title: article.attributes.title,
                hero_image_url: article.attributes.hero_image_url,
                body: article.attributes.body,
                project_id: article.attributes.project_id,      
            });
          })
          .catch((err) => console.error("Error fetching job:", err));
      }
    }
    }, [id, isEdit]);

  useEffect(() => {
    axios.get("https://api.kyuib.my.id/api/v1/projects")
          .then((res) => {
            setDataProject(res.data.data);
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
    formToSend.append("body", formData.body);
    formToSend.append("project_id", formData.Project_id);
    
    console.log("Selected image:", selectedHeroImage);
    if (selectedHeroImage) {
      formToSend.append("hero_image", selectedHeroImage);
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const request = isEdit
      ? axios.post(`https://api.kyuib.my.id/api/v1/articles/${id}?_method=PUT`, formToSend, config)
      : axios.post(`https://api.kyuib.my.id/api/v1/articles`, formToSend, config);

    request
      .then(() => {
        fetchArticles();
        navigate("/dashboard/articles");
      })
      .catch((err) => {
        console.error("Submit error:", err.response?.data || err.message);
        alert("Failed to submit article, please check your input.");
      });
  };



  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      {console.log(formData)}
      <div className="w-full max-w-5xl bg-white p-10 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">{isEdit ? "Edit article" : "Add New article"}</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">article Title</span>
            <input type="text" placeholder="Input article Title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">Hero Image</span>
            <input type="file" accept="image/*"  onChange={(e) => setSelectedHeroImage(e.target.files[0])} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">Body</span>
            <input type="text" placeholder="Input Description" value={formData.body} onChange={(e) => handleChange("body", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          </div>

          <div>
            {console.log(dataProject)}
            <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">Project</span>
            <select value={formData.Project_id} onChange={(e) => handleChange("Project_id",e.target.value)} className="md:col-span-2 border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">-- Pilih Project --</option>
              {dataProject.map((Project) => (
                <option key={Project.id} value={Project.id}>
                  {Project.attributes.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between md:col-span-2 mt-4">
            <button type="button" onClick={() => navigate("/dashboard/articles")} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-xl transition">Back</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition">{isEdit ? "Update article" : "Create article"}</button>
          </div>
        </form>
      </div>
    </section>

  );
};

export default Form;
