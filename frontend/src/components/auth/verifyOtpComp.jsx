import React, { useState, useContext } from 'react';
import OtpInput from 'react-otp-input';
import { AuthContext} from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const VerifyOtpComp = () => {
  const { user,updateUser } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (otp) => setOtp(otp);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }

    if (!user || !user.email) {
      alert('User email not found. Please signup again.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
  '/users/verify',
  { email: user.email, OTP: otp },
  {
    withCredentials: true, // Axios equivalent of 'credentials: include'
    headers: {
      'Content-Type': 'application/json'
    }
  }
);
      
      const data = await response.json()
   
      if (data.success) {
        
        alert('OTP verified successfully!');
        updateUser({user:data.data.user,accessToken:data.data.accessToken})
        navigate('/explore')
      } else {
        alert(data.message || 'OTP verification failed.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!user || !user.email) {
      alert('User email not found. Please log in signup again');
      return;
    }

    setResendLoading(true);
    try {
      // Replace this with your resend OTP API call
      const response = await axios('/users/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();

      if (response.success) {
        alert('OTP resent successfully!');
      } else {
        alert(data.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      console.error('Error during OTP resend:', error);
      alert('An error occurred while resending OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md transform transition duration-300 hover:scale-105">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 mb-2">Enter OTP</h2>
        <p className="text-xs sm:text-sm text-gray-600 text-center mb-6">
          A 6-digit code has been sent to <strong>{user?.email || 'your email'}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex justify-center">
            <OtpInput
              value={otp}
              onChange={handleChange}
              numInputs={6}
              isInputNum
              shouldAutoFocus
              separator={<span className="mx-1 text-xl font-bold text-gray-500">-</span>}
              inputStyle={{
                width: '2rem',
                height: '2.5rem',
                fontSize: '1.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                textAlign: 'center',
                margin: '0 0.4rem',
              }}
              focusStyle={{
                border: '2px solid #6366f1',
                outline: 'none',
              }}
              renderInput={(props) => <input {...props} />}
            />
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-200 ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className={`w-full py-2 px-4 rounded-lg text-indigo-600 font-semibold border border-indigo-600 transition duration-200 ${
                resendLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-indigo-50'
              }`}
            >
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpComp;
