import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LoaderComp from "../loader.jsx";
import toast from "react-hot-toast";
import { sendNotification } from "../utility/notification.jsx";

const ViewSkillComp = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const fetchSkill = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/skill/single-skill/${skillId}`,
        { withCredentials: true }
      );
      setSkill(res.data.data);
    } catch (err) {
      console.error("Error fetching skill:", err);
      toast.error("Failed to fetch skill");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkill();
  }, [skillId]);

  const handleVerify = async (userId, verify, type, title) => {
    try {
      await axios.patch(
        `http://localhost:8000/admin/verify-skill/${skill._id}`,
        { isVerify: verify },
        { withCredentials: true }
      );
      toast.success(`Skill ${verify ? "accepted" : "rejected"}`);
      sendNotification(userId, type, verify, `${title} skill list request by system admin`);
      fetchSkill();
    } catch (err) {
      console.error("Failed to update verification status:", err);
      toast.error("Failed to update verification status");
    }
  };

  const handleDeleteSkill = async (userId, type, status, title) => {
    if (!skill?._id) return;
    try {
      const response = await axios.delete(
        `http://localhost:8000/admin/delete-skill/${skill._id}`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      sendNotification(userId, type, status, `${status} by system admin violates policy`);
      navigate("/admin/skills");
    } catch (err) {
      console.error("Delete skill failed:", err);
      toast.error("Failed to delete skill");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(
        `http://localhost:8000/admin/delete-review/${reviewId}`,
        { withCredentials: true }
      );
      toast.success("Review deleted");
      fetchSkill();
    } catch (err) {
      console.error("Delete review failed:", err);
      toast.error("Failed to delete review");
    }
  };

  if (loading) return <LoaderComp />;
  if (!skill) return <p className="p-4 text-red-500">Skill not found.</p>;

  const reviews = skill.review || [];
  const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating = reviews.length ? totalRating / reviews.length : 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 font-sans">
      {/* Provider Info */}
      <div className="flex items-center gap-4 mb-2">
        <img
          src={skill.providerId?.profileImage || "/placeholder.jpg"}
          alt="Provider"
          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {skill.providerId?.fullName}
          </h2>
          <p className="text-sm text-gray-500">{skill.providerId?.email}</p>
        </div>
      </div>

      {/* Action Buttons - aligned right */}
      <div className="flex justify-end gap-4 mb-6">
        {skill.isVerify === false ? (
          <>
            <button
              onClick={() =>
                handleVerify(skill.providerId._id, true, "SKILL_APPROVED", skill.title)
              }
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 text-sm rounded-full"
            >
              Accept
            </button>
            <button
              onClick={() =>
                handleVerify(skill.providerId._id, false, "SKILL_APPROVED", skill.title)
              }
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 text-sm rounded-full"
            >
              Reject
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() =>
                handleDeleteSkill(skill.providerId._id, "SKILL_APPROVED", "Deleted", skill.title)
              }
              className="border border-red-500 text-red-500 hover:bg-red-50 px-5 py-2 text-sm rounded-full"
            >
              Delete Skill
            </button>
            <button
              onClick={() => navigate(`/admin/chat/${skill._id}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-sm rounded-full"
            >
              Chats
            </button>
          </>
        )}
      </div>

      {/* Skill Details */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-indigo-700">{skill.title}</h1>
        <p className="text-gray-700">{skill.description}</p>

        <div className="flex flex-wrap gap-2">
          {skill.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-100 text-gray-600 px-3 py-1 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
          <p><strong>Category:</strong> {skill.categoryId?.name || "N/A"}</p>
          <p><strong>Level:</strong> {skill.level}</p>
          <p><strong>Mode:</strong> {skill.mode}</p>
          <p><strong>Location:</strong> {skill.location}</p>
          <p><strong>Rating:</strong> {averageRating.toFixed(1)} ★</p>
          <p><strong>Total Reviews:</strong> {reviews.length}</p>
        </div>

        {/* Image */}
        {skill.imagesUrl?.[0] && (
          <img
            src={skill.imagesUrl[0]}
            alt="Skill"
            className="w-full max-w-md mt-6 rounded-lg border"
          />
        )}
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Reviews</h3>
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="relative bg-gray-50 border rounded p-4 text-sm text-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Rating: {rev.rating} ★</p>
                    <p>{rev.comment}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setMenuOpenId((prev) => (prev === rev._id ? null : rev._id))
                      }
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ⋯
                    </button>
                    {menuOpenId === rev._id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white shadow-md border rounded z-10">
                        <button
                          onClick={() => {
                            setMenuOpenId(null);
                            handleDeleteReview(rev._id);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete Review
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSkillComp;
