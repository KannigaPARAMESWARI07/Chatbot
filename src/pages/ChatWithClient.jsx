import React, { useState, useEffect } from 'react';
import API from '../services/api';

function ChatWithClient() {
  const [clients, setClients] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const res = await API.get('/api/chat/admin/users/');
    setClients(res.data);
  };

  const loadChat = async (userId) => {
    setSelectedUser(userId);
    const res = await API.get(`/api/chat/admin/chat/${userId}/`);
    setHistory(res.data);
  };

  const sendMessage = async () => {
    await API.post('/api/chat/admin/send/', {
      to_user_id: selectedUser,
      text: message
    });
    setMessage('');
    loadChat(selectedUser);  // refresh
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '30%', borderRight: '1px solid gray' }}>
        <h3>Clients</h3>
        {clients.map(user => (
          <p key={user.id} onClick={() => loadChat(user.id)} style={{ cursor: 'pointer' }}>
            {user.username}
          </p>
        ))}
      </div>

      <div style={{ width: '70%', padding: 10 }}>
        <h3>Chat</h3>
        {history.map((msg, idx) => (
          <p key={idx}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWithClient;
