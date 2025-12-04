import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPasswordComp = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, id, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Password reset successful!');
        navigate('/signin');
      } else {
        alert(data.data.message || 'Reset failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Reset Your Password
        </h2>
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 text-white font-semibold rounded-lg text-lg transition ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordComp;
