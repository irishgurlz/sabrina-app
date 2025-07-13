
const InputProject = ({ formData, handleChange, dataCategory }) => {

    return (
        <section>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Project Title</label>
                <input type="text" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Category</label>
                    <select value={formData.category_id} onChange={(e) => handleChange("category_id", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">{dataCategory.find((c) => c.id == formData.category_id)?.attributes.name || "-- Pilih Ketgori --"}</option>

                        {dataCategory.map((category) => (
                            <option key={category.id} value={category.id}>{category.attributes.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">URL</label>
                    <input type="text" value={formData.redirect_url} onChange={(e) => handleChange("redirect_url", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required />

                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Start Date</label>
                    <input type="date" value={formData.start_date} onChange={(e) => handleChange("start_date", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    {formData.start_date && <p className="text-sm text-gray-500 mt-1 ml-2">{new Date(formData.start_date).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">Finish Date</label>
                    <input type="date" value={formData.finish_date} onChange={(e) => handleChange("finish_date", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    {formData.finish_date && <p className="text-sm text-gray-500 mt-1 ml-2">{new Date(formData.finish_date).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-2 mt-4">Description</label>
                <textarea type="text" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" required></textarea>
            </div>
        </section>
    );
};

export default InputProject;
