import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Cookies from "js-cookie"
import { GlobalContext } from "../contexts/GlobalContext"; 

const Dashboard = () => {
  const { inputValues = {}, handleChange, handleSearch, HandleSalary, filteredData = [] } = useContext(GlobalContext); 
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedJob, setSelectedJob] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    const name = Cookies.get('name');
    // const image = Cookies.get('image_url');
    console.log('Name: ', name);

    if (!token) {
      navigate('/login');
      return; 
    }

    setName(name);
    setImage(image);

    axios.get("URL_API_KAMU", {
      headers: { "Authorization": "Bearer " + token }
    })
    .then((res) => {
      console.log(res.data);
      setData(res.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    });
  }, [navigate]);


  const handleDetail = (jobId) => {
    const job = filteredData.find(job => job._id === jobId);
    setSelectedJob(job);  
    setModalVisible(true); 
  };

  const closeModal = () => {
    setModalVisible(false); 
  };

  return (
    <section className="">
      <div className=" text-black text-2xl font-bold">
        Halo {name}
      </div>
    </section>
  );
};

export default Dashboard;
