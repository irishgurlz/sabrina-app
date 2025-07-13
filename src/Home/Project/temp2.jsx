import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import InputProject from "../../Home/Project/component/inputProject";
import ArticleForm from "../../Home/Project/component/articleForm";
import { GlobalContext } from "../../contexts/GlobalContext";

const Form = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchProjects, fetchArticles, data, setData } = useContext(GlobalContext);
  const [dataCategory, setDataCategory] = useState([]);
  const [selectedHeroImage, setSelectedHeroImage] = useState(null);
  const [articleImage, setArticleImage] = useState({});
  const [articleProject, setArticleProject] = useState([]);
  const [projectImage, setProjectImage] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [singleImage, setSingleImage] = useState(null);
  const [idProject, setIdProject] = useState([]);
  const token = Cookies.get("token");
  const isEditProject = Boolean(id);

  const [newArticle, setNewArticle] = useState([]);
  const [newImage, setNewImage] = useState([]);
  const [newImageModal, setNewImageModal] = useState(false);
  const [heroImage, setHeroImage] = useState(null);
  const [selectedNewImage, setSelectedNewImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [saveIndex, setSaveIndex] = useState(null);

  const [imageNameList, setImageNameList] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [indexIter, setIndexIter] = useState(0);
  const [indexProjectImage, setIndexProjectImage] = useState(null);
  const [isProjectImage, setIsProjectImage] = useState(false);



  const [formData, setFormData] = useState({
    id: '',
    title: '',
    hero_image_url: '',
    description: '',
    redirect_url: '',
    start_date: '',
    finish_date: '',
    category_id: '',
  });

  const [formDataImage, setFormDataImage] = useState({
    // id: '',
    // name: '',
    url: '',
  })
  const handleHeroImage = (imageId) => {
    setHeroImage(imageId);
    setSingleImage(null);
    setNewImageModal(false);
  }

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (isEditProject) {
      axios
        .get(`https://api.kyuib.my.id/api/v1/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const project = res.data.data;
          setFormData({
            id: project.id,
            title: project.attributes.title,
            hero_image_url: project.attributes.hero_image_url,
            description: project.attributes.description,
            redirect_url: project.attributes.redirect_url,
            start_date: project.attributes.start_date,
            finish_date: project.attributes.finish_date,
            category_id: project.attributes.category_id,
          });
          setIdProject(project.id);
        })
        .catch((err) => console.error("Error fetching project:", err));
    }
  }, [id, isEditProject, navigate, token]);

  useEffect(() => {
    axios.get("https://api.kyuib.my.id/api/v1/categories")
      .then((res) => setDataCategory(res.data.data))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchArticlesWithBody = async () => {
      try {
        const res = await axios.get(`https://api.kyuib.my.id/api/v1/projects/${id}/articles`);
        const articles = res.data.data;

        const articlesWithBody = await Promise.all(
          articles.map(async (article) => {
            const detailRes = await axios.get(`https://api.kyuib.my.id/api/v1/articles/${article.id}`);
            return {
              ...article,
              body: detailRes.data.data.attributes.body,
            };
          })
        );

        setArticleProject(articlesWithBody);
      } catch (error) {
        console.error("Fetch Error: ", error);
      }
    };

    fetchArticlesWithBody();
  }, [id]);

  useEffect(() => {
    const fetchProjectImage = async () => {
      try {
        const res = await axios.get(`https://api.kyuib.my.id/api/v1/projects/${id}/images`);
        setProjectImage(res.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectImage();
  }, [id]);

  const handleProjectImage = (imageId) => {
    setSelectedImageId(imageId);
  }

  useEffect(() => {

    const fetchSingleImage = async () => {
      try {
        const res = await axios.get(`https://api.kyuib.my.id/api/v1/projects/${id}/images/${selectedImageId}`);
        setSingleImage(res.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    setNewImageModal(false);
    fetchSingleImage();
    setHeroImage(null);
  }, [selectedImageId, id]);


  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArticleChange = (articleId, field, value) => {
    setArticleProject((prev) =>
      prev.map((article) => {
        if (article.id !== articleId) return article;

        if (field === "body") {
          return {
            ...article,
            body: value,
          };
        } else {
          return {
            ...article,
            attributes: {
              ...article.attributes,
              [field]: value,
            },
          };
        }
      })
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formToSend = new FormData();
    formToSend.append("title", formData.title);
    formToSend.append("description", formData.description);
    formToSend.append("redirect_url", formData.redirect_url);
    formToSend.append("start_date", formData.start_date);
    formToSend.append("finish_date", formData.finish_date);
    formToSend.append("category_id", formData.category_id);

    if (selectedHeroImage) {
      formToSend.append("hero_image", selectedHeroImage);
    }


    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      let projectIdToUse = id;
      if (isEditProject) {
        await axios.post(`https://api.kyuib.my.id/api/v1/projects/${id}?_method=PUT`, formToSend, config);
        await Promise.all(
          articleProject.map((article) => {
            const updatedArticle = new FormData();


            updatedArticle.append("title", article.attributes.title);
            updatedArticle.append("body", article.body);

            if (articleImage[article.id]) {
              updatedArticle.append("hero_image", articleImage[article.id]);
            }
            return axios.post(`https://api.kyuib.my.id/api/v1/articles/${article.id}?_method=PUT`, updatedArticle, config);
          })
        );
      } else {
        const res = await axios.post("https://api.kyuib.my.id/api/v1/projects", formToSend, config);
        projectIdToUse = res.data.data.id
      }


      if (newArticle.length > 0) {
        await Promise.all(
          newArticle.map((article, index) => {
            const newForm = new FormData();
            newForm.append("title", article.title);
            newForm.append("body", article.body);
            if (!isEditProject) {
              newForm.append("project_id", projectIdToUse);
            }

            if (isEditProject) {
              newForm.append("project_id", idProject);
            }

            if (articleImage[index]) {
              newForm.append("hero_image", articleImage[index]);
            }

            return axios.post("https://api.kyuib.my.id/api/v1/articles", newForm, config);
          })
        );
      }

      if (imageFileList.length === imageNameList.length && imageFileList.length > 0 && imageNameList.length > 0) {
        await Promise.all(
          imageFileList.map((image, index) => {
            const newImageForm = new FormData();
            newImageForm.append("image", image);
            newImageForm.append("name", imageNameList[index]);
            newImageForm.append("alternative_text", image.name);

            const projectId = isEditProject ? idProject : projectIdToUse;
            newImageForm.append("project_id", projectId);

            console.log("FormData isi:");
            for (let pair of newImageForm.entries()) {
              console.log(`${pair[0]}:`, pair[1]);
            }

            return axios.post(
              `https://api.kyuib.my.id/api/v1/projects/${projectId}/images`, newImageForm, config);
          })
        );
      }


      for (let [key, value] of formToSend.entries()) {
        console.log(`${key}:`, value);
      }

      fetchProjects();
      navigate("/dashboard/projects");
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert("Failed to submit, please check your input.");
    }
  };

  const handleDeleteArticle = (id) => {
    const token = Cookies.get('token');
    axios.delete(`https://api.kyuib.my.id/api/v1/articles/${id}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(() => {
        // setFetchStatus(true);
        // handleSearch();
        fetchArticles();
        setArticleProject((prevData) => prevData.filter((article) => article.id !== id));
      })
      .catch((err) => {
        console.error("Delete error:", err?.response?.data || err.message);
      });
  };

  const handleNewArticle = () => {
    setNewArticle((prev) => [
      ...prev,
      { title: '', body: '', hero_image: null }
    ]);
  };

  const handleNewArticleChange = (index, field, value) => {
    setNewArticle((prev) =>
      prev.map((article, i) => {
        if (i !== index) return article;
        return {
          ...article,
          [field]: value,
        };
      })
    );
  };


  const handleRemoveArticle = (indexToRemove) => {
    setNewArticle((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const tryAppendImage = (newData) => {
    if (newData.url) {
      if (!isProjectImage) {
        setImageFileList((prev) => [...prev, newData.url]);
      }

    }

    setFormDataImage({ url: null });
  };



  const tryAppendImageName = (newData) => {
    const merged = { ...formDataImage, ...newData };

    setFormDataImage(merged);

    if (merged.name) {
      setImageNameList((prev) => [...prev, merged.name]);
      setFormDataImage({ name: '' });
    }
  };

  const handleNewImage = () => {
    setFormDataImage({ url: '' });
    setNewImageModal(true);
    setSingleImage(null);
    setHeroImage(null);

    const currentIndex = indexIter;

    setImageFileList((prev) => {
      const updated = [...prev];
      updated[currentIndex] = null;
      return updated;
    });

    setNewImage((prev) => [...prev, { url: null }]);

    setIndexIter((prev) => prev + 1);
  };


  const handleImageInputChange = (field, value) => {
    if (field === 'url') {
      if (!isProjectImage) {
        setImageFileList((prev) => {
          const updated = [...prev];

          if (updated[indexIter - 1] == null) {
            updated[indexIter - 1] = value;
          }

          return updated;
        });
      }
    }
    setFormDataImage((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectImageEdit = (value) => {
    projectImage[indexProjectImage].attributes.url = value;
  }

  const handleImageNameEdit = (field, value) => {
    const index = saveIndex ?? 0;
    const isEditing = index != null;
    if (isEditing && field === 'url') {
      setImageFileList((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
    } else if (isEditing && field === 'name') {
      setFormDataImage((prev) => ({ ...prev, name: value }));

      setImageNameList((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
    }
  };


  const saveImageToList = () => {
    const { url } = formDataImage;

    if (url) {
      setImageNameList((prev) => {
        const updated = [...prev];
        updated[indexIter - 1] = url;
        return updated;
      });
      setFormDataImage((prev) => ({ ...prev, url: null }));
    }
  };



  const saveImageNameToList = () => {
    const { name } = formDataImage;
    if (name) {
      setImageNameList((prev) => {
        const updated = [...prev];

        if (updated[indexIter - 1] == null) {
          updated[indexIter - 1] = name;
        }

        return updated;
      });
      setFormDataImage((prev) => ({ ...prev, name: '' }));
    }
  };


  const updateImageListField = (index, field, value) => {
    setImageList(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (saveIndex != null && newImage[saveIndex]?.url instanceof File) {
      const objectUrl = URL.createObjectURL(newImage[saveIndex].url);
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (saveIndex != null && newImage[saveIndex]?.url) {
      setPreviewUrl(newImage[saveIndex].url);
    } else {
      setPreviewUrl(null);
    }
  }, [saveIndex, newImage]);






  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-8xl bg-white px-10 pb-10 rounded-3xl shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          {isEditProject ? "Edit Project" : "Add New Project"}
        </h1>
        {/* ========================================================================== PROJECT IMAGE ========================================================================== */}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded-xl px-8 py-4">
              <div className="pb-2 ">
                <label className="relative cursor-pointer block w-full group">
                  {selectedHeroImage || selectedNewImage ? (
                    <img src={URL.createObjectURL(selectedHeroImage)} alt="Preview Hero" className="w-full max-h-80 object-cover rounded-xl mb-2" />
                  ) : singleImage ? (
                    <img src={singleImage?.attributes?.url || singleImage?.url} alt="Single Image" className="w-full max-h-80 object-cover rounded-xl mb-2" />
                  ) : imageFileList[saveIndex] ? (
                    <div>
                      <img src={imageFileList[saveIndex] instanceof File ? URL.createObjectURL(imageFileList[saveIndex]) : imageFileList[saveIndex]}
                        alt={imageNameList[saveIndex] || "Image Preview"}
                        className="w-full max-h-80 object-cover rounded-xl mb-2" />
                    </div>
                  ) : imageFileList[indexIter - 1] ? (
                    <div>
                      <img src={imageFileList[indexIter - 1] instanceof File ? URL.createObjectURL(imageFileList[indexIter - 1]) : imageFileList[indexIter - 1]}
                        alt={imageNameList[indexIter - 1] || "Image Preview"}
                        className="w-full max-h-80 object-cover rounded-xl mb-2" />
                    </div>
                  )
                    : newImageModal ? (
                      <div>
                        <label htmlFor="heroImage" className="w-full h-52 bg-gray-100 flex items-center justify-center rounded-xl mb-2 text-gray-500 text-sm p-2 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                          <span className="ml-2">Add New Image</span>
                        </label>
                        <input type="file" accept="image/*" id="heroImage" className="hidden" onChange={e => e.target.files[0] && (handleImageInputChange('url', e.target.files[0]))} />
                      </div>
                    ) : formData.hero_image_url ? (
                      <img src={formData.hero_image_url} alt="Current Hero" className="w-full max-h-80 object-cover rounded-xl mb-2" />
                    )
                      : (
                        <div className="w-full h-52 bg-gray-100 flex items-center justify-center rounded-xl mb-2 text-gray-500 text-sm p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        </div>
                      )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Update Image
                  </div>

                  {imageFileList[indexIter - 1] && !saveIndex ? (
                    <div>
                      <input type="file" accept="image/*" onChange={(e) => handleImageNameEdit('url', e.target.files[0])} className="hidden" />
                    </div>
                  ) : imageFileList[indexIter - 1] || imageFileList[saveIndex] ? (
                    <div>
                      <input type="file" accept="image/*" onChange={(e) => handleImageNameEdit('url', e.target.files[0])} className="hidden" />
                    </div>
                  ) : newImageModal ? (
                    <div>
                      <input type="file" accept="image/*" id="heroImage" className="hidden" onChange={e => e.target.files[0] && (handleImageInputChange('url', e.target.files[0]), tryAppendImage({ url: e.target.files[0] }))} />
                    </div>
                  ) : isProjectImage ? (
                    <div>
                      <input type="file" accept="image/*" id="heroImage" className="hidden" onChange={(e) => handleProjectImageEdit(e.target.files[0])} />
                    </div>
                  )
                    : (
                      <input type="file" accept="image/*" onChange={(e) => setSelectedHeroImage(e.target.files[0])} className="hidden" />
                    )}

                  {/* ===========================================================================================   INIIIIIIIIIIIIIIIIIII */}
                </label>
                {saveIndex != null ? (
                  <div className="my-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Image Name</label>
                    <input value={imageNameList[saveIndex] || ""} onChange={e => handleImageNameEdit('name', e.target.value)} placeholder="Input" type="text" className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                  </div>
                ) : newImageModal ? (
                  <div className="my-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Image Name</label>
                    <input value={formDataImage.name} onChange={e => handleImageInputChange('name', e.target.value)} onBlur={saveImageNameToList} placeholder='Input' type="text" className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                ) : isProjectImage ? (
                  <div className="my-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Image Name</label>
                    <input value={projectImage[indexProjectImage].attributes.name} onChange={e => handleImageInputChange('name', e.target.value)} onBlur={saveImageNameToList} placeholder='Input' type="text" className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                ) : null}
              </div>

              <div className="rounded-xl mb-2">
                <div className="w-full flex justify-between gap-2">

                  <div className="max-w-full overflow-x-auto scrollbar-hide">

                    <div className="flex gap-2 whitespace-nowrap min-w-max">

                      {/* ========================================================================== GALLERY ========================================================================== */}
                      {selectedHeroImage ? (
                        <img src={URL.createObjectURL(selectedHeroImage)} alt="Preview Hero" className="w-16 h-16 object-cover rounded-xl mr-2" />
                      ) : formData.hero_image_url ? (
                        <button type="button" className="h-fit rounded-2xl flex justify-center items-center mb-2 hover:border-2 active:border-2 border-transparent hover:border-purple-300 active:border-blue-300"
                          onClick={() => handleHeroImage(formData.id)}>
                          <img src={formData.hero_image_url} alt="Current Hero" className="w-16 h-16 object-cover rounded-xl" />
                        </button>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-xl mb-2 text-gray-500 text-sm p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        </div>
                      )}


                      {projectImage.map((image, index) => (
                        <div key={image.id} className="flex items-center mb-2">
                          <button type="button" key={image.id} onClick={() => handleProjectImage(String(image.id), setIndexProjectImage(index), setIsProjectImage(true))} className="h-fit w-fit rounded-2xl justify-center items-center  flex-shrink-0 relative inline-block hover:border-2 active:border-2 border-transparent hover:border-purple-300 active:border-blue-300 ">
                            <img src={image.attributes.url} alt={image.attributes.name} className="w-16 h-16 object-cover rounded-xl " />
                          </button>
                        </div>
                      ))}

                      {/* {console.log("projectImage", projectImage)} */}
                      {imageFileList.map((img, index) => (
                        <button onClick={() => setSaveIndex((index), setIsProjectImage(false))} type="button" key={index} className="mb-2">
                          {img instanceof File ? (
                            <img src={URL.createObjectURL(img)} alt={imageNameList[index]} className="w-16 h-16 object-cover rounded-xl" />
                          ) : (<div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-xl mb-2 text-gray-500 text-sm p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                          </div>
                          )}
                        </button>
                      ))}



                      {/* {console.log("indexIter: ", indexIter)}
                      {console.log("saveIndex: ", saveIndex)}
                      {console.log("imageNameList: ", imageNameList)}
                      {console.log("imageFileList: ", imageFileList)} */}

                    </div>
                  </div>

                  <div className="">
                    <button type="button" onClick={() => { handleNewImage(); setSaveIndex(null); setIndexProjectImage(null) }} className="bg-gray-200 hover:bg-gray-300 w-16 h-16 flex justify-center items-center p-4 rounded-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>


              {/* ========================================================================== FORM PROJECT ========================================================================== */}
              <InputProject formData={formData} handleChange={handleChange} dataCategory={dataCategory} />
            </div>

            {/* ========================================================================== ARTICLE ========================================================================== */}
            <div className="border border-gray-300 rounded-xl px-8 py-4 overflow-y-auto max-h-[90vh]">
              <ArticleForm formData={formData} dataCategory={dataCategory} articleProject={articleProject} newArticle={newArticle} articleImage={articleImage} setArticleImage={setArticleImage}
                handleNewArticle={handleNewArticle} handleArticleChange={handleArticleChange} handleNewArticleChange={handleNewArticleChange} handleRemoveArticle={handleRemoveArticle} handleDeleteArticle={handleDeleteArticle} />
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button type="button" onClick={() => navigate("/dashboard/projects")} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-xl transition">Back</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition">{isEditProject ? "Update Project" : "Create Project"}</button>
          </div>
        </form>

      </div>
    </section>
  );
};

export default Form;