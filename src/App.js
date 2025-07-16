// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginChoice from './pages/LoginChoice';
import LoginAdmin from './pages/LoginAdmin';
import LoginClient from './pages/LoginClient';
import RegisterClient from './pages/RegisterClient';
import ChatWithAI from './pages/ChatWithAI';
import ChatWithClient from './pages/ChatWithClient';
import ProtectedRoute from './components/ProtectedRoute';
import { getUserInfo } from './services/auth';

function App() {
  const user = getUserInfo();

  return (
    <Router>
      <Routes>
        {/* Home page showing login choice */}
        <Route path="/" element={<LoginChoice />} />

        {/* Auth pages */}
        <Route path="/admin-login" element={<LoginAdmin />} />
        <Route path="/client-login" element={<LoginClient />} />
        <Route path="/client-register" element={<RegisterClient />} />

        {/* Client AI Chat (only logged in users can access) */}
        <Route path="/chat-ai" element={
          <ProtectedRoute>
            <ChatWithAI />
          </ProtectedRoute>
        } />

        {/* Admin Chat (only admin role can access) */}
        <Route path="/admin-chat" element={
          user?.role === 'admin' ? (
            <ProtectedRoute>
              <ChatWithClient />
            </ProtectedRoute>
          ) : (
            <Navigate to="/" />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
