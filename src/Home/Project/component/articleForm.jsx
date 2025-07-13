
const ArticleForm = ({ formData, dataCategory, articleProject, newArticle, articleImage, setArticleImage, handleNewArticle, handleArticleChange, handleNewArticleChange, handleRemoveArticle, handleDeleteArticle }) => {
    return (
        <section>
            <div>
                <h2 className="text-xl font-bold mb-4">Articles in this Project</h2>
                <button type="button" onClick={() => handleNewArticle()} className="w-full bg-gray-200 rounded-lg flex justify-center items-center text-gray-500 p-2 hover:bg-gray-300 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                </button>
                {articleProject.map((article) => (
                    <div key={article.id} className="border border-gray-300 rounded-xl px-4 py-2 mb-4 grid grid-cols-5">
                        <label className="relative cursor-pointer block w-full group ">
                            {articleImage[article.id] ? (
                                <img src={URL.createObjectURL(articleImage[article.id])} alt="Preview Hero" className="w-full max-h-80 object-cover rounded-xl mb-2" />
                            ) : article.attributes.hero_image_url ? (
                                <img src={article.attributes.hero_image_url} alt="Current Hero" className="w-full max-h-80 object-cover rounded-xl mb-2" />
                            ) : (
                                <div className="w-full h-52 bg-gray-100 flex items-center justify-center rounded-xl mb-2 text-gray-500 text-sm p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-full">
                                Update Image
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => setArticleImage(prev => ({ ...prev, [article.id]: e.target.files[0] }))} className="hidden" />
                        </label>
                        <div className="col-span-4 ml-4">
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Title</label>
                                <input type="text" value={article.attributes.title} onChange={(e) => handleArticleChange(article.id, "title", e.target.value)}
                                    className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Body</label>
                                <textarea value={article.body} onChange={(e) => handleArticleChange(article.id, "body", e.target.value)}
                                    onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                                    className="border border-gray-300 rounded-xl px-4 py-2 w-full overflow-hidden resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            </div>
                            {/* <button type="button" onClick={() => handleRemoveArticle(index)}>Hapus</button> */}
                            <button type="button" onClick={() => handleDeleteArticle(article.id)} className="bg-red-400 hover:bg-red-500 shadow-xl rounded-md  w-full flex items-center justify-center p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
                {newArticle.map((article, index) => (

                    <div key={index}>
                        <div className="border border-gray-300 rounded-xl px-4 py-2 mb-4 grid grid-cols-5">
                            <label className="relative cursor-pointer block w-full group ">
                                {articleImage[index] ? (
                                    <img src={URL.createObjectURL(articleImage[index])} alt="Preview Hero" className="w-full max-h-80 object-cover rounded-xl mb-2" />
                                ) : (
                                    <div className="w-full h-52 bg-gray-100 flex items-center justify-center rounded-xl mb-2 text-gray-500 text-sm p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-full">
                                    Update Image
                                </div>
                                <input type="file" accept="image/*" onChange={(e) => setArticleImage(prev => ({ ...prev, [index]: e.target.files[0] }))} className="hidden" />
                            </label>
                            <div className="col-span-4 ml-4">
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Title</label>
                                    <input type="text" onChange={(e) => handleNewArticleChange(index, "title", e.target.value)}
                                        className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Body</label>
                                    <textarea onChange={(e) => handleNewArticleChange(index, "body", e.target.value)}
                                        onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                                        className="border border-gray-300 rounded-xl px-4 py-2 w-full overflow-hidden resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                                <button type="button" className="w-full bg-red-400 shadow-sm rounded-md p-1 mt-2 flex justify-center" onClick={() => handleRemoveArticle(index)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ArticleForm;
