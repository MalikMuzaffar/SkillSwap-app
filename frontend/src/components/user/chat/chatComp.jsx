// // src/pages/chat/ChatRoomPage.jsx
// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { Smile, Send, ArrowLeft, Paperclip, Download, Check, Loader2, MoreVertical, Lock, Unlock } from 'lucide-react';
// import Picker from 'emoji-picker-react';
// import { ChatListComp } from './chatListComp.jsx';
// import moment from 'moment';

// // Import reusable components
// import { 
//   compressFile,
//   FilePreview, 
//   getInitials, 
//   handleDownloadFile 
// } from './chatUtils.jsx';

// // Context
// import { AuthContext } from '../../../context/authContext.jsx';
// import { io } from 'socket.io-client';
// import toast from 'react-hot-toast';

// const socket = io("http://localhost:3000");

// const ChatRoomComp = () => {
//   const { user } = useContext(AuthContext);
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [rooms, setRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [showEmoji, setShowEmoji] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [showMembers, setShowMembers] = useState(false);
//   const [members, setMembers] = useState([]);
//   const [isAdmin, setIsAdmin] = useState(false);
  
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);
//   const messagesContainerRef = useRef(null);
//   const dropdownRef = useRef(null);

//   // Responsive layout handler
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Fetch chat rooms
//   useEffect(() => {
//     if (!user?.user?._id) return;
    
//     const fetchRooms = async () => {
//       try {
//         const res = await axios.get(
//           `/message/get-room/${user.user._id}`, 
//           { withCredentials: true }
//         );
//         const roomsData = res.data?.data || [];
//         setRooms(roomsData);
        
//         if (roomId) {
//           const room = roomsData.find(r => r._id === roomId);
//           if (room) setSelectedRoom(room);
//         }
//       } catch (error) {
//         console.error("Error fetching chat rooms:", error);
//       }
//     };
    
//     fetchRooms();
//   }, [user, roomId]);

//   // Check if user is admin or moderator
//   useEffect(() => {
//     if (selectedRoom && user?.user?._id) {
//       const currentMember = selectedRoom.members.find(
//         member => member.user === user.user._id || member.user?._id === user.user._id
//       );
//       const isAdminOrModerator = currentMember && 
//         (currentMember.role === 'admin' || currentMember.role === 'moderate');
//       setIsAdmin(isAdminOrModerator);
//     }
//   }, [selectedRoom, user]);

//   // Socket and message handling
//   useEffect(() => {
//     if (!roomId || !user?.user?._id) return;
    
//     socket.emit("register-user", user.user._id);
//     socket.emit('join-room', roomId);

//     const fetchMessages = async () => {
//       try {
//         const res = await axios.post(
//           '/message/reterive-chats', 
//           { roomId, limit: 50 }, 
//           { withCredentials: true }
//         );
//         setMessages(res.data?.data || []);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };
    
//     fetchMessages();

//     const handleReceiveMessage = (message) => {
//       if (typeof message.senderId === 'string') {
//         message.senderId = {
//           _id: message.senderId,
//           fullName: message.senderId === user.user._id ? user.user.fullName : 'Unknown',
//           profileImage: ''
//         };
//       }
//       setMessages(prev => [...prev, message]);
//     };
    
//     socket.on('receive-group-message', handleReceiveMessage);
//     return () => socket.off('receive-group-message', handleReceiveMessage);
//   }, [roomId, user]);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   }, [messages]);

//   // Handle emoji picker outside click
//   useEffect(() => {
//     if (showEmoji) {
//       const handleClickOutside = (e) => {
//         if (!e.target.closest('.emoji-picker') && !e.target.closest('.emoji-button')) {
//           setShowEmoji(false);
//         }
//       };
//       document.addEventListener('mousedown', handleClickOutside);
//       return () => document.removeEventListener('mousedown', handleClickOutside);
//     }
//   }, [showEmoji]);

//   // Handle dropdown outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setShowMembers(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Message sending handler
//   const handleSend = async () => {
//     if (!newMessage.trim() && !selectedFile) return;

//     if (selectedFile && selectedRoom?._id) {
//       const compressed = await compressFile(selectedFile);
//       const tempId = Date.now();

//       const tempMsg = {
//         tempId,
//         roomId: selectedRoom._id,
//         senderId: { 
//           _id: user.user._id, 
//           fullName: user.user.fullName, 
//           profileImage: user.user.profileImage || '' 
//         },
//         text: '',
//         fileName: compressed.name,
//         fileUrl: 'Uploading...',
//         isFile: true,
//         isUploading: true,
//         createdAt: new Date().toISOString(),
//       };

//       setMessages((prev) => [...prev, tempMsg]);

//       const handleUploadSuccess = (data) => {
//         if (data.fileName === compressed.name && data.roomId === selectedRoom._id) {
//           setMessages((prevMessages) =>
//             prevMessages.map((msg) =>
//               msg.tempId === tempId
//                 ? { 
//                     ...msg, 
//                     fileUrl: data.fileUrl,
//                     isUploading: false
//                   }
//                 : msg
//             )
//           );
//         }
//       };

//       const handleUploadError = () => {
//         setMessages((prevMessages) =>
//           prevMessages.map((msg) =>
//             msg.tempId === tempId
//               ? { 
//                   ...msg, 
//                   fileUrl: 'Upload failed!',
//                   isUploading: false
//                 }
//               : msg
//           )
//         );
//       };

//       socket.once(`upload-success-${tempId}`, handleUploadSuccess);
//       socket.once(`upload-error-${tempId}`, handleUploadError);

//       const reader = new FileReader();
//       reader.onload = async () => {
//         const arrayBuffer = reader.result;
//         const buffer = Array.from(new Uint8Array(arrayBuffer));

//         socket.emit('upload', {
//           buffer,
//           fileName: compressed.name,
//           roomId: selectedRoom._id,
//           senderId: user.user._id,
//           tempId,
//         });

//         setSelectedFile(null);
//       };
//       reader.readAsArrayBuffer(compressed);
//     } else if (newMessage.trim()) {
//       const localMessage = {
//         roomId: selectedRoom._id,
//         senderId: { 
//           _id: user.user._id, 
//           fullName: user.user.fullName, 
//           profileImage: user.user.profileImage || '' 
//         },
//         text: newMessage,
//         createdAt: new Date().toISOString(),
//         read: true,
//       };
//       socket.emit('send-group-message', localMessage);
//       setNewMessage('');
//       setShowEmoji(false);
//     }
//   };

//   // File input handler
//   const handleFileInputChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setSelectedFile(file);
//     e.target.value = null;
//   };

//   // Emoji selection handler
//   const handleEmojiSelect = (emojiObject) => {
//     setNewMessage(prev => prev + emojiObject.emoji);
//     inputRef.current.focus();
//   };

//   // Room selection handler
//   const handleRoomSelect = (room) => {
//     setSelectedRoom(room);
//     navigate(`/chat/${room._id}`);
//   };

//   // Fetch room members
//   const fetchRoomMembers = async () => {
//     try {
//       const res = await axios.get(
//         `/message/all-members/${roomId}`,
//         { withCredentials: true }
//       );
//       setMembers(res.data?.data || []);
//     } catch (error) {
//       console.error("Error fetching members:", error);
//     }
//   };

//   // Toggle group permission
//   const handleTogglePermission = async () => {
//     const newPermission = selectedRoom.permission === 'public' ? 'private' : 'public';
//     try {
//       await axios.post(
//         '/message/change-permission',
//         { 
//           roomId, 
//           permission: newPermission,
//           adminId: user.user._id
//         },
//         { withCredentials: true }
//       );
      
//       setSelectedRoom(prev => ({
//         ...prev,
//         permission: newPermission
//       }));
      
//       setRooms(prev => prev.map(room => 
//         room._id === roomId ? { ...room, permission: newPermission } : room
//       ));
//     } catch (error) {
//       console.error("Error changing permission:", error);
//     }
//   };

//   // Change member role
//   const handleChangeRole = async (memberId, newRole) => {
//     try {
//       const response = await axios.post(
//         '/message/change-role',
//         { 
//           roomId, 
//           memberId,
//           newRole,
//           adminId: user?.user?._id
//         },
//         { withCredentials: true }
//       );

//       if(response.data.success){
//         toast.success("Updated Role");
//         setMembers(prev => prev.map(member => 
//         member.user === memberId ? { ...member, role: newRole } : member
//       ));
//       }else{
//         toast.error(response.data.message)
//       }
//     } catch (error) {
//       console.error("Error changing role:", error);
//     }
//   };

//   // Remove member from room
//   const handleRemoveMember = async (memberId) => {
//     try {
//       await axios.post(
//         '/message/remove-member',
//         { 
//           roomId, 
//           memberId,
//           adminId: user.user._id
//         },
//         { withCredentials: true }
//       );
      
//       setMembers(prev => prev.filter(member => member._id !== memberId));
//     } catch (error) {
//       console.error("Error removing member:", error);
//     }
//   };

//   const handleLeaveCommunity = async () => {
//   const confirmLeave = window.confirm("Are you sure you want to leave this community?");
//   if (!confirmLeave) return;

//   try {
//     const res = await axios.post(
//       '/message/left-community',
//       {
//         roomId: selectedRoom._id,
//         userId: user.user._id,
//       },
//       { withCredentials: true }
//     );

//     if (res.data.success) {
//       toast.success("You have left the community.");
//       navigate('/chat');
//     } else {
//       toast.error(res.data.message || "Failed to leave community.");
//     }
//   } catch (error) {
//     console.error("Error leaving community:", error);
//     toast.error("Server error. Try again later.");
//   }
// };


//   // Render admin controls dropdown
//   const renderAdminDropdown = () => (
//     <div className="relative" ref={dropdownRef}>
//       <button 
//         onClick={() => {
//           if (isAdmin) {
//             fetchRoomMembers();
//             setShowMembers(!showMembers);
//           }
//         }}
//         className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
//       >
//         <MoreVertical size={20} />
//       </button>
      
//       {showMembers && (
//         <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
//             <h3 className="font-semibold">Group Settings</h3>
//             <p className="text-xs opacity-80 mt-1">
//               {selectedRoom.skillId?.title || `Room ${selectedRoom._id.slice(-5)}`}
//             </p>
//           </div>
          
//           <div className="p-0">
//             {/* Group permission toggle */}
//             <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-full bg-blue-100 text-blue-600">
//                   {selectedRoom.permission === 'public' ? 
//                     <Unlock size={16} /> : <Lock size={16} />
//                   }
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-800">Group Privacy</h4>
//                   <p className="text-xs text-gray-500">
//                     {selectedRoom.permission === 'public' ? 
//                       'Anyone can chat' : 'Private group'
//                     }
//                   </p>
//                 </div>
//               </div>
              
//               <button 
//                 onClick={handleTogglePermission}
//                 className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
//                   selectedRoom.permission === 'public' 
//                     ? 'bg-blue-500' : 'bg-gray-300'
//                 }`}
//               >
//                 <span className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
//                   selectedRoom.permission === 'public' 
//                     ? 'translate-x-6' : 'translate-x-0'
//                 }`} />
//               </button>
//             </div>
            
//             {/* Group members section */}
//             <div className="max-h-60 px-4 py-3 border-b border-gray-100 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100">
//               <div className="flex justify-between items-center mb-2">
//                 <h4 className="font-medium text-gray-800">Group Members</h4>
//                 <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
//                   {members.length} members
//                 </span>
//               </div>
              
//               <div className="max-h-60 overflow-y-auto">
//                 {members.map(member => (
//                   <div key={member._id} className="flex items-center justify-between py-2">
//                     <div className="flex items-center gap-3">
//                       {member?.user?.profileImage ? (
//                         <img 
//                           src={member?.user?.profileImage} 
//                           alt={member?.user?.fullName} 
//                           className="h-10 w-10 rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                           <span className="text-blue-700 font-medium">
//                             {getInitials(member?.user?.fullName)}
//                           </span>
//                         </div>
//                       )}
//                       <div>
//                         <span className="text-sm font-medium block">
//                           {member?.user?.fullName || member.fullName}
//                         </span>
//                         <span className="text-xs text-gray-500">
//                           {member.role === 'admin' 
//                             ? 'Admin' 
//                             : member.role === 'moderate' 
//                               ? 'Moderator' 
//                               : 'Member'
//                           }
//                         </span>
//                       </div>
//                     </div>
                    
//                     {isAdmin && (
//                       <div className="flex gap-1">
//                         {member.role !== 'admin' && (
//                           <>
//                             {member.role === 'moderate' ? (
//                               <button 
//                                 onClick={() => handleChangeRole(member.user, 'user')}
//                                 className="text-xs px-2 py-1 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100"
//                               >
//                                 User
//                               </button>
//                             ) : (
//                               <button 
//                                 onClick={() => handleChangeRole(member.user, 'moderate')}
//                                 className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100"
//                               >
//                                 Mod
//                               </button>
//                             )}
                            
//                             <button 
//                               onClick={() => handleRemoveMember(member.user)}
//                               className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
//                             >
//                               Remove
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Check if regular user in private room
//   const isRegularUserInPrivateRoom = 
//     selectedRoom?.permission === 'private' && 
//     !isAdmin;

//   // Render message component
//   const renderMessage = (msg, index) => {
//     const isOwn = msg.senderId === user.user._id || msg.senderId?._id === user.user._id;
//     const initials = getInitials(msg.senderId?.fullName);
//     const file = msg.fileName || msg.fileUrl?.split('/')?.pop();
//     const fileName = file?.split('-').pop();
//     const isFile = msg.fileUrl && msg.fileUrl !== '';
//     const isImage = isFile && msg.fileUrl.startsWith('http') &&
//       (msg.fileUrl.endsWith('.jpg') || msg.fileUrl.endsWith('.jpeg') || 
//        msg.fileUrl.endsWith('.png') || msg.fileUrl.endsWith('.gif'));

//     const prevMsg = messages[index - 1];
//     const prevSenderId = prevMsg?.senderId?._id || prevMsg?.senderId;
//     const currentSenderId = msg.senderId?._id || msg.senderId;
//     const isConsecutive = prevMsg && 
//                           prevSenderId === currentSenderId && 
//                           (new Date(msg.createdAt) - new Date(prevMsg.createdAt) < 300000);

//     return (
//       <motion.div
//         key={index}
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className={`flex gap-2 items-end ${isOwn ? 'ml-auto justify-end' : ''} ${isConsecutive ? 'mt-1' : 'mt-4'}`}
//         style={{ maxWidth: '85%' }}
//       >
//         {!isOwn && !isConsecutive && (
//           <div className="flex-shrink-0">
//             {msg.senderId?.profileImage ? (
//               <img 
//                 src={msg.senderId.profileImage} 
//                 alt="avatar" 
//                 className="h-8 w-8 rounded-full object-cover border" 
//               />
//             ) : (
//               <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">
//                 {initials}
//               </div>
//             )}
//           </div>
//         )}
//         {!isOwn && isConsecutive && <div className="w-8" />}
        
//         <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
//           {!isConsecutive && !isOwn && (
//             <span className="text-xs font-medium text-gray-600 mb-1 ml-1">
//               {msg.senderId?.fullName || 'Unknown'}
//             </span>
//           )}
          
//           <div className={`px-4 py-2 rounded-2xl shadow-sm ${isOwn ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
//             {isFile ? (
//               <div className={`flex flex-col gap-2 ${isImage ? '' : 'bg-white text-blue-700 p-2 rounded-md'}`}>
//                 {isImage ? (
//                   <div className="max-w-xs">
//                     {msg.fileUrl === 'Uploading...' ? (
//                       <div className="bg-gray-200 border-2 border-dashed rounded-xl w-48 h-32 flex items-center justify-center">
//                         <Loader2 className="animate-spin text-blue-600" size={24} />
//                       </div>
//                     ) : (
//                       <img
//                         src={msg.fileUrl}
//                         alt="Preview"
//                         className="rounded-lg max-h-64 cursor-pointer hover:opacity-90 transition-opacity"
//                         onClick={() => window.open(msg.fileUrl, '_blank')}
//                       />
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                       <div className="bg-gray-100 p-2 rounded-lg">
//                         <Paperclip size={18} className="text-gray-500" />
//                       </div>
//                       <div>
//                         <p className="truncate max-w-[150px] text-sm font-medium">{fileName}</p>
//                       </div>
//                     </div>
//                     {msg.fileUrl === 'Uploading...' ? (
//                       <Loader2 className="animate-spin text-blue-600" size={16} />
//                     ) : (
//                       <button onClick={() => handleDownloadFile(msg.fileUrl, fileName)} className="text-blue-600 hover:text-blue-800 transition-colors">
//                         <Download size={16} />
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <p className="text-sm">{msg.text}</p>
//             )}
//           </div>
          
//           <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
//             <span className="text-[10px] text-gray-500">{moment(msg.createdAt).format('hh:mm A')}</span>
//             {isOwn && msg.read && <Check size={12} className="text-blue-500" />}
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   return (
//     <div className="mb-7 flex flex-col md:flex-row h-[90vh] md:h-[85vh] max-w-5xl mx-auto mt-4 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-lg">
//       {/* Chat List - shown on desktop always, on mobile only when no room selected */}
//       <div className={`md:w-1/3 lg:w-1/4 ${isMobile && roomId ? 'hidden' : 'block'}`}>
//         <ChatListComp rooms={rooms} onSelectRoom={handleRoomSelect} />
//       </div>
      
//       {/* Chat Room - shown on desktop always, on mobile only when room selected */}
//       <div className={`flex-1 flex flex-col ${!roomId && isMobile ? 'hidden' : 'flex sticky top-16'}`}>
//         {selectedRoom ? (
//           <>
//             {/* Chat Header */}
//             <div className="border-b border-gray-200 p-4 flex items-center sticky top-0 md:relative gap-3">
//               {/* Always show back button on mobile */}
//               <button 
//                 onClick={() => navigate('/chat')} 
//                 className="md:hidden"
//               >
//                 <ArrowLeft size={20} />
//               </button>
              
//               <div className="flex-shrink-0">
//                 {selectedRoom.skillId?.imagesUrl?.[0] ? (
//                   <img 
//                     src={selectedRoom.skillId.imagesUrl[0]} 
//                     alt="Skill" 
//                     className="h-10 w-10 rounded-lg object-cover" 
//                   />
//                 ) : (
//                   <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
//                     <span className="text-white font-bold text-xs">
//                       {selectedRoom.skillId?.title?.substring(0, 2).toUpperCase() || 'SK'}
//                     </span>
//                   </div>
//                 )}
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <h2 className="font-semibold text-gray-800 truncate">
//                   {selectedRoom.skillId?.title || `Room ${selectedRoom._id.slice(-5)}`}
//                 </h2>
//                 <p className="text-xs text-gray-500">Online</p>
//               </div>
//               {/* Leave Community Option for Everyone */}
//     {!isAdmin && (
//         <div className="p-4 border-t border-gray-100">
//           <button
//             onClick={() => handleLeaveCommunity()}
//             className="text-red-600 text-sm font-medium hover:underline"
//           >
//             Leave Community
//           </button>
//         </div>
//       )
//     }



//               {/* Three-dot button for admin controls */}
//               {isAdmin && renderAdminDropdown()}
//             </div>
            
//             {/* Messages Container */}
//            <div 
//   ref={messagesContainerRef}
//   className="flex-1 overflow-y-auto p-4 bg-gray-50 max-h-[calc(100vh-10rem)]"
// >
//   <div className="space-y-4">
//     {messages.map((msg, index) => renderMessage(msg, index))}
//     <div ref={messagesEndRef} />
//   </div>
// </div>

            
//             {/* Message Input */}
//             <div className="border-t border-gray-200 p-3 bg-white">
//               {isRegularUserInPrivateRoom && (
//                 <div className="text-center text-xs text-gray-500 mb-2">
//                   Only admins and moderators can send messages in private groups
//                 </div>
//               )}
              
//               {selectedFile && (
//                 <FilePreview 
//                   file={selectedFile} 
//                   onRemove={() => setSelectedFile(null)} 
//                 />
//               )}
              
//               <div className="flex items-center gap-2">
//                 <button 
//                   onClick={() => setShowEmoji(!showEmoji)}
//                   disabled={isRegularUserInPrivateRoom}
//                   className={`p-2 ${isRegularUserInPrivateRoom ? 'text-gray-300' : 'text-gray-500 hover:text-blue-500 transition-colors'}`}
//                 >
//                   <Smile size={20} />
//                 </button>
                
//                 <label className={`p-2 ${isRegularUserInPrivateRoom ? 'text-gray-300' : 'text-gray-500 hover:text-blue-500 transition-colors cursor-pointer'}`}>
//                   <Paperclip size={20} />
//                   <input 
//                     type="file" 
//                     className="hidden" 
//                     onChange={handleFileInputChange}
//                     disabled={isRegularUserInPrivateRoom}
//                   />
//                 </label>
                
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && !isRegularUserInPrivateRoom && handleSend()}
//                   placeholder={isRegularUserInPrivateRoom ? "Private group - only admins/mods can chat" : "Type a message..."}
//                   className="flex-1 py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
//                   disabled={isRegularUserInPrivateRoom}
//                 />
                
//                 <button
//                   onClick={handleSend}
//                   disabled={isRegularUserInPrivateRoom || (!newMessage.trim() && !selectedFile)}
//                   className={`p-2 rounded-full ${
//                     isRegularUserInPrivateRoom || (!newMessage.trim() && !selectedFile)
//                       ? 'bg-gray-200 text-gray-400'
//                       : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
//                   }`}
//                 >
//                   <Send size={20} />
//                 </button>
//               </div>
              
//               {showEmoji && (
//                 <div className="emoji-picker absolute bottom-16 left-4 md:left-auto md:right-4">
//                   <Picker onEmojiClick={handleEmojiSelect} />
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           // Placeholder when no room selected (desktop only)
//           <div className="flex-1 flex items-center justify-center bg-gray-50">
//             <div className="text-center p-8 max-w-md">
//               <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
//                 <Send className="text-gray-400" size={24} />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">No Conversation Selected</h3>
//               <p className="text-gray-500 mb-6">
//                 Select a conversation from the list to start messaging
//               </p>
//               {isMobile && (
//                 <button
//                   onClick={() => navigate('/chat')}
//                   className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium"
//                 >
//                   Back to Conversations
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatRoomComp;




//////////////////////          NEW  GPT    CODE         /////////////////////
// src/pages/chat/ChatRoomPage.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Smile, Send, ArrowLeft, Paperclip, Download, Check, Loader2, MoreVertical, Lock, Unlock } from 'lucide-react';
import Picker from 'emoji-picker-react';
import moment from 'moment';
import { AuthContext } from '../../../context/authContext.jsx';
//import { socket } from '../../../socket.js'; // <-- use shared socket
import toast from 'react-hot-toast';

// Components & Utils
import { ChatListComp } from './chatListComp.jsx';
import { compressFile, FilePreview, getInitials, handleDownloadFile } from './chatUtils.jsx';

const ChatRoomComp = () => {
  const { user } = useContext(AuthContext);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Responsive layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch rooms
  useEffect(() => {
    if (!user?.user?._id) return;

    const fetchRooms = async () => {
      try {
        const res = await axios.get(`/message/get-room/${user.user._id}`, { withCredentials: true });
        const roomsData = res.data?.data || [];
        setRooms(roomsData);

        if (roomId) {
          const room = roomsData.find(r => r._id === roomId);
          if (room) setSelectedRoom(room);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };

    fetchRooms();
  }, [user, roomId]);

  // Check admin/moderator
  useEffect(() => {
    if (selectedRoom && user?.user?._id) {
      const currentMember = selectedRoom.members.find(
        m => m.user === user.user._id || m.user?._id === user.user._id
      );
      setIsAdmin(currentMember && (currentMember.role === 'admin' || currentMember.role === 'moderate'));
    }
  }, [selectedRoom, user]);

  // Socket: register user, join room, receive messages
  useEffect(() => {
    if (!roomId || !user?.user?._id) return;

    socket.emit("register-user", user.user._id);
    socket.emit("join-room", roomId);

    const fetchMessages = async () => {
      try {
        const res = await axios.post('/message/reterive-chats', { roomId, limit: 50 }, { withCredentials: true });
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();

    const handleReceiveMessage = (message) => {
      if (typeof message.senderId === 'string') {
        message.senderId = {
          _id: message.senderId,
          fullName: message.senderId === user.user._id ? user.user.fullName : 'Unknown',
          profileImage: ''
        };
      }
      setMessages(prev => [...prev, message]);
    };

    socket.on('receive-group-message', handleReceiveMessage);

    return () => {
      socket.off('receive-group-message', handleReceiveMessage);
    };
  }, [roomId, user]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Emoji outside click
  useEffect(() => {
    if (!showEmoji) return;
    const handleClickOutside = e => {
      if (!e.target.closest('.emoji-picker') && !e.target.closest('.emoji-button')) setShowEmoji(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmoji]);

  // Dropdown outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowMembers(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    // File upload
    if (selectedFile && selectedRoom?._id) {
      const compressed = await compressFile(selectedFile);
      const tempId = Date.now();
      const tempMsg = {
        tempId,
        roomId: selectedRoom._id,
        senderId: { _id: user.user._id, fullName: user.user.fullName, profileImage: user.user.profileImage || '' },
        text: '',
        fileName: compressed.name,
        fileUrl: 'Uploading...',
        isFile: true,
        isUploading: true,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);

      const reader = new FileReader();
      reader.onload = () => {
        const buffer = Array.from(new Uint8Array(reader.result));
        socket.emit('upload', { buffer, fileName: compressed.name, roomId: selectedRoom._id, senderId: user.user._id, tempId });
        setSelectedFile(null);
      };
      reader.readAsArrayBuffer(compressed);

      socket.once(`upload-success-${tempId}`, data => {
        setMessages(prev =>
          prev.map(msg => (msg.tempId === tempId ? { ...msg, fileUrl: data.fileUrl, isUploading: false } : msg))
        );
      });

      socket.once(`upload-error-${tempId}`, () => {
        setMessages(prev =>
          prev.map(msg => (msg.tempId === tempId ? { ...msg, fileUrl: 'Upload failed!', isUploading: false } : msg))
        );
      });

    } else if (newMessage.trim()) {
      const localMessage = {
        roomId: selectedRoom._id,
        senderId: { _id: user.user._id, fullName: user.user.fullName, profileImage: user.user.profileImage || '' },
        text: newMessage,
        createdAt: new Date().toISOString(),
        read: true
      };
      socket.emit('send-group-message', localMessage);
      setNewMessage('');
      setShowEmoji(false);
    }
  };

  // File input
  const handleFileInputChange = e => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
    e.target.value = null;
  };

  // Emoji select
  const handleEmojiSelect = emoji => {
    setNewMessage(prev => prev + emoji.emoji);
    inputRef.current.focus();
  };

  // Select room
  const handleRoomSelect = room => {
    setSelectedRoom(room);
    navigate(`/chat/${room._id}`);
  };

  // Fetch room members
  const fetchRoomMembers = async () => {
    try {
      const res = await axios.get(`/message/all-members/${roomId}`, { withCredentials: true });
      setMembers(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle group permission
  const handleTogglePermission = async () => {
    const newPermission = selectedRoom.permission === 'public' ? 'private' : 'public';
    try {
      await axios.post('/message/change-permission', { roomId, permission: newPermission, adminId: user.user._id }, { withCredentials: true });
      setSelectedRoom(prev => ({ ...prev, permission: newPermission }));
      setRooms(prev => prev.map(r => (r._id === roomId ? { ...r, permission: newPermission } : r)));
    } catch (err) { console.error(err); }
  };

  // Change member role
  const handleChangeRole = async (memberId, newRole) => {
    try {
      const res = await axios.post('/message/change-role', { roomId, memberId, newRole, adminId: user.user._id }, { withCredentials: true });
      if (res.data.success) {
        toast.success("Updated Role");
        setMembers(prev => prev.map(m => (m.user === memberId ? { ...m, role: newRole } : m)));
      } else toast.error(res.data.message);
    } catch (err) { console.error(err); }
  };

  // Remove member
  const handleRemoveMember = async memberId => {
    try {
      await axios.post('/message/remove-member', { roomId, memberId, adminId: user.user._id }, { withCredentials: true });
      setMembers(prev => prev.filter(m => m._id !== memberId));
    } catch (err) { console.error(err); }
  };

  // Leave community
  const handleLeaveCommunity = async () => {
    const confirmLeave = window.confirm("Are you sure you want to leave this community?");
    if (!confirmLeave) return;

    try {
      const res = await axios.post('/message/left-community', { roomId: selectedRoom._id, userId: user.user._id }, { withCredentials: true });
      if (res.data.success) {
        toast.success("You have left the community.");
        navigate('/chat');
      } else toast.error(res.data.message || "Failed to leave community.");
    } catch (err) { console.error(err); toast.error("Server error. Try again later."); }
  };

  // Render admin dropdown & messages (same as original) ...
  // ... rest of JSX remains same
  // Make sure everywhere socket emits/listens use the imported `socket`

  return (
    <div className="mb-7 flex flex-col md:flex-row h-[90vh] md:h-[85vh] max-w-5xl mx-auto mt-4 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-lg">
      {/* ...ChatListComp & message UI as before */}
    </div>
  );
};

export default ChatRoomComp;
