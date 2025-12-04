import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Save, X, Pencil } from "lucide-react";
import { AuthContext } from "../../context/authContext";

const UpdateProfileComp = () => {
  const { updateUserField } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    designation: "",
  });

  const [editableFields, setEditableFields] = useState({
    fullName: false,
    bio: false,
    designation: false,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/get-user", {
          withCredentials: true,
        });

        const { fullName, bio, profileImage, designation } = res.data.data;
        setFormData({ fullName, bio, designation });
        setPreviewImage(profileImage);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (successMsg) {
      const timeout = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMsg]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removePreviewImage = () => {
    setPreviewImage("");
    setProfileImageFile(null);
  };

  const toggleEdit = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      const formPayload = new FormData();
      formPayload.append("fullName", formData.fullName);
      formPayload.append("bio", formData.bio);
      formPayload.append("designation", formData.designation);

      if (profileImageFile) {
        formPayload.append("profileImage", profileImageFile);
      }

      const response = await axios.patch("/users/update-profile", formPayload, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        updateUserField({ user: response.data.data });
        setSuccessMsg(response.data.message);
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-2 gap-8 p-8">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Picture</h2>
          {previewImage ? (
            <div className="relative group">
              <img
                src={previewImage}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-full shadow border border-gray-300"
              />
              <button
                type="button"
                onClick={removePreviewImage}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="w-40 h-40 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full">
              No Image
            </div>
          )}

          <label className="mt-6 cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-md shadow text-sm transition">
            Choose Profile Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Edit Profile</h2>

          {successMsg && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 text-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <Field
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              editable={editableFields.fullName}
              onEdit={() => toggleEdit("fullName")}
              onChange={handleChange}
            />

            {/* Bio */}
            <Field
              label="Bio"
              name="bio"
              type="textarea"
              value={formData.bio}
              editable={editableFields.bio}
              onEdit={() => toggleEdit("bio")}
              onChange={handleChange}
            />

            {/* Designation */}
            <Field
              label="Designation"
              name="designation"
              value={formData.designation}
              editable={editableFields.designation}
              onEdit={() => toggleEdit("designation")}
              onChange={handleChange}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save />}
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Input/Textarea Field
const Field = ({ label, name, type = "text", value, editable, onEdit, onChange }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        disabled={!editable}
      />
    ) : (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        disabled={!editable}
      />
    )}
    {!editable && (
      <button
        type="button"
        onClick={onEdit}
        className="absolute top-8 right-2 text-gray-400 hover:text-blue-600 transition"
      >
        <Pencil size={16} />
      </button>
    )}
  </div>
);

export default UpdateProfileComp;
