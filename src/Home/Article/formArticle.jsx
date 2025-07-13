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
              project_id: article.relationships.project.id,
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
    formToSend.append("project_id", formData.project_id);

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
      <div className="w-full max-w-7xl bg-white p-10 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">{isEdit ? "Edit article" : "Add New article"}</h1>
        <form onSubmit={handleSubmit} >
          <label className="relative cursor-pointer block w-full group">
            <div>
              {
                selectedHeroImage ? <img src={URL.createObjectURL(selectedHeroImage)} alt="Selected Hero" className="w-full max-h-80 object-cover rounded-xl mb-2" />
                  : formData.hero_image_url ? ( <img src={formData.hero_image_url} alt={formData.slug} className="w-full max-h-80 object-cover rounded-xl mb-2" /> )
                  : (
                    <div className="w-full h-52 bg-gray-100 flex items-center justify-center rounded-xl mb-2 text-gray-500 text-sm p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                    </div>
                  )
              }
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Update Image
            </div>
            {
              selectedHeroImage
                ? <input type="file" accept="image/*" onChange={(e) => setSelectedHeroImage(e.target.files[0])} className="hidden" />
                : <input type="file" accept="image/*" onChange={(e) => setSelectedHeroImage(e.target.files[0])} className="hidden" />
            }
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">article Title</span>
              <input type="text" placeholder="Input article Title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>


            <div>
              {console.log("formData", formData)}
              <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">Project</span>
              <select value={formData.project_id} onChange={(e) => handleChange("project_id", e.target.value)} className="md:col-span-2 border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">{dataProject.find((p) => p.id == formData.project_id)?.attributes.title || "-- Pilih Project --"}</option>
                {dataProject.map((Project) => (
                  <option key={Project.id} value={Project.id}>
                    {Project.attributes.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <span className="block text-sm font-medium text-gray-700 mb-1 ml-2">Body</span>
            <textarea type="text" placeholder="Input Description" value={formData.body} onChange={(e) => handleChange("body", e.target.value)} onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }} className="overflow-hidden border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
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
