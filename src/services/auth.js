// src/services/auth.js
import { jwtDecode } from 'jwt-decode';

// ✅ Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// ✅ Decode JWT and return user info like { user_id, role, exp, ... }
export const getUserInfo = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    // Optional: Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn('⚠️ Token has expired');
      logout(); // Clear and redirect
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('❌ Invalid token:', error);
    return null;
  }
};

// ✅ Check if user is logged in
export const isAuthenticated = () => {
  return !!getUserInfo(); // More robust than just checking the token
};

// ✅ Logout the user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh'); // optional
  window.location.href = '/'; // redirect to login choice
};
