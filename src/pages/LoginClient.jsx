// src/pages/LoginClient.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/accounts/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Save access and refresh tokens
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);

        console.log('✅ Login successful');
        navigate('/chat-ai'); // ✅ Redirect to chat
      } else {
        const errorData = await response.json();
        console.error('❌ Login failed:', errorData);
        alert('❌ Invalid credentials');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      alert('❌ Login error. Check console.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Client Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginClient;
