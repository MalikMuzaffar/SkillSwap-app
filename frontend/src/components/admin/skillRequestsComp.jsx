import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoaderComp from "../loader.jsx";
import { sendNotification } from "../utility/notification.jsx";

const SkillRequestComp = () => {
  const [requests, setRequests] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/admin/skill-requests", {
          withCredentials: true,
        });
        setRequests(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load skill requests");
      }
    };
    fetchRequests();
  }, []);

  const handleVerify = async (skillId, approve, userId, title) => {
    try {
      await axios.patch(
        `/admin/verify-skill/${skillId}`,
        { isVerify: approve },
        { withCredentials: true }
      );
      toast.success(`Skill ${approve ? "accepted" : "rejected"}`);
      setRequests((prev) => prev.filter((s) => s._id !== skillId));
      sendNotification(userId, "SKILL_APPROVED", approve, `${approve ? "Accepted" : "Rejected"} request of ${title}`);
    } catch {
      toast.error("Failed to update skill");
    }
  };

  if (requests === null) return <LoaderComp />;

  if (requests.length === 0) {
    return <div className="py-10 text-center text-gray-500">No pending skill requests.</div>;
  }

  return (
    <div className="overflow-x-auto bg-gray-50 p-6 rounded-lg shadow-inner">
      <h3 className="text-2xl font-bold text-indigo-700 mb-6">Pending Skill Requests</h3>
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-indigo-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((skill) => (
            <tr key={skill._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">
                <img
                  src={skill.imagesUrl?.[0] || "/placeholder.jpg"}
                  alt={skill.title}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </td>
              <td className="px-6 py-4 text-gray-800">{skill.title}</td>
              <td className="px-6 py-4 text-gray-600">{skill.categoryId?.name || "N/A"}</td>
              <td className="px-6 py-4 text-gray-600 line-clamp-2">{skill.description}</td>
              <td className="px-6 py-4 text-center">
                <div className="flex flex-col gap-2 items-center">
                  <button
                    onClick={() => navigate(`/admin/skill/${skill._id}`)}
                    className="px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-full transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleVerify(skill._id, true, skill.providerId._id, skill.title)}
                    className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-full transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleVerify(skill._id, false, skill.providerId._id, skill.title)}
                    className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full transition"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkillRequestComp;
