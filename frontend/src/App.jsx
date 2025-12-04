import { useState } from 'react'
import { Toaster } from 'react-hot-toast';
import './App.css'
import Header from './components/header.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import Register from './pages/Auth/register.jsx'
import VerifyOtp from './pages/Auth/verifyOtp.jsx'
import Login from './pages/Auth/login.jsx'
import ForgetPassword from './pages/Auth/forgetPassword.jsx'
import ResetPassword from './pages/Auth/resetPassword.jsx'
import ProtectedRoute from './components/protectedRoute.jsx'
import { Dashboard } from './pages/user/dashboard.jsx'
import { AddSkill } from './pages/user/addSkill.jsx'
import { Explore } from './pages/user/explore.jsx'
import { Notification } from './pages/user/notification.jsx'
import UpdateProfile from './pages/Auth/updateProfile.jsx'
import Chat from './pages/user/chatList.jsx'
import ChatRoom from './pages/user/chat.jsx'
import ChatList from './pages/user/chatList.jsx'
import './index.css'
import { Skill } from './pages/user/skill.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserSkill from './pages/admin/userSkill.jsx';
import ViewUserSkill from './pages/admin/viewUserSkill.jsx';
import RetriveChat from './pages/admin/retriveChat.jsx';
import Report from './pages/admin/report.jsx';
import SkillRequests from './pages/admin/skillRequests.jsx';
import { SystemFeedBack } from './pages/user/systemFeedBack.jsx';
import PrivacyPolicy from './pages/privacyPolicy.jsx';
import DeveloperPage from './pages/developer.jsx';
import NotFound from './pages/notFound.jsx';
import Category from './pages/admin/category.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='' element={<Home />} />
          <Route path='/signup' element={<Register/>}/>
          <Route path='/verify-otp' element={<VerifyOtp/>}/>
          <Route path='/signin' element={<Login/>}/>
          <Route path='/forget-password' element={<ForgetPassword/>}/>
          <Route path='/reset-password' element={<ResetPassword/>}/>

           <Route path='/edit-profile' element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>} />
          //user Routes//
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path='/add-skill' element={<ProtectedRoute><AddSkill/></ProtectedRoute>} />
          <Route path='/explore' element={<Explore/>} />
          <Route path='/skill/:skillId' element={<Skill/>} />
          <Route path='/notifications' element={<ProtectedRoute><Notification/></ProtectedRoute>} />
          <Route path='/chat' element={<ProtectedRoute><ChatRoom/></ProtectedRoute>} />
          <Route path='/chat/:roomId' element={<ProtectedRoute><ChatRoom/></ProtectedRoute>} />

          
          <Route path='/admin/dashboard' element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
          <Route path='/admin/user-skill/:userId' element={<ProtectedRoute><UserSkill/></ProtectedRoute>} />
          <Route path='/admin/skill/:skillId' element={<ProtectedRoute><ViewUserSkill/></ProtectedRoute>} />
          <Route path='/admin/chat/:skillId' element={<ProtectedRoute><RetriveChat/></ProtectedRoute>} />
          <Route path='/admin/report' element={<ProtectedRoute><Report/></ProtectedRoute>} />
          <Route path='/admin/skill-request' element={<ProtectedRoute><SkillRequests/></ProtectedRoute>} />
          <Route path='/admin/category' element={<ProtectedRoute><Category/></ProtectedRoute>} />

     {/* Footer */}
          <Route path='/feedback' element={<SystemFeedBack/>}/>
           <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
           <Route path='/developer' element={<DeveloperPage/>}/>

            <Route path="*" element={<NotFound/>} />

        </Routes>
          <Toaster position="top-center" reverseOrder={false} />
      </BrowserRouter>
    </>
  )
}

export default App
