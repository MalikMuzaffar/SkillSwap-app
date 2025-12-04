import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext'; // import your context
import axios from 'axios';

const LoginComp = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext); // destructure setUser from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill all fields.');
      return;
    }

    setLoading(true);
    try {
const response = await axios.post(
  '/users/login',
  { email, password },
  {
    withCredentials: true, // ✅ for sending cookies
    headers: {
      'Content-Type': 'application/json'
    }
  }
);


      const data = await response.data;
      
      if (data.success) {
        updateUser({user:data.data.user,accessToken:data.data.accessToken}); 
        alert('Login successful!');
        // store user in context 🚀
        if(data.data.user.role == 'admin'){
           navigate('/admin/dashboard'); 
        }else{
        navigate('/dashboard');
        } 
      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition duration-300 hover:scale-105">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-3">
          Sign in
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email and password to sign in
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
       
            <button
              type="button"
              className="text-indigo-500 hover:underline"
              onClick={() => navigate('/forget-password')}
            >
              Forget password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-200 text-lg ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            className="text-indigo-500 hover:underline font-medium"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginComp;
