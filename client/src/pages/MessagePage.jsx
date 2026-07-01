import React, { useState, useRef } from 'react';
import './Message.css';

// Пустые массивы для чатов и сообщений
const initialChats = [];
const initialMessages = {};

function MessagePage() {
  const [chats, setChats] = useState(initialChats);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeChat = chats.find(chat => chat.id === activeChatId);
  const chatMessages = activeChatId ? messages[activeChatId] || [] : [];

  const sendMessage = () => {
    if (!newMessage.trim() && attachedFiles.length === 0) return;
    
    let messageText = newMessage.trim();
    
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map(file => file.name).join(', ');
      messageText = messageText ? `${messageText}\n📎 Прикреплены: ${fileNames}` : `📎 Прикреплены: ${fileNames}`;
      setAttachedFiles([]);
    }
    
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasFile: attachedFiles.length > 0,
    };
    
    setMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files]);
      const fileNames = files.map(file => file.name).join(', ');
      setNewMessage(prev => prev ? `${prev} 📎 ${fileNames}` : `📎 ${fileNames}`);
    }
    e.target.value = null;
  };

  return (
    <div className="message-page">
      <div className="message-container">
        <div className="message-search">
          <input
            type="text"
            placeholder="Поиск чатов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="message-main">
          <div className="chat-list">
            {filteredChats.length > 0 ? (
              filteredChats.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
                  <div className="chat-info">
                    <div className="chat-name">{chat.name}</div>
                    <div className="chat-last-message">{chat.lastMessage || 'Нет сообщений'}</div>
                  </div>
                  <div className="chat-time">{chat.time || ''}</div>
                </div>
              ))
            ) : (
              <div className="no-chats">Нет активных чатов</div>
            )}
          </div>

          <div className="chat-window">
            {activeChat ? (
              <>
                <div className="chat-header">
                  <img src={activeChat.avatar} alt={activeChat.name} className="chat-header-avatar" />
                  <div className="chat-header-name">{activeChat.name}</div>
                </div>

                <div className="chat-messages">
                  {chatMessages.length > 0 ? (
                    chatMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`message ${msg.sender === 'me' ? 'message-mine' : 'message-other'}`}
                      >
                        <div className="message-text">{msg.text}</div>
                        {msg.hasFile && (
                          <div className="message-file-icon">📎</div>
                        )}
                        <div className="message-time">{msg.time}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-messages">Нет сообщений. Начните диалог!</div>
                  )}
                </div>

                <div className="chat-input">
                  <button 
                    className="attach-button" 
                    onClick={handleFileAttach}
                    title="Прикрепить файл"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                    </svg>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    multiple
                  />
                  <input
                    type="text"
                    placeholder="Введите сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button onClick={sendMessage}>Отправить</button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">Выберите чат или создайте новый</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagePage;