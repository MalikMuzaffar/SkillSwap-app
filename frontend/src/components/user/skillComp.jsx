import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/authContext';
import LoaderComp from '../loader';

const SkillComp = () => {
  const { skillId } = useParams();
  const { user } = useContext(AuthContext);
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [commentsList, setCommentsList] = useState([]);

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const dataLocation = useLocation();
  const requestDetail = dataLocation.state;
  

  useEffect(() => {
    const fetchSkillDetail = async () => {
      try {
        const res = await axios.get(`/skill/single-skill/${skillId}`);
        setSkill(res.data.data);
      } catch (err) {
        toast.error('Failed to load skill details');
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/review/get-review/${skillId}`, {
          withCredentials: true,
        });
        setCommentsList(res.data.data.slice(0, 5));
      } catch {
        toast.error('Failed to load reviews');
      }
    };

    fetchSkillDetail();
    fetchReviews();
  }, [skillId]);

  const handleConnect = async () => {
    try {
          const checkAuth = await axios.get('/users/check-auth', {
          withCredentials: true,
    });
      const res = await axios.post(
        `/connection/request/${user?.user._id}`,
        { providerId: skill.providerId._id, skillId },
        { withCredentials: true }
      );
      toast.success(res.data.message);
    } catch(error){
               if(!error.response.data.success){
        toast.error("Please Signin first")
        Navigate('/signin')
        return;
      }
      toast.error('Could not send request');
    }
  };

  const handleSkillVerify = async (approve) => {
    try {
      const res = await axios.patch(
        `/skill/verify/${skill._id}`,
        { isVerify: approve },
        { withCredentials: true }
      );
      toast.success(res.data.message || (approve ? 'Skill approved' : 'Skill rejected'));
      setSkill({ ...skill, isVerify: approve });
    } catch (err) {
      toast.error('Failed to update skill verification status');
    }
  };

  const handleSubmitReview = async () => {
    try {
              const checkAuth = await axios.get('/users/check-auth', {
          withCredentials: true,
    });
    if (!comment || rating < 1) return toast.error('Add comment and select rating');
      const res = await axios.post(
        `/review/send-review`,
        { skillId, comment, rating },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      const reviewData = res.data.data;

      if (res.data.message === 'Review updated successfully') {
        setCommentsList((prevList) =>
          prevList.map((item) =>
            item._id === reviewData._id
              ? { ...item, rating: reviewData.rating, comment: reviewData.comment }
              : item
          )
        );
      } else {
        setCommentsList((prevList) => [...prevList, reviewData]);
      }

      setComment('');
      setRating(0);
    } catch (error) {
            if(!error.response.data.success){
        toast.error("Please Signin first")
        Navigate('/signin')
        return;
      }
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleSubmitReport = async () => {
    try {
      const checkAuth = await axios.get('/users/check-auth', {
      withCredentials: true,
    });
    if (!reportReason) {
      return toast.error('Please select a reason for reporting.');
    }
      const res = await axios.post(
        `/report/${skillId}`,
        {
          userId: user?.user?._id,
          reason: reportReason,
          description: reportDescription,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message || 'Report submitted');
      setShowReportForm(false);
      setReportReason('');
      setReportDescription('');
    } catch (err) {
      if(!err.response.data.success){
        toast.error("Please Signin first")
        Navigate('/signin')
        return;
      }
      toast.error(err?.response?.data?.message || 'Failed to submit report');
    }
  };

  if (loading) return <LoaderComp />;

  const {
    title,
    description,
    imagesUrl,
    level,
    mode,
    location,
    availability,
    tags,
    categoryId,
    providerId,
    averageRating,
    isVerify,
  } = skill;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 text-gray-800">
      <div className="max-w-5xl mx-auto py-10 px-6">
        <img
          src={imagesUrl[0]}
          alt={title}
          className="rounded-xl w-full h-80 object-cover shadow-md mb-6"
        />
        <h1 className="text-4xl font-bold mb-1">{title}</h1>
        <p className="text-sm text-indigo-600 font-semibold mb-1">
          {categoryId?.name} • {level}
        </p>

        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i <= Math.round(averageRating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
              fill={i <= Math.round(averageRating || 0) ? 'currentColor' : 'none'}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">
            {averageRating?.toFixed(1) || '0.0'} / 5
          </span>
        </div>

        <p className="text-lg text-gray-700 mb-6 leading-relaxed">{description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags?.map((tag, i) => (
            <span key={i} className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
          <p><strong>Mode:</strong> {mode}</p>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Availability:</strong> {availability || 'N/A'}</p>
          <p><strong>Provider:</strong> {providerId?.fullName}</p>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <img
            src={providerId?.profileImage}
            alt=""
            className="w-14 h-14 rounded-full border-2 border-indigo-600"
          />
          <div>
            <p className="font-semibold">{providerId?.fullName}</p>
            <p className="text-sm text-gray-500">Skill Provider</p>
          </div>
        </div>
{(user.user._id!=skill.providerId._id && requestDetail!="connectionRequest") && (
        <button
          onClick={handleConnect}
          className="bg-indigo-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-indigo-700 hover:scale-105 transition"
        >
          Connect
        </button>
)}
        {/* Admin Skill Approval Section */}
        {isVerify === false && user?.user?.role === 'admin' && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleSkillVerify(true)}
              className="bg-green-600 text-white py-2 px-6 rounded-full font-medium hover:bg-green-700 transition"
            >
              Approve Skill
            </button>
            <button
              onClick={() => handleSkillVerify(false)}
              className="bg-red-600 text-white py-2 px-6 rounded-full font-medium hover:bg-red-700 transition"
            >
              Reject Skill
            </button>
          </div>
        )}
  {/* Report Section */}
  {console.log(skill,"skill is came")  }
{user.user._id != skill.providerId._id && (
        <div className="mt-6 mb-12">
          {!showReportForm ? (
            <button
              onClick={() => setShowReportForm(true)}
              className="text-sm text-red-600 hover:text-red-700 underline font-medium"
            >
              Report this Skill
            </button>
          ) : (
            <div className="mt-4 bg-white border border-red-200 p-5 rounded-xl shadow-sm space-y-4">
              <h4 className="text-lg text-red-700 font-semibold">Report Skill</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Spam or Scam">Spam or Scam</option>
                  <option value="False Information">False Information</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows="4"
                  placeholder="Add more details (optional)"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleSubmitReport}
                  className="bg-red-600 text-white px-5 py-2 rounded-full font-medium hover:bg-red-700 transition"
                >
                  Submit Report
                </button>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
)}

        {/* Reviews */}
        {commentsList.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">User Reviews</h3>
            <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
              {commentsList.map((rev, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-4">
                  <img
                    src={rev.senderId?.profileImage || 'https://via.placeholder.com/40'}
                    alt="User"
                    className="w-10 h-10 rounded-full border"
                  />
                  <div>
                    <p className="font-semibold text-indigo-700">
                      {rev.senderId?.fullName || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 mb-1">
                      Rated: {rev.rating} ★ — {new Date(rev.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700">{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
         {/* Leave a Review */}
        {user.user._id!=skill.providerId._id && ( 
        <div className="bg-white mt-10 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
          <div className="flex items-center mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer w-6 h-6 ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                fill={rating >= star ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <textarea
            className="w-full border rounded-lg p-3 text-sm text-gray-700"
            placeholder="Share your experience..."
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={handleSubmitReview}
            className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-full font-medium hover:bg-indigo-700 transition"
          >
            Submit Review
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default SkillComp;
