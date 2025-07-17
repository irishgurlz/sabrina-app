import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { GlobalContext } from "../../contexts/GlobalContext";
import Select from 'react-select';
import "../../App.css";

const Table = () => {
    const {
        inputValues = {},
        handleSearch,
        fetchCategories,
        filteredData = [],
    } = useContext(GlobalContext);

    const [data, setData] = useState([]);
    const [dataArticle, setDataArticle] = useState([]);
    const [dataArticleLanding, setDataArticleLanding] = useState([]);
    const [dataProject, setDataProject] = useState([]);
    const [dataProfile, setDataProfile] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [fetchStatus, setFetchStatus] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [currentPageArticle, setCurrentPageArticle] = useState(1);
    const [itemsPerPageArticle, setItemsPerPageArticle] = useState(5);
    const [selectedHeroImage, setSelectedHeroImage] = useState(null);
    const [selectedAboutImage, setSelectedAboutImage] = useState(null);



    const navigate = useNavigate();
    const token = Cookies.get("token");

    useEffect(() => {
        if (!token) return navigate('/login');

        if (fetchStatus) {
            axios.get("https://api.kyuib.my.id/api/v1/landing-pages/1/featured-projects", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    setData(res.data.data);
                    setFetchStatus(false);
                })
                .catch((error) => console.error("Fetch error:", error));
        }
    }, [fetchStatus]);

    useEffect(() => {
        if (!token) return navigate('/login');

        if (fetchStatus) {
            axios.get("https://api.kyuib.my.id/api/v1/projects", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    setDataProject(res.data.data);
                    setFetchStatus(false);
                })
                .catch((error) => console.error("Fetch error:", error));
        }
    }, [fetchStatus]);


    useEffect(() => {
        if (!token) return navigate('/login');

        if (fetchStatus) {
            axios.get("https://api.kyuib.my.id/api/v1/landing-pages/1/featured-articles", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    setDataArticleLanding(res.data.data);
                    setFetchStatus(false);
                })
                .catch((error) => console.error("Fetch error:", error));
        }
    }, [fetchStatus]);

    useEffect(() => {
        if (!token) return navigate('/login');

        if (fetchStatus) {
            axios.get("https://api.kyuib.my.id/api/v1/articles", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    setDataArticle(res.data.data);
                    setFetchStatus(false);
                })
                .catch((error) => console.error("Fetch error:", error));
        }
    }, [fetchStatus]);

    useEffect(() => {
        if (!token) return navigate('/login');

        if (fetchStatus) {
            axios.get("https://api.kyuib.my.id/api/v1/landing-pages/1", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    setDataProfile(res.data.data);
                    setFetchStatus(false);
                })
                .catch((error) => console.error("Fetch error:", error));
        }
    }, [fetchStatus]);

    const filteredProjects = dataProject.filter((project) =>
        project.attributes.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddFeaturedProject = async (e) => {
        e.preventDefault();

        if (!selectedProject) {
            console.warn("No project selected");
            return;
        }

        const alreadyExists = data.some(p => p.id === selectedProject.id);
        if (alreadyExists) {
            alert("Project already in featured list!");
            return;
        }

        const updatedProjects = [...data, selectedProject].map((project, index) => ({
            id: project.id,
            position: index + 1,
        }));

        try {
            await axios.post(
                "https://api.kyuib.my.id/api/v1/landing-pages/1/featured-projects",
                { projects: updatedProjects },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setFetchStatus(true);
            setSelectedProject(null);
            setSearchTerm("");
            setIsSearch(false);
        } catch (err) {
            console.error("Failed to update featured projects:", err.response?.data || err);
        }
    };

    const handleAddFeaturedArticle = async (e) => {
        e.preventDefault();

        if (!selectedArticle) {
            console.warn("No article selected");
            return;
        }

        const alreadyExists = dataArticleLanding.some(p => p.id === selectedArticle.id);
        if (alreadyExists) {
            alert("Article already in featured list!");
            return;
        }

        const updatedArticles = [...dataArticleLanding, selectedArticle].map((article, index) => ({
            id: article.id,
            position: index + 1,
        }));

        try {
            await axios.post(
                "https://api.kyuib.my.id/api/v1/landing-pages/1/featured-articles",
                { articles: updatedArticles },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setFetchStatus(true);
            setSelectedArticle(null);
        } catch (err) {
            console.error("Failed to update featured articles:", err.response?.data || err);
        }
    };


    const [formData, setFormData] = useState({
        display_name: "",
        job_title: "",
        about_me_title: "",
        about_me_body: "",
        contact_url: "",
    });

    const handleChange = (field, value) => {
        setDataProfile((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        if (dataProfile?.attributes) {
            setFormData({
                display_name: dataProfile.attributes.display_name || "",
                job_title: dataProfile.attributes.job_title || "",
                about_me_title: dataProfile.attributes.about_me_title || "",
                about_me_body: dataProfile.attributes.about_me_body || "",
                contact_url: dataProfile.attributes.contact_url || "",
            });
        }
    }, [dataProfile]);


    const handleSubmit = (e) => {
        e.preventDefault();

        const formToSend = new FormData();
        formToSend.append("display_name", formData.display_name);
        formToSend.append("job_title", formData.job_title);
        formToSend.append("about_me_body", formData.about_me_body);
        formToSend.append("about_me_title", formData.about_me_title);
        formToSend.append("contact_url", formData.contact_url);

        console.log("Selected image:", selectedHeroImage);
        if (selectedHeroImage) {
            formToSend.append("hero_image_url", selectedHeroImage);
        }

        if (selectedAboutImage) {
            formToSend.append("about_me_image_url", selectedAboutImage);
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };

        axios.post(`https://api.kyuib.my.id/api/v1/landing-pages/1?_method=PUT`, formToSend, config)
            .then(() => {
                setFetchStatus(true);
                navigate("/dashboard/landing");
            })
            .catch((err) => {
                console.error("Failed to update profile:", err.response?.data || err);
            });
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = data.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const indexOfLastArticle = currentPageArticle * itemsPerPageArticle;
    const indexOfFirstArticle = indexOfLastArticle - itemsPerPageArticle;
    const currentItemsArticle = dataArticleLanding.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPagesArticle = Math.ceil(dataArticleLanding.length / itemsPerPageArticle);
    console.log("dataProfile", dataProfile);

    return (
        <section className="bg-white min-h-screen px-4 lg:px-16 pt-20 mb-12">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Manage Landing Page
            </h1>
            <div className="bg-white shadow-md rounded-2xl p-6 mb-12">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
                    {/* <p className="text-sm text-gray-500">Update your display name, job title, and images here.</p> */}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                <input value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} type="text" className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                <input value={formData.job_title} onChange={(e) => setFormData({ ...formData, job_title: e.target.value })} type="text" className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring focus:border-blue-500"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">About Me Body</label>
                                <textarea value={formData.about_me_body} onChange={(e) => setFormData({ ...formData, about_me_body: e.target.value })}
                                    rows="3" className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring focus:border-blue-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact URL</label>
                                <input value={formData.contact_url} onChange={(e) => setFormData({ ...formData, contact_url: e.target.value })}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring focus:border-blue-500 resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">About Me Title</label>
                                <input value={formData.about_me_title} onChange={(e) => setFormData({ ...formData, about_me_title: e.target.value })}
                                    type="text" className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
                                <input accept="image/*" onChange={(e) => setSelectedHeroImage(e.target.files[0])}
                                    type="file" className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">About Me Image URL</label>
                                <input accept="image/*" onChange={(e) => setSelectedAboutImage(e.target.files[0])}
                                    type="file" className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end md:col-span-2 mt-4">
                        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition">
                            Update Profile
                        </button>
                    </div>
                </form>

            </div>




            <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Featured Projects </h2>
                    {/* <p className="text-sm text-gray-500">Update your display name, job title, and images here.</p> */}
                </div>
                {/* ================================== Featured Project ================================== */}
                <div>
                    <form onSubmit={handleAddFeaturedProject} className="mb-4">
                        <div className="relative flex items-center w-full mb-4 ">
                            <div className="w-full relative ">
                                <Select options={dataProject.map(project => ({ value: project.id, label: project.attributes.title, project }))}
                                    onChange={selectedOption => setSelectedProject(selectedOption?.project || null)}
                                    value={selectedProject ? { value: selectedProject.id, label: selectedProject.attributes.title, project: selectedProject } : null}
                                    isClearable placeholder="Select project..." className="text-sm"
                                    styles={{
                                        control: base => ({
                                            ...base,
                                            borderRadius: "0.75rem",
                                            borderColor: "#cbd5e1",
                                            paddingTop: 2,
                                            paddingBottom: 2,
                                            paddingLeft: 8,
                                            paddingRight: 8,
                                            boxShadow: "none",
                                            "&:hover": { borderColor: "#94a3b8" }
                                        }),
                                        menu: base => ({ ...base, borderRadius: "0.75rem" })
                                    }} />
                                <button type="submit" className="absolute top-0 right-0 h-full flex items-center justify-center rounded-r-xl bg-black p-4 text-sm text-white hover:bg-blue-700">
                                    Add Project
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-4 py-3 ">Title</th>
                                    <th className="px-4 py-3 ">Category</th>
                                    <th className="px-4 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 ">{item.attributes.title}</td>
                                        <td className="px-4 py-3 ">{item.relationships.category.name}</td>
                                        <td className="px-4 py-3 flex justify-center space-x-2">
                                            <button className="bg-red-700 text-white p-1 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-center p-4">
                            <div className="text-sm flex items-center gap-2">
                                <span>Show</span>
                                <select onChange={(e) => setItemsPerPage(Number(e.target.value))} value={itemsPerPage} className="border border-slate-200 rounded-xl px-3 py-1">
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                                <span>items per page</span>
                            </div>
                            <div className="flex space-x-1">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={`px-3 py-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


                {/* ================================== Featured Article ================================== */}
                <div className="mb-4 mt-12">
                    <h2 className="text-xl font-semibold text-gray-800">Featured Articles</h2>
                    {/* <p className="text-sm text-gray-500">Update your display name, job title, and images here.</p> */}
                </div>
                <div>
                    <form onSubmit={handleAddFeaturedArticle} className="mb-4 mt-4 lg:mt-0">
                        <div className="relative flex items-center w-full mb-4 ">
                            <div className="w-full relative ">
                                <Select options={dataArticle.map(project => ({ value: project.id, label: project.attributes.title, project }))}
                                    onChange={selectedOption => setSelectedArticle(selectedOption?.project || null)}
                                    value={selectedArticle ? { value: selectedArticle.id, label: selectedArticle.attributes.title, project: selectedArticle } : null}
                                    isClearable placeholder="Select article..." className="text-sm"
                                    styles={{
                                        control: base => ({
                                            ...base,
                                            borderRadius: "0.75rem",
                                            borderColor: "#cbd5e1",
                                            paddingTop: 2,
                                            paddingBottom: 2,
                                            paddingLeft: 8,
                                            paddingRight: 8,
                                            boxShadow: "none",
                                            "&:hover": { borderColor: "#94a3b8" }
                                        }),
                                        menu: base => ({ ...base, borderRadius: "0.75rem" })
                                    }} />
                                <button type="submit" className="absolute top-0 right-0 h-full flex items-center justify-center rounded-r-xl bg-black p-4 text-sm text-white hover:bg-blue-700">
                                    Add Article
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-4 py-3 ">Title</th>
                                    {/* <th className="px-4 py-3 ">Category</th> */}
                                    <th className="px-4 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItemsArticle.map((item) => (
                                    <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 ">{item.attributes.title}</td>
                                        {/* <td className="px-4 py-3 ">{item.relationships.category.name}</td> */}
                                        <td className="px-4 py-3 flex justify-center space-x-2">
                                            <button className="bg-red-700 text-white p-1 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-center p-4">
                            <div className="text-sm flex items-center gap-2">
                                <span>Show</span>
                                <select onChange={(e) => setItemsPerPageArticle(Number(e.target.value))} value={itemsPerPageArticle} className="border border-slate-200 rounded-xl px-3 py-1">
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                                <span>items per page</span>
                            </div>
                            <div className="flex space-x-1">
                                {Array.from({ length: totalPagesArticle }, (_, index) => (
                                    <button key={index + 1} onClick={() => setCurrentPageArticle(index + 1)} className={`px-3 py-1 rounded-lg ${currentPageArticle === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Table;