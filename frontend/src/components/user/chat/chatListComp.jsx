// src/components/chat/ChatListComp.jsx
import React from 'react';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';


export const ChatListComp = ({ rooms, onSelectRoom }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="w-full h-full bg-white p-4 overflow-y-auto">
      <div className="mb-4 relative">
        <input 
          type="text" 
          placeholder="Search chats..." 
          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <svg 
          className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <ul className="space-y-1">
        {rooms?.map((room) => {
          const isActive = roomId === room._id;
          const hasImage = room.skillId?.imagesUrl?.[0];
          const unreadCount = room.unreadCount || 0;

          return (
            <li 
              key={room._id} 
              onClick={() => {
                onSelectRoom(room);
                navigate(`/chat/${room._id}`);
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all duration-200 border 
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md' 
                  : 'hover:bg-gray-50 border-transparent'
                }`}
            >
              <div className="flex-shrink-0">
                {hasImage ? (
                  <img 
                    src={room.skillId.imagesUrl[0]} 
                    alt="Skill Avatar" 
                    className="h-12 w-12 rounded-xl object-cover border border-gray-200" 
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {room.skillId?.title?.substring(0, 2).toUpperCase() || 'SK'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {room.skillId?.title || `Room ${room._id.slice(-5)}`}
                </p>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {room.lastMessage || "Start a conversation..."}
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="block text-xs text-gray-400">
                  {room.lastActive ? moment(room.lastActive).format('hh:mm A') : ''}
                </span>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 w-5 bg-blue-500 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};