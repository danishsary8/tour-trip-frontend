import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const verifyOtp = async ({ email, code }) => {
  const res = await axios.post(`${API_URL}/auth/verify-otp`, { email, code });
  return res.data;
};

export const resendOtp = async ({ email }) => {
  const res = await axios.post(`${API_URL}/auth/resend-otp`, { email });
  return res.data;
};