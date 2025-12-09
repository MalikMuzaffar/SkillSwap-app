import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Bell, Check, Circle } from "lucide-react";
import toast from "react-hot-toast";
import LoaderComp from "../loader.jsx";
import { AuthContext } from "../../context/authContext.jsx";
//import { socket } from "../../socket.js";

const NotificationComp = () => {
  const [notifications, setNotifications] = useState(null);
  const {user} = useContext(AuthContext);

  // Fetch notifications for the logged-in user
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/notification/${user?.user?._id}`, {
        withCredentials: true,
      });
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notifications");
    }
  };

  // Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as read");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (notifications === null) return <LoaderComp />;

  if (notifications.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        No notifications.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 min-h-screen">
      <div className="bg-white shadow rounded-2xl p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Bell className="text-blue-500" /> Notifications
          </h2>
        </div>

        <div className="space-y-4">
          {notifications.map((note) => (
            <div
              key={note._id}
              className={`flex items-start justify-between gap-4 p-4 rounded-xl shadow-sm transition
                ${note.isRead ? "bg-gray-50" : "bg-white border border-blue-100"}
              `}
            >
              {/* Left: indicator + message */}
              <div className="flex items-center gap-4">
                {!note.isRead && (
                  <Circle className="w-4 h-4 text-blue-500" />
                )}
                <div>
                  <p className="text-gray-800">{note.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Right: mark read */}
              {!note.isRead && (
                <button
                  onClick={() => markAsRead(note._id)}
                  className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                >
                  <Check className="w-4 h-4" /> Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationComp;
