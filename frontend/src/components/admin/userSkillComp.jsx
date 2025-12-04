import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import LoaderComp from "../loader.jsx";
import { sendNotification } from "../utility/notification.jsx";
import NotFound from "../utility/notFoundComp.jsx";

const UserSkillComp = () => {
  const { userId } = useParams();
  const [skills, setSkills] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`/admin/user-skill/${userId}`, {
          withCredentials: true,
        });
        const rawSkills = res.data?.data || [];

        // Calculate average rating from reviews
        const updatedSkills = rawSkills.map(skill => {
          const reviews = skill.review || [];
          const averageRating = reviews.length
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
          return { ...skill, averageRating };
        });

        setSkills(updatedSkills);
        if (updatedSkills.length > 0) {
          setUser(updatedSkills[0].providerId);
        }
      } catch (error) {
        toast.error("Failed to load skills");
      }
    };

    if (userId) fetchSkills();
  }, [userId]);

  const deleteSkill = async (userId,type,status,title,skillId) => {
    try {
      const response = await axios.delete(`/admin/delete-skill/${skillId}`, {
        withCredentials: true,
      });
      if(response.data.success){
      toast.success("Skill deleted");
      setSkills(prev => prev.filter(skill => skill._id !== skillId));
      sendNotification(userId,type,status,`${status} by system admin voliate policy`)
      }else{
        toast.error("Failed to delete skill")
      }
    } catch (error) {
      console.log(error);
      
      toast.error("Failed to delete skill");
    }
  };

return(
    <main className="min-h-screen bg-white px-6 py-10 max-w-6xl mx-auto font-sans">
      {user && (
        <div className="flex items-center gap-4 mb-8">
          <img
            src={user?.profileImage}
            alt="User Avatar"
            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.fullName}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold text-indigo-700 mb-4">User Skills</h3>

      {/* Header Row */}
      <div className="hidden md:grid grid-cols-12 text-sm font-semibold text-gray-600 border-b py-2 mb-2">
        <div className="col-span-1">Image</div>
        <div className="col-span-3">Title</div>
        <div className="col-span-3">Category</div>
        <div className="col-span-2">Rating</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      {/* Skill Rows */}
      {!skills ? <LoaderComp/> : (
      skills.length<1 ? <p className="text-center text-gray-400 text-lg mt-10">No Skill found.</p> : skills.map(skill => (
        <div
          key={skill._id}
          className="grid grid-cols-1 md:grid-cols-12 items-center border-b py-4 gap-3 md:gap-0"
        >
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <img
              src={skill.imagesUrl?.[0] || "/placeholder.jpg"}
              alt="Skill"
              className="w-12 h-12 object-cover rounded-full border border-gray-300"
            />
          </div>

          <div className="md:col-span-3 font-medium text-gray-800">{skill.title}</div>
          <div className="md:col-span-3 text-gray-600">{skill.categoryId?.name || "N/A"}</div>
          <div className="md:col-span-2 text-gray-600">{skill.averageRating.toFixed(1)} ★</div>

          <div className="md:col-span-3 flex md:justify-end gap-2">
            <button
              onClick={() => navigate(`/admin/skill/${skill._id}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 text-sm rounded-full transition"
            >
              Detail
            </button>
            <button
              onClick={() => deleteSkill(skill.providerId._id,"DELETE_SKILL",'Delete',skill.title,skill._id)}
              className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-1.5 text-sm rounded-full transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))
      )}
    </main>
)
};

export default UserSkillComp;

