import React, { useEffect, useState } from "react";
import axios from "axios";
import { UploadCloud, ImagePlus } from "lucide-react";
import { Socket } from "socket.io-client";
import { socket } from "../../context/authContext";

const AddSkill = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    tags: "",
    level: "",
    availability: "",
    location: "",
    mode: "",
    coverImage: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const levelOptions = ["Beginner", "Intermediate", "Expert"];
  const modeOptions = ["Online", "Offline", "Hybrid"];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/category");
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImage" && files.length > 0) {
      setFormData({ ...formData, coverImage: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = new FormData();

    for (const key in formData) {
      if (key === "coverImage" && formData.coverImage) {
        payload.append("coverImage", formData.coverImage);
      } else {
        payload.append(key, formData[key]);
      }
    }

    try {
      const res = await axios.post("/skill/add-skill", payload, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert(res.data.message);
      if (res.data.success) {
        Socket.emit("create-room", res.data.skill._id);
      }

      setFormData({
        title: "",
        description: "",
        categoryId: "",
        tags: "",
        level: "",
        availability: "",
        location: "",
        mode: "",
        coverImage: null,
      });
      setPreviewImage(null);
    } catch (error) {
      console.error("Add skill error:", error);
      // alert("Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-20 px-4 bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-indigo-700">Share Your Skill</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Add your skill, help others grow, and build your network.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-medium text-sm mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Full Stack Development"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-sm mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Briefly describe what you're offering..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium text-sm mb-1">Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium text-sm mb-1">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. JavaScript, Teaching"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block font-medium text-sm mb-1">Level *</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select level</option>
              {levelOptions.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block font-medium text-sm mb-1">Availability</label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="e.g. Weekends, Evenings"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium text-sm mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g. Lahore, Pakistan"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Mode */}
          <div>
            <label className="block font-medium text-sm mb-1">Mode *</label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select mode</option>
              {modeOptions.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium text-sm mb-1">Cover Image</label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-indigo-700 transition">
                <ImagePlus size={18} />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  name="coverImage"
                  onChange={handleChange}
                  hidden
                />
              </label>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-lg border"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
            >
              <UploadCloud size={20} />
              {loading ? "Submitting..." : "Submit Skill"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddSkill;
