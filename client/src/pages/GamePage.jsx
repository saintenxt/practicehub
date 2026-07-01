import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ValorantPage.css';
import Header from './Header';
import { gameData } from '../gameData';

function GamePage() {
  const { game } = useParams(); 
  const gameInfo = gameData[game] || null;
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });
  const [currentUser, setCurrentUser] = useState(null);

  
  const gameTitle = game.charAt(0).toUpperCase() + game.slice(1);

  useEffect(() => {
    loadMatches();
    fetchCurrentUser();
  }, [game]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/profile', { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Не удалось получить пользователя');
    }
  };

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/matches/${game}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка загрузки');
      setMatches(data.matches || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, date } = formData;
    if (!title || !description || !date) {
      alert('Заполните все поля');
      return;
    }

    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: game,
          title,
          description,
          date: new Date(date).toISOString()
        }),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка создания');

      setMatches((prev) => [...prev, data.match]);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', date: '' });
    } catch (err) {
      alert(err.message);
    }
  };

const handleJoin = async (matchId) => {
  try {
    const res = await fetch(`/api/matches/${matchId}/join`, {
      method: 'POST',
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка');


    const match = matches.find(m => m.id === matchId);
    if (match && currentUser) {

      try {
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toUserId: match.userId,
            text: `Я записался на ваше объявление "${match.title}". Давайте договоримся об условиях.`
          }),
          credentials: 'include'
        });
        console.log('Сообщение автору отправлено');
      } catch (msgErr) {
        console.error('Не удалось отправить сообщение автору:', msgErr);
      }
    }

    setMatches(prev =>
      prev.map(m => (m.id === matchId ? data.match : m))
    );
  } catch (err) {
    alert(err.message);
  }
};

  const handleLeave = async (matchId) => {
    try {
      const res = await fetch(`/api/matches/${matchId}/leave`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
      setMatches(prev =>
        prev.map(m => (m.id === matchId ? data.match : m))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (matchId) => {
    if (!confirm('Удалить объявление?')) return;
    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Ошибка удаления');
      setMatches(prev => prev.filter(m => m.id !== matchId));
    } catch (err) {
      alert(err.message);
    }
  };


  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="game-page" style={{backgroundImage: `url(${gameInfo.backgroundImage})`}}>
      <Header />
      <div className="valorant-content">
        <h1>{gameInfo.title}</h1>
        <p>{gameInfo.description}</p>
        <p>Страница для игры {gameTitle} – здесь отображаются объявления о матчах.</p>
      </div>

      <div className="announcement-wrapper">
        <div className="valorant-announcements">
          {matches.length === 0 ? (
            <p className="color">Пока нет объявлений для {gameTitle}. Будьте первым!</p>
          ) : (
            matches.map((match) => {
              const isAuthor = currentUser && match.userId === currentUser.id;
              const isJoined = currentUser && match.players?.includes(currentUser.id);

              return (
                <div key={match.id} className="announcement-item">
                  <h3>{match.title}</h3>
                  <p>{match.description}</p>

                  {/* НОВАЯ СТРУКТУРА МЕТА-ДАННЫХ */}
                  <div className="match-meta">
                    <span className="meta-item">
                      📅 {new Date(match.date).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="meta-item">👤 {match.author}</span>
                    <span className={`meta-item status ${match.status === 'open' ? 'open' : 'closed'}`}>
                      {match.status === 'open' ? 'Открыто' : 'Закрыто'}
                    </span>
                    <span className="meta-item">👥 {match.players?.length || 0}</span>
                  </div>

                  {currentUser && !isAuthor && (
                    <>
                      {!isJoined ? (
                        <button className="join-btn" onClick={() => handleJoin(match.id)}>
                          Записаться
                        </button>
                      ) : (
                        <>
                        <button className="leave-btn" onClick={() => handleLeave(match.id)}>
                          Отписаться
                        </button>
                      
                        <Link to={`/messages/${match.userId}`} className="chat-btn">
                          Чат с автором
                        </Link>
                        </>
                      )} 
                    
                    </>
                  )}
                    
                  {isAuthor && (
                    <button className="delete-btn" onClick={() => handleDelete(match.id)}>
                      Удалить
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <button className="add-announcement-btn" onClick={() => setIsModalOpen(true)}>
          Разместить объявление
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Новое объявление для {gameTitle}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Заголовок
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Введите заголовок"
                  required
                />
              </label>
              <label>
                Описание
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Опишите, кого ищете"
                  rows="4"
                  required
                />
              </label>
              <label>
                Дата и время игры
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </label>
              <div className="modal-buttons">
                <button type="submit" className="submit-btn">Опубликовать</button>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamePage;