import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import "../App.css";

const DetailArticle = () => {
  const [ArticleDetail, setArticleDetail] = useState(null);
  const [ArticleImage, setArticleImage] = useState([]);
  const [singleImage, setSingleImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [ArticleImageVisible, setArticleImageVisible] = useState(false);

  // const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const res = await axios.get(`https://api.kyuib.my.id/api/v1/articles/${id}`);
        setArticleDetail(res.data.data);
      } catch (err) {
        console.error("Failed to fetch article detail");
      }
      setLoading(false);
    };

    const fetchImages = async () => {
      try {
        const res = await axios.get(`https://api.kyuib.my.id/api/v1/articles/${id}/images`);
        setArticleImage(res.data.data);
      } catch (err) {
        console.error("Failed to fetch images");
      }
    };

    fetchArticle();
    fetchImages();
  }, [id]);

  useEffect(() => {
    if (!selectedImageId) return;
    setLoading(true);
    axios
      .get(`https://api.kyuib.my.id/api/v1/articles/${id}/images/${selectedImageId}`)
      .then((res) => {
        setSingleImage(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedImageId, id]);

  const handleArticleImage = (imageId) => {
    setSelectedImageId(imageId);
    setArticleImageVisible(true);
  };


  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <section className="mt-24 mx-5 md:mx-16 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-5 relative rounded-2xl overflow-hidden shadow-md">
          <div className="h-[350px] md:h-[500px] bg-cover bg-center transition-all duration-300" 
            style={{ backgroundImage: `url(${ ArticleImageVisible ? singleImage?.attributes?.url : ArticleDetail?.attributes?.hero_image_url})`,}}>
            <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </div>

        <div className="md:col-span-5 bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {ArticleDetail?.attributes?.title}
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
            {ArticleDetail?.attributes?.body}
          </p>

          
        </div>

        {ArticleImage.length > 0 && (
          <div className="md:col-span-5 mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Galeri Gambar</h2>
            <div className="flex flex-wrap gap-4">
              {ArticleImage.map((img) => (
                <img key={img.id} src={img.attributes?.url} alt="Gallery" className="w-32 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition" onClick={() => handleArticleImage(img.id)} />
              ))}
              {ArticleImageVisible && (
                <button className="text-sm text-red-600 hover:underline"> Reset Gambar Utama </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DetailArticle;
