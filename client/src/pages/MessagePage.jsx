import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Message.css';
import Header from './Header';

function MessagePage() {
  const { userId: paramUserId } = useParams();       // ID из URL
  const location = useLocation();
  const { authorName } = location.state || {};      // Имя собеседника, переданное из GamePage

  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Загружаем список диалогов при монтировании
  useEffect(() => {
    loadConversations();
  }, []);

  // Загружаем сообщения при смене активного чата
  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    }
  }, [activeChatId]);

  // Функция загрузки списка диалогов (GET /api/messages)
  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/messages', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки чатов');

      let formattedChats = data.conversations.map(conv => ({
        id: conv.userId,
        name: conv.username || 'Неизвестный',
        avatar: conv.avatar || '/default-avatar.png',
        lastMessage: conv.lastMessage || 'Нет сообщений',
        time: conv.lastMessageDate ? new Date(conv.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        unreadCount: conv.unreadCount || 0
      }));

      // Если в URL есть userId, проверяем, есть ли такой чат в списке
      if (paramUserId) {
        const userIdNum = Number(paramUserId);
        const exists = formattedChats.some(chat => chat.id === userIdNum);
        if (!exists) {
          // Создаём временный чат, если его нет
          const newChat = {
            id: userIdNum,
            name: authorName || `Пользователь ${userIdNum}`,
            avatar: '/default-avatar.png',
            lastMessage: 'Нет сообщений',
            time: '',
            unreadCount: 0
          };
          formattedChats = [newChat, ...formattedChats];
        }
        // Устанавливаем активным этот чат
        setActiveChatId(userIdNum);
      }

      setChats(formattedChats);
    } catch (err) {
      console.error('Ошибка загрузки диалогов:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка сообщений с конкретным пользователем
  const loadMessages = async (userId) => {
    try {
      const res = await fetch(`/api/messages/${userId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки сообщений');

      const formattedMessages = data.messages.map(msg => ({
        id: msg.id,
        sender: msg.fromUserId === userId ? 'other' : 'me',
        text: msg.text,
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasFile: false
      }));

      setMessages(prev => ({
        ...prev,
        [userId]: formattedMessages
      }));

      // Помечаем сообщения как прочитанные
      await markMessagesAsRead(userId);
    } catch (err) {
      console.error('Ошибка загрузки сообщений:', err);
    }
  };

  // Отправка сообщения
  const sendMessage = async () => {
    if (!newMessage.trim() && attachedFiles.length === 0) return;
    if (!activeChatId) return;

    let messageText = newMessage.trim();
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map(file => file.name).join(', ');
      messageText = messageText ? `${messageText}\n Прикреплены: ${fileNames}` : `Прикреплены: ${fileNames}`;
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

      // Обновляем последнее сообщение в списке чатов
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

  // Отметка о прочтении
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

  // Фильтрация чатов по поиску
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeChat = chats.find(chat => chat.id === activeChatId);
  const chatMessages = activeChatId ? messages[activeChatId] || [] : [];

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
        <Header />

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