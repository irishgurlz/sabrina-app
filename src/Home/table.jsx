import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { GlobalContext } from "../contexts/GlobalContext";

const Table = () => {
  const { inputValues = {},  formatRupiah, handleChange, handleSearch, HandleSalary, HandleSelect, fetchJobs, filteredData = [] } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 
  const [fetchStatus, setFetchStatus] = useState(true);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); 
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      navigate('/login');
    } else {
      if (fetchStatus) {
        axios.get("https://final-project-api-alpha.vercel.app/api/jobs", {
          headers: { Authorization: "Bearer " + token }
        })
          .then((res) => {
            setData(res.data);
            setFetchStatus(false);
          })
          .catch((error) => {
            console.error("Fetch error:", error);
          });
      }
    }
  }, [navigate, fetchStatus]);
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const sortedJobs = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
  
    if (typeof aVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });
  
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleDelete = (id) => {
    const token = Cookies.get('token');
    axios.delete(`https://final-project-api-alpha.vercel.app/api/jobs/${id}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(() => {
        setFetchStatus(true);
        handleSearch();
        fetchJobs(); 
        setData((prevData) => prevData.filter((job) => job._id !== id));
      })
      .catch((err) => {
        console.error("Delete error:", err?.response?.data || err.message);
      });
  };

  const handleAddPage = () => {
    navigate('/dashboard/list-job-vacancy/create');
  };

  const handleEditPage = (job) => {
    navigate(`/dashboard/list-job-vacancy/edit/${job._id}`);
  };


  return (
<section className="bg-blue-100 min-h-screen py-10 px-4 lg:px-32 pt-32">
  <div className="w-full space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="relative flex items-center w-full md:w-1/3 ">
        <input className="w-full bg-white text-sm border border-slate-200 rounded-xl pl-3 pr-28 py-2 shadow-sm focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-700" placeholder="Search Here..." value={inputValues.title || ''} onChange={(e) => handleChange("title", e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
        <button className="absolute top-1 right-1 flex items-center rounded-xl bg-slate-800 py-1 px-2.5 text-sm text-white hover:bg-slate-700" onClick={handleSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" /></svg>
          Search
        </button>
      </div>
      <button onClick={handleAddPage} className="w-full lg:w-1/3 md:w-auto mt-5 lg:mt-0 bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-400">Add Job</button>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <select className="w-full border border-slate-200 rounded-xl px-3 py-2 shadow-sm" onChange={(e) => handleChange("company_city", e.target.value)}>
        <option value="">Pilih Kota</option>
        {data.length > 0 && HandleSelect(data, "company_city").map((job) => (
          <option key={job.company_city} value={job.company_city}>{job.company_city}</option>
        ))}
      </select>
      <select className="w-full border border-slate-200 rounded-xl px-3 py-2 shadow-sm" onChange={(e) => handleChange("company_name", e.target.value)}>
        <option value="">Pilih Perusahaan</option>
        {data.length > 0 && HandleSelect(data, "company_name").map((job) => (
          <option key={job.company_name} value={job.company_name}>{job.company_name}</option>
        ))}
      </select>
      <div className="flex items-center w-full">
          <span className="px-4 py-2.5 rounded-l-2xl border border-slate-200 bg-gray-100 text-gray-700 text-sm shadow-lg">
              Rp
          </span>
          <input type="text" min="0" className="w-full border border-slate-200 border-l-0 rounded-r-2xl px-3 py-2 focus:shadow-lg shadow-lg" placeholder="Gaji minimal" value={formatRupiah(inputValues.salary_min || "")} onChange={(e) => { const rawValue = e.target.value.replace(/\D/g, ""); handleChange("salary_min", rawValue); }} />
      </div>
    </div>

    <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3">Logo</th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('company_name')}>
                Company {sortField === 'company_name' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('title')}>
                Position {sortField === 'title' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('company_city')}>
                City {sortField === 'company_city' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('job_type')}>
                Type {sortField === 'job_type' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('job_tenure')}>
                Tenure {sortField === 'job_tenure' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('salary_min')}>
                Salary {sortField === 'salary_min' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>

            </tr>
          </thead>
          <tbody>
            {currentJobs.map((job) => (
              <tr key={job._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3"><img src={job.company_image_url} alt="Logo" className="w-12 h-12 rounded-md object-cover" /></td>
                <td className="px-4 py-3 font-semibold">{job.company_name}</td>
                <td className="px-4 py-3">{job.title}</td>
                <td className="px-4 py-3">{job.company_city}</td>
                <td className="px-4 py-3">{job.job_type}</td>
                <td className="px-4 py-3">{job.job_tenure}</td>
                <td className="px-4 py-3">Rp{HandleSalary(job.salary_min)} - Rp{HandleSalary(job.salary_max)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${job.job_status === 1 ? 'bg-green-200 text-green-800 px-4' : 'bg-red-500 text-white'}`}>{job.job_status === 1 ? 'Open' : 'Closed'}</span>
                </td>
                <td className="px-4 py-3 flex justify-center space-x-2 pt-5">
                  <button onClick={() => handleEditPage(job)} className="bg-yellow-400 text-white p-1 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                  </button>
                  <button onClick={() => handleDelete(job._id)} className="bg-red-700 text-white p-1 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && <tr><td colSpan="9" className="text-center py-6 text-gray-500">No jobs available.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
        <div className="text-sm flex items-center gap-2">
          <span>Show</span>
          <select onChange={handleItemsPerPageChange} value={itemsPerPage} className="border border-slate-200 rounded-xl px-3 py-1">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>items per page</span>
        </div>
        <div className="flex space-x-1">
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)} className={`px-3 py-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{index + 1}</button>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default Table;
