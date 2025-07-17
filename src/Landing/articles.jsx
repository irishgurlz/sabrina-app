import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import "../App.css";
import { API_BASE_URL } from "../init";
import ArticleCard from "./component/articleCard";

const Articles = () => {
    const navigate = useNavigate();
    const [dataArticle, setDataArticle] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [articleLoading, setArticleLoading] = useState(true);
    const [page, setPage] = useState([]);
    // const [loading, setLoading] = useState(true);



    const fetchArticleData = async () => {
        axios
            .get(`${API_BASE_URL}/articles`)
            .then((res) => {
                setDataArticle(res.data.data);
                setPage(res.data);
                console.log(res.data.data);
            })
            .catch((error) => {
                console.error("Fetch Error: ", error);
            }).finally(() => {
                setArticleLoading(false);
            });
    };

    useEffect(() => {
        fetchArticleData();
    }, []);

    const filteredArticle = dataArticle.filter((article) =>
        article.attributes.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePagination = (url) => {
        if (!url) return;

        setArticleLoading(true);
        axios
            .get(url)
            .then((res) => {
                setDataArticle(res.data.data);
                setPage(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setArticleLoading(false);
            });
    };
    return (
        <section className="bg-white">
            <div className="mt-24 px-4 md:px-8 lg:px-16 mx-auto animate-fadeSlideUp ">
                {/* Header */}
                <div className="w-full text-center ">
                    <h1 className="text-xl md:text-4xl font-bold text-black mb-6">
                        My Article
                    </h1>
                </div>

                {/* Search Box */}
                <div className="w-full py-6">
                    <div className="relative">
                        <input className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-3xl pl-3 pr-28 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-lg focus:shadow"
                            placeholder="Search Here..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") setFetchStatus(true); }} />
                        <button className="absolute mt-1 top-1 right-1 flex items-center rounded-3xl bg-slate-800 py-2 px-8 border border-transparent text-sm text-white shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 mr-1"
                            type="button" >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" >
                                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                            </svg>
                            Search
                        </button>
                    </div>
                </div>

               

                <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 pt-6 pb-12 w-full ">
                   
                    {articleLoading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <ArticleCard skeleton={true} key={index} />
                        ))
                        : Array.isArray(dataArticle) &&
                        filteredArticle.map((article) => (
                            <ArticleCard article={article} skeleton={false} key={article.id} />
                        ))}
                </div>

                {console.log("Page: ", page)}
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
    )
}

export default Articles;
