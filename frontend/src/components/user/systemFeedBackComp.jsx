import React, { useState, useContext } from "react";
import axios from "axios";
import { Star } from "lucide-react"; // Or any icon library you're using
import toast from "react-hot-toast";
import { AuthContext } from "../../context/authContext.jsx";

const SystemFeedback = () => {
  const { user } = useContext(AuthContext); // Assuming user context is set
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Please write your feedback.");
      return;
    }

    try {
      const response = await axios.post(
        "/review/send-review/application",
        {
          userId: user?.user?._id,
          rating,
          comment,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Thanks for your feedback!");
        setComment("");
        setRating(0);
      } else {
        toast.error("Failed to submit feedback.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="bg-white p-6 md:mb-6 rounded-xl shadow-md max-w-xl mx-auto mt-10">
      <h3 className="text-2xl font-semibold mb-4 text-center text-indigo-700">We Value Your Feedback</h3>
      <div className="flex items-center justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer w-6 h-6 ${rating >= star ? "text-yellow-500" : "text-gray-300"}`}
            fill={rating >= star ? "currentColor" : "none"}
          />
        ))}
      </div>
      <textarea
        className="w-full border rounded-lg p-3 text-sm text-gray-700"
        placeholder="Tell us what you think about SkillSwap..."
        rows="5"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-full font-medium hover:bg-indigo-700 transition w-full"
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default SystemFeedback;
