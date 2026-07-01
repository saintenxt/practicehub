import React, { useState, useEffect, useRef } from 'react';
import './Message.css';

function MessagePage() {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  
  useEffect(() => {
    loadConversations();
  }, []);

  // 2. При смене активного чата загружаем историю сообщений
  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    }
  }, [activeChatId]);

  // 3. Загрузка списка диалогов (GET /api/messages/match)
  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/messages/match', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки чатов');

      // Преобразуем ответ в формат для отображения
      const formattedChats = data.conversations.map(conv => ({
        id: conv.userId,
        name: conv.username || 'Неизвестный',
        avatar: conv.avatar || '/default-avatar.png',
        lastMessage: conv.lastMessage || 'Нет сообщений',
        time: conv.lastMessageDate ? new Date(conv.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        unreadCount: conv.unreadCount || 0
      }));

      setChats(formattedChats);
    } catch (err) {
      console.error('Ошибка загрузки диалогов:', err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Загрузка сообщений с конкретным пользователем (GET /api/messages/:userId)
  const loadMessages = async (userId) => {
    try {
      const res = await fetch(`/api/messages/${userId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки сообщений');

      // Преобразуем сообщения в формат для отображения
      const formattedMessages = data.messages.map(msg => ({
        id: msg.id,
        sender: msg.fromUserId === activeChatId ? 'other' : 'me',
        text: msg.text,
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasFile: false // можно добавить поддержку файлов позже
      }));

      setMessages(prev => ({
        ...prev,
        [userId]: formattedMessages
      }));

      // Помечаем сообщения как прочитанные (PATCH /api/messages/read)
      await markMessagesAsRead(userId);

    } catch (err) {
      console.error('Ошибка загрузки сообщений:', err);
    }
  };

  // 5. Отправка сообщения (POST /api/messages)
  const sendMessage = async () => {
    if (!newMessage.trim() && attachedFiles.length === 0) return;
    if (!activeChatId) return;

    let messageText = newMessage.trim();
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map(file => file.name).join(', ');
      messageText = messageText ? `${messageText}\n📎 Прикреплены: ${fileNames}` : `📎 Прикреплены: ${fileNames}`;
      setAttachedFiles([]);
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: activeChatId,
          text: messageText
        }),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка отправки');

      // Добавляем отправленное сообщение в локальное состояние
      const newMsg = {
        id: data.message.id,
        sender: 'me',
        text: data.message.text,
        time: new Date(data.message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasFile: attachedFiles.length > 0
      };

      setMessages(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), newMsg]
      }));

      // Обновляем последнее сообщение в списке диалогов
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChatId 
            ? { ...chat, lastMessage: messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : chat
        )
      );

      setNewMessage('');
    } catch (err) {
      alert(err.message);
    }
  };

  // 6. Пометить сообщения как прочитанные (PATCH /api/messages/read)
  const markMessagesAsRead = async (userId) => {
    try {
      await fetch('/api/messages/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId: userId }),
        credentials: 'include'
      });
    } catch (err) {
      console.error('Ошибка отметки прочитанных:', err);
    }
  };

  // 7. Фильтрация чатов по поиску
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeChat = chats.find(chat => chat.id === activeChatId);
  const chatMessages = activeChatId ? messages[activeChatId] || [] : [];

  // 8. Обработчики событий
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

  if (loading && chats.length === 0) {
    return <div className="loading">Загрузка диалогов...</div>;
  }

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
                    <div className="chat-last-message">{chat.lastMessage}</div>
                  </div>
                  <div className="chat-time">
                    {chat.time}
                    {chat.unreadCount > 0 && (
                      <span className="unread-badge">{chat.unreadCount}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-chats">
                {searchTerm ? 'Чаты не найдены' : 'Нет активных чатов'}
              </div>
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