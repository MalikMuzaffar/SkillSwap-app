import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Star } from 'lucide-react';
import { AuthContext } from '../../context/authContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import LoaderComp from '../loader';

const ITEMS_PER_PAGE = 6;

const ExploreComp = () => {
  const { user } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [auth,setAuth]=useState(false);

  const navigate = useNavigate();
useEffect(() => {
  const fetchAll = async () => {
    let isAuth = false;

    // ✅ Step 1: Check auth
    try {
      const response = await axios.get('/users/check-auth', {
        withCredentials: true,
      });

      if (response.data.success) {
        setAuth(true);
        isAuth = true;
      } else {
        setAuth(false);
      }
    } catch (error) {
      console.log("Auth check error:", error?.response?.data?.message || error.message);
      setAuth(false);
    }

    // ✅ Step 2: Fetch skills & categories (conditionally based on isAuth)
    try {
      const skillUrl = `/skill/all-skill${isAuth && user?.user?._id ? `/${user.user._id}` : ''}`;
      const skillsRes = await axios.get(skillUrl);

      const categoriesRes = await axios.get('/category');
      setSkills(skillsRes.data.data);
      setFilteredSkills(skillsRes.data.data);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchAll();
}, []); // 👈 Run only once on component mount


  useEffect(() => {
    let updated = [...skills];

    if (search) {
      updated = updated.filter(skill =>
        skill.title.toLowerCase().includes(search.toLowerCase()) ||
        skill.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      updated = updated.filter(skill => skill.categoryId === selectedCategory);
    }

    if (locationFilter) {
      updated = updated.filter(skill =>
        skill.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (ratingFilter) {
      updated = updated.filter(skill =>
        skill.averageRating >= parseFloat(ratingFilter)
      );
    }

    setFilteredSkills(updated);
    setCurrentPage(1);
  }, [search, selectedCategory, locationFilter, ratingFilter, skills]);

  const handleConnect = async (skillId, providerId) => {
    try {
        const checkAuth = await axios.get('/users/check-auth', {
          withCredentials: true,
        });
      const response = await axios.post(
        `/connection/request/${user?.user._id}`,
        { providerId, skillId },
        { withCredentials: true }
      );
      const data = response.data;
      if(data.success){ 
        setSkills(prev => prev.filter(skill => skill._id !== skillId));
        toast.success(data.message)
      }else{
        toast.error(data.message);
      }
    } catch(error) { 
          if(!error.response.data.success){
          toast.error("please signin first");
          navigate('/signin')
          return 
        }
      toast.error("Failed to send request");
    }
  };

  const handleDetail = async(skillId) => {
    try {
    const checkAuth = await axios.get('/users/check-auth', {
          withCredentials: true,
        });
    navigate(`/skill/${skillId}`,{state:'detail'});
        } catch (error) {
                if(!error.response.data.success){
          toast.error("please signin first");
          navigate('/signin')
          return 
        }
    }
    }

  const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE);
  const paginatedSkills = filteredSkills.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <LoaderComp />;

  return (
    <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Skills</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-sm">
          <Search className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search skills..."
            className="w-full outline-none text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category */}
        <select
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm bg-white"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories?.map(category => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>

        {/* Location */}
        <input
          type="text"
          placeholder="Filter by location"
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm bg-white"
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
        />

        {/* Rating */}
        <select
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm bg-white"
          value={ratingFilter}
          onChange={e => setRatingFilter(e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="4">4 stars & up</option>
          <option value="3">3 stars & up</option>
          <option value="2">2 stars & up</option>
          <option value="1">1 star & up</option>
        </select>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedSkills?.map(skill => (
          <div
            key={skill._id}
            className="rounded-2xl shadow-lg bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl"
          >
            <img
              src={skill.imagesUrl[0] || '/placeholder.png'}
              alt={skill.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800">{skill.title.length > 22 ? skill.title.slice(0,22)+"..." : skill.title}</h2>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {skill.level}
                </span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`mr-1 ${i <= Math.round(skill.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill={i <= Math.round(skill.averageRating) ? 'currentColor' : 'none'}
                  />
                ))}
                <span className="ml-1 text-xs text-gray-600">
                  {skill.averageRating?.toFixed(1) || "0.0"}
                </span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-3">{skill.description.length > 40 ?  skill.description.slice(0,40)+"...":skill?.description}</p>
              <div className="text-gray-500 text-xs mt-2">
                <p><span className="font-medium">Mode:</span> {skill.mode}</p>
                <p><span className="font-medium">Location:</span> {skill.location}</p>
                <p><span className="font-medium">Availability:</span> {skill.availability || 'N/A'}</p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  className="w-1/2 bg-indigo-600 text-white py-2 rounded-xl transition-all cursor-pointer duration-300 hover:bg-indigo-700 hover:scale-105"
                  onClick={() => handleConnect(skill._id, skill.providerId._id)}
                >
                  Connect
                </button>
                <button
                  className="w-1/2 bg-gray-100 text-gray-800 py-2 rounded-xl transition-all duration-300 cursor-pointer hover:bg-gray-200 hover:scale-105"
                  onClick={() => handleDetail(skill._id)}
                >
                  Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span className="font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreComp;
