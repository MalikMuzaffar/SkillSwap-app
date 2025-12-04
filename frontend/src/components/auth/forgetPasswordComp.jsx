import React, { useState } from 'react';

const ForgetPasswordComp = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      alert('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/users/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message || 'Password reset link sent to your email.');
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex justify-center items-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Forgot Password?</h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your email and we'll send you reset instructions
        </p>
        <form onSubmit={handleForgetPassword} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-lg text-lg transition ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
            }`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPasswordComp;
