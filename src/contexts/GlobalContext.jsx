import { createContext, useState, useMemo, useEffect } from "react";
import axios from "axios";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (value) => {
    const numberString = value.replace(/[^,\d]/g, "").toString();
    const split = numberString.split(",");
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");

    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return rupiah;
  };
  const HandleSelect = (listData, key) => {
    const seen = new Set();
    return listData.filter((item) => {
      if (seen.has(item[key])) {
        return false;
      } else {
        seen.add(item[key]);
        return true;
      }
    });
  };

  const useSearchFilter = (data, keys) => {
    const [inputValues, setInputValues] = useState(
      keys.reduce((acc, key) => ({ ...acc, [key]: "" }), {})
    );

    const handleSearch = () => {
    };

    const filteredData = useMemo(() => {
      return data.filter((item) => {
        return keys.every((key) => {
          const input = inputValues[key];
          if (!input) return true;

          const value = item.attributes?.[key];
          return value?.toLowerCase().includes(input.toLowerCase());
        });
      });
    }, [data, keys, inputValues]);

    const handleChange = (key, value) => {
      setInputValues((prev) => ({ ...prev, [key]: value }));
    };

    return {
      inputValues,
      handleChange,
      handleSearch,
      filteredData,
    };
  };

  const {
    inputValues,
    handleChange,
    handleSearch,
    filteredData,
  } = useSearchFilter(data, ["title", "description"]);

  const fetchProjects = () => {
    setLoading(true);
    axios
      .get("https://api.kyuib.my.id/api/v1/projects")
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchFeaturedProjects = () => {
    setLoading(true);
    axios
      .get("https://api.kyuib.my.id/api/v1/landing-pages/1/featured-projects")
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    setLoading(true);
    axios
      .get("https://api.kyuib.my.id/api/v1/categories")
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchArticles = () => {
    setLoading(true);
    axios
      .get("https://api.kyuib.my.id/api/v1/articles")
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };


  const fetchProjectImage = (projectId) => {
    setLoading(true);
    axios
      .get(`https://api.kyuib.my.id/api/v1/projects/${projectId}/images`)
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };


  useEffect(() => {
    fetchProjects();
    axios
      .get("https://api.kyuib.my.id/api/v1/projects")
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        HandleSelect,
        inputValues,
        handleChange,
        handleSearch,
        filteredData,
        setData,
        data,
        loading,
        fetchProjects,
        fetchArticles,
        fetchProjectImage,
        formatRupiah,
        fetchCategories,
        fetchFeaturedProjects,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
