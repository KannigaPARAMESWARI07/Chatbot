import React, { useState } from 'react';
import axios from 'axios';

function RegisterClient() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    await axios.post('http://localhost:8000/api/accounts/register/', {
      ...form,
      role: 'client'
    });
    alert('Client Registered!');
  };

  return (
    <div>
      <h2>Client Register</h2>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterClient;
