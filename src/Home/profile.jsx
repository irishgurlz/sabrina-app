import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const Profile = () => {
  const [userName, setUserName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    const name = Cookies.get('user_name');
    const image = Cookies.get('image_url');
    const email = Cookies.get('email');
    if (!token) {
      navigate('/login'); 
    }
    else{
      setUserName(name || 'Anonymous');
      setImageUrl(image || 'https://via.placeholder.com/150');
      setEmail(email || 'Anonymous');
      setLoading(false); 
    }
  }, []);

  const handlePagePass = () => {
    navigate(`/dashboard/change-password`);
  };
  return (
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-white p-6">
        {loading ? (
            <div className="col-span-full flex justify-center items-center py-10">
              <img src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-05-37_512.gif" className="w-[60px] h-[60px]" alt=""/>
            </div>
          ) : (

            <div className="backdrop-blur-xl bg-white border border-white/30 shadow-2xl rounded-3xl p-10 max-w-md w-full text-center">
                <img src={imageUrl} alt="Profile" className="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-white shadow-md"
                />
                <p className="text-gray-500">Welcome to your profile</p>
                <h2 className="text-3xl text-gray-800 mb-6 font-bold">{userName}</h2>

                <div className="flex items-center justify-center gap-2 bg-white/70 px-4 py-2 rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5v9a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 16.5v-9m19.5 0L12 13.5 2.25 7.5m19.5 0L12 13.5m0 0L2.25 7.5" />
                </svg>
                <span className="text-gray-700 text-sm">{email}</span>
                </div>

                <button onClick={() => handlePagePass()} className="mt-8 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md transition duration-300">Change Password</button>
            </div>
        )}
    </section>
  );
};

export default Profile;
