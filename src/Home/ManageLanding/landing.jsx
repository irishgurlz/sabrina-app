import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { GlobalContext } from "../../contexts/GlobalContext";

const Table = () => {
    const {
        inputValues = {},
        handleSearch,
        fetchCategories,
        filteredData = [],
    } = useContext(GlobalContext);

    const [data, setData] = useState([]);
    const [dataProject, setDataProject] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [fetchStatus, setFetchStatus] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

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

    const filteredProjects = dataProject.filter((project) =>
        project.attributes.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddFeaturedProject = async (e) => {
        e.preventDefault(); // penting untuk mencegah reload form

        if (!selectedProject) {
            console.warn("No project selected");
            return;
        }

        const currentFeatured = [...data]; 
        const nextPosition = currentFeatured.length + 1;

        // console.log("selectedProject.id", selectedProject.id)
        try {
            await axios.post(
                `https://api.kyuib.my.id/api/v1/landing-pages/1/featured-projects`,
                {
                    id: selectedProject.id,
                    position: nextPosition
                },
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
            console.error("Failed to add featured project:", err.response?.data || err);
        }
    };



    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = data.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
        <section className="bg-white min-h-screen px-4 lg:px-20 pt-20">
            <form onSubmit={handleAddFeaturedProject} className="mb-4">
                <div className="relative flex items-center w-full">
                    <input Name="w-full bg-white text-sm border border-slate-200 rounded-xl pl-3 pr-28 py-2 shadow-sm focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-700" placeholder="Search Here..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsSearch(true);
                        }}
                    />
                    <button type="submit" className="absolute top-1 right-1 flex items-center justify-center rounded-xl bg-black py-1 px-2.5 text-sm text-white hover:bg-blue-700">
                        Add Project
                    </button>
                </div>

                {isSearch && (
                    <div className="mt-2 bg-white shadow-lg rounded-xl p-4">
                        {filteredProjects.map((project) => (
                            <div key={project.id} onClick={() => setSelectedProject(project)} className="cursor-pointer hover:bg-slate-100 px-3 py-2 rounded-lg">
                                {project.attributes.title}
                            </div>
                        ))}
                    </div>
                )}
            </form>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-center">Title</th>
                            <th className="px-4 py-3 text-center">Category</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item) => (
                            <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                                <td className="px-4 py-3 text-center">{item.attributes.title}</td>
                                <td className="px-4 py-3 text-center">{item.relationships.category.name}</td>
                                <td className="px-4 py-3 flex justify-center space-x-2">
                                    <button
                                        onClick={() => {
                                            axios.delete(`https://api.kyuib.my.id/api/v1/categories/${item.id}`, {
                                                headers: { Authorization: `Bearer ${token}` },
                                            })
                                                .then(() => setFetchStatus(true))
                                                .catch((err) => console.error(err));
                                        }}
                                        className="bg-red-700 text-white p-1 rounded-lg"
                                    >
                                        Delete
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
                            <button
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Table;