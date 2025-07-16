import { useState } from 'react';
import axios from 'axios';

function LoginAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: "kanni" ,  // ✅ clean input
        password: "kanniga123",
      });

      // ✅ Save token
      localStorage.setItem('token', response.data.access);

      alert('Login successful!');
      // TODO: Navigate to admin dashboard if needed
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);

      // Show exact backend error to help you debug
      if (error.response?.status === 401) {
        alert('❌ Incorrect username or password.');
      } else {
        alert('⚠️ Login error: ' + (error.response?.data?.detail || error.message));
      }
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginAdmin;
