import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit } from 'lucide-react';
import axios from 'axios';
import LoaderComp from '../loader';
import toast from 'react-hot-toast';
import { sendNotification } from '../utility/notification';
const DashboardComp = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeCommunity, setActiveCommunity] = useState(0);
  const [createdCommunity, setCreatedCommunity] = useState(0);
  const [joinedCommunity, setJoinedCommunity] = useState(0);
  const [pendingRequest, setPendingRequest] = useState(0);
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [skills, setSkills] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [tab, setTab] = useState('Skill');
  const [loading, setLoading] = useState(true);
  const [skillRequests, setSkillRequests] = useState([]);

  useEffect(() => {
    if (!user) return navigate('/signin');

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          profileRes,
          communityRes,
          connectionRes,
          skillsRes,
          myRequestRes,
          skillReqRes,
        ] = await Promise.all([
          axios.get('/users/get-user', { withCredentials: true }),
          axios.get(`/skill/join-skill/${user?.user?._id}`, { withCredentials: true }),
          axios.get('/connection/all-request', { withCredentials: true }),
          axios.get(`/skill/skill-request/${user?.user?._id}`, { withCredentials: true }),
          axios.get(`/connection/my-requests`, { withCredentials: true }),
          axios.get(`/skill/skill-request/${user?.user?._id}`, { withCredentials: true }),
        ]);

        if (profileRes.data.success) setUserProfile(profileRes.data.data);

        if (communityRes.data.success) {
          const { createdSkills = 0, joineSkills = 0 } = communityRes.data.data;
          setCreatedCommunity(createdSkills);
          setJoinedCommunity(joineSkills);
          setActiveCommunity(createdSkills + joineSkills);
        }

        if (connectionRes.data.success) {
          setRequests(connectionRes.data.data);
          const pending = connectionRes.data.data.filter((r) => r.status === 'pending').length;
          setPendingRequest(pending);
        }

        if (skillsRes.data.success) {
          const data = skillsRes.data.data;
          setSkillRequests(data); // includes all unverified and verified
        }

        if (myRequestRes.data.success) {
          setMyRequests(myRequestRes.data.data);
        }

        const verifiedSkills = skillsRes.data.data.filter((s) => s.isVerify === true);
        setSkills(verifiedSkills);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleStatusChange = async (id, status,requesterId,skill) => {
    try {
      const userId=requesterId._id;
      const statusResponse = await axios.patch(`/connection/update-status/${id}`, { status }, {
        withCredentials: true,
      });
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
      sendNotification(requesterId,'CONNECTION_REQUEST',status,`${status} by ${message.title}`);
      if(statusResponse.data.success){
       return toast.success(statusResponse.data.message)
      }else{
        return toast.error(statusResponse.data.message)
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDetail = (skillId)=>{
    navigate(`/skill/${skillId}`,{state:"connectionRequest"})
  }


  if (loading) return <LoaderComp />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-b-xl text-white shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={userProfile?.profileImage || `https://ui-avatars.com/api/?name=${userProfile?.fullName}`}
              alt="profile"
              className="h-16 w-16 rounded-full border-2 border-white object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{userProfile?.fullName.toUpperCase()}</h2>
               <h4 className="text-lg font-light">{userProfile?.designation}</h4>
              <p className="text-sm text-white/90">{userProfile?.email}</p>
              {userProfile?.bio && <p className="text-sm italic text-white/80 mt-1">{userProfile.bio.length>150 ? userProfile?.bio.slice(0,150)+'...':userProfile?.bio}</p>}
              <div className="flex flex-wrap gap-1 mt-2">
                {userProfile?.skillTags?.map((tag, index) => (
                  <span key={index} className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 text-center py-6 px-4 gap-4">
        <StatBox label="Active" value={activeCommunity} color="text-blue-600" tooltip="Your total active communities" />
        <StatBox label="Created" value={createdCommunity} color="text-green-600" tooltip="Communities you created" />
        <StatBox label="Joined" value={joinedCommunity} color="text-yellow-600" tooltip="Communities you joined" />
        <StatBox label="Pending" value={pendingRequest + skillRequests.filter((s) => !s.isVerify).length} color="text-purple-600" tooltip="Pending requests + skill approvals" />
        <StatBox label="my Requests" value={skills?.filter(s=>s.isVerify==false).length+myRequests.length} color="text-red-600" tooltip="All connection requests" />
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-t border-b bg-white text-sm  md:font-medium text-gray-700">
        {['Skill', 'All Connection', 'My Connention Request', 'My Skill Approval'].map((item) => (
          <div
            key={item}
            onClick={() => setTab(item)}
            className={`px-3 md:px-6 py-3 cursor-pointer transition duration-200 ease-in-out ${tab === item ? 'border-b-2 border-blue-600 text-blue-600' : 'hover:text-blue-600'}`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 max-h-[65vh] overflow-y-auto">
        {tab === 'Skill' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">🧠 My Skills</h3>
              <button
                onClick={() => navigate('/add-skill')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <PlusCircle size={18} className="mr-2" /> Add Skill
              </button>
            </div>
            {skills.length === 0 ? (
              <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500">
                You have not added any skills yet.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <div key={skill._id} className="bg-white p-4 rounded-xl shadow hover:shadow-md">
                    <img
                      src={skill?.imagesUrl?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
                      alt={skill?.title}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <h4 className="text-lg font-semibold text-gray-800">{skill?.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{skill?.description.slice(0,25)+'...'}</p>
                    <p className="text-xs mt-2 text-gray-500">
                      Mode: {skill?.mode} • Location: {skill?.location} • Level: {skill?.experienceLevel}
                    </p>
                     <button
                  className="w-full bg-indigo-600 text-white py-2 rounded-xl transition-all cursor-pointer duration-300 hover:bg-indigo-700 hover:scale-105"
                  onClick={() => handleDetail(skill._id)}
                >
                  Detail
                </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'All Connection' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">🔗 All Requests</h3>
            {requests.length === 0 ? (
              <div className="text-gray-500">No connection requests found.</div>
            ) : (
              requests.map((req) => (
                <div key={req._id} className="flex items-start justify-between p-4 border rounded-xl shadow bg-white">
                  <div className="flex gap-4">
                    <img
                      src={req.requesterId.profileImage || `https://ui-avatars.com/api/?name=${req.requesterId.fullName}`}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {req.requesterId.fullName}{' '}
                        <span className="text-sm text-gray-500">({req.requesterId.email})</span>
                      </p>
                      <p className="text-sm mt-1">requested <span className="italic">{req.skillId?.title}</span></p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        req.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(req._id, 'accepted',req.requesterId,req.skillId)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(req._id, 'rejected',req.requesterId,req.skillId)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'My Connention Request' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">📤 My Requests</h3>
            {myRequests.length === 0 ? (
              <div className="text-gray-500">You haven’t sent any requests yet.</div>
            ) : (
              myRequests.map((req) => (
           <div key={req._id} className="flex items-start justify-between p-4 border rounded-xl shadow bg-white">
                  <div className="flex gap-4">
                    <img
                      src={req.skillId?.imagesUrl || `https://ui-avatars.com/api/?name=${req.skillId?.title}`}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {req.skillId?.title}{' '}
                        <span className="text-sm text-gray-500">({req.skillId?.description.slice(0,25)+'...'})</span>
                      </p>
                      <p className="text-sm mt-1">provider <span className="italic">{req.providerId?.fullName}</span></p>
                      <span className='inline-block mt-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800'>
                         PENDING
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                  <button
                  className="w-full p-3 bg-indigo-600 text-white py-2 rounded-xl transition-all cursor-pointer duration-300 hover:bg-indigo-700 hover:scale-105"
                  onClick={() => handleDetail(req.skillId._id)}
                >
                  Detail
                </button>
          
                    </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'My Skill Approval' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">🛠️ My Skill Approval Requests</h3>
            {skillRequests.filter((s) => !s.isVerify).length === 0 ? (
              <div className="text-gray-500">No pending skill approval requests.</div>
            ) : (
              skillRequests.filter((s) => !s.isVerify).map((skill) => (
                <div
                  key={skill._id}
                  className="flex flex-col md:flex-row gap-4 p-5 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition"
                >
                  <img
                    src={skill.imagesUrl?.[0] || 'https://via.placeholder.com/150?text=No+Image'}
                    alt={skill.title}
                    className="w-full md:w-48 h-40 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-800">{skill.title}</h4>
                    <p className="text-sm text-gray-600">{skill.description}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      <p><strong>Mode:</strong> {skill.mode}</p>
                      <p><strong>Level:</strong> {skill.level}</p>
                      <p><strong>Location:</strong> {skill.location}</p>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                        PENDING APPROVAL
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const StatBox = ({ label, value, color, tooltip }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition group relative">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-sm text-gray-600 mt-1">{label}</div>
    {tooltip && (
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 text-xs bg-gray-800 text-white rounded shadow opacity-0 group-hover:opacity-100 transition-all duration-200">
        {tooltip}
      </div>
    )}
  </div>
);

export default DashboardComp;
