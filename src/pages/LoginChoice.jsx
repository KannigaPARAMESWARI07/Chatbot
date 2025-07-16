// src/pages/LoginChoice.jsx
import { Link } from 'react-router-dom';

function LoginChoice() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Welcome to Chatbot</h2>
      <p>Please choose your login type:</p>
      <Link to="/admin-login"><button>Admin Login</button></Link>
      <br /><br />
      <Link to="/client-login"><button>Client Login</button></Link>
    </div>
  );
}

export default LoginChoice;
