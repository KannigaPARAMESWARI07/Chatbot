import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { jwtDecode } from 'jwt-decode'; // ✅ Named import

function ChatWithAI() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [userId, setUserId] = useState(null);

  // ✅ Get and decode access token to extract user ID
  // useEffect(() => {
  //   const token = localStorage.getItem('access');
  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token);
  //       setUserId(decoded.user_id || decoded.id); // Use your claim name
  //       console.log('🔑 Logged-in user ID:', decoded.user_id || decoded.id);
  //     } catch (err) {
  //       console.error('⛔ Failed to decode token:', err);
  //     }
  //   } else {
  //     console.error('⛔ No access token found. Please login.');
  //   }
  // }, []);

const token = localStorage.getItem('token');
const decoded = jwtDecode(token);
console.log(decoded.role); // should log 'admin' or 'client'


  // ✅ Fetch chat history after user ID is known
  useEffect(() => {
    if (userId) {
      fetchHistory();
    }
  }, [userId]);

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/chat/history/${userId}/`);
      setHistory(res.data);
    } catch (error) {
      console.error('❌ Error fetching history:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    console.log('📤 Sending this message to backend:', message);
    try {
      const res = await API.post('/chat/gemini/', { message });
      const aiReply = res.data.reply;

      setHistory((prev) => [
        ...prev,
        { sender: 'You', text: message },
        { sender: 'Gemini', text: aiReply },
      ]);
      setMessage('');
    } catch (error) {
      console.error('❌ Error sending message:', error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>💬 Chat with Gemini AI</h2>
      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '10px',
        marginBottom: '10px'
      }}>
        {history.map((msg, i) => (
          <p key={i}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, marginRight: '10px', padding: '8px' }}
        />
        <button onClick={sendMessage} style={{ padding: '8px 20px' }}>Send</button>
      </div>
    </div>
  );
}

export default ChatWithAI;
