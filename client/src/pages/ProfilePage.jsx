import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [userMatches, setUserMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);

  const navigate = useNavigate();

  // Загрузка профиля и матчей при монтировании
  useEffect(() => {
    fetchProfile();
    fetchUserMatches();
  }, []);

  // ---- Запросы к API ----

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile', { credentials: 'include' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка загрузки профиля');
      if (data.user) {
        setUser(data.user);
        setEditUsername(data.user.username || '');
        setEditEmail(data.user.email || '');
      } else {
        setError('Неожиданный ответ: ' + JSON.stringify(data));
      }
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMatches = async () => {
    try {
      setMatchesLoading(true);
      const response = await fetch('/api/matches/my', { credentials: 'include' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка загрузки матчей');
      setUserMatches(data.matches || []);
    } catch (err) {
      console.error('Ошибка загрузки матчей:', err);
      setUserMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  };

  // ---- Обработчики профиля ----

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: editUsername, email: editEmail }),
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка обновления');
      setUser(data.user);
      setSuccess('Профиль обновлён!');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (newPassword.length < 6) {
      setError('Новый пароль должен быть минимум 6 символов');
      return;
    }
    try {
      const response = await fetch('/api/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка смены пароля');
      setSuccess('Пароль успешно изменён!');
      setShowPasswordForm(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Можно загружать только изображения');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Файл не должен превышать 2 МБ');
      setTimeout(() => setError(''), 3000);
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const response = await fetch('/api/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка загрузки');
      setUser(data.user);
      setSuccess('Аватар загружен!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
    e.target.value = '';
  };

  const handleAvatarDelete = async () => {
    if (!user?.avatar) {
      setError('Аватар не установлен');
      return;
    }
    try {
      const response = await fetch('/api/avatar', {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка удаления');
      setUser(data.user);
      setSuccess('Аватар удалён');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ошибка выхода');
      setSuccess('Вы вышли');
      setTimeout(() => setSuccess(''), 3000);
      navigate('/login');
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  // ---- Управление матчами (из профиля) ----

  const handleDeleteMatch = async (matchId) => {
    if (!confirm('Удалить объявление?')) return;
    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Ошибка удаления');
      // Обновляем список локально
      setUserMatches(prev => prev.filter(m => m.id !== matchId));
      setSuccess('Объявление удалено');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLeaveMatch = async (matchId) => {
    try {
      const res = await fetch(`/api/matches/${matchId}/leave`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
      // Обновляем конкретный матч в списке
      setUserMatches(prev =>
        prev.map(m => (m.id === matchId ? data.match : m))
      );
      setSuccess('Вы отписались от матча');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  // Разделяем матчи на свои и чужие
  const myMatches = userMatches.filter(m => m.userId === user?.id);
  const joinedMatches = userMatches.filter(m => m.userId !== user?.id);

  // ---- Рендеринг ----

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Загрузка...</div>;
  if (!user) return <div style={{ textAlign: 'center', marginTop: 50 }}>Пользователь не найден</div>;

  const initial = user?.username?.charAt(0).toUpperCase() || '?';

  return (
    <>
      <Header />
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        {/* Сообщения об ошибках/успехе */}
        {error && (
          <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: 8, marginBottom: 20 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#d4edda', color: '#155724', padding: '12px', borderRadius: 8, marginBottom: 20 }}>
            {success}
          </div>
        )}

        {/* Карточка профиля */}
        <div style={{
          display: 'flex',
          gap: '40px',
          background: '#E4E4E5',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {/* Аватар */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            flex: '0 0 auto'
          }}>
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: '#BEBEBE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #949494',
              overflow: 'hidden',
              fontSize: '60px',
              fontWeight: 'bold',
              color: '#7A7A7A'
            }}>
              {user?.avatar ? (
                <img
                  src={user.avatar.startsWith('http') ? user.avatar : `/uploads/${user.avatar}`}
                  alt="Аватар"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <label
                htmlFor="avatar-upload"
                style={{
                  padding: '10px 20px',
                  background: '#7A7A7A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-block'
                }}
              >
                Загрузить фото
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
              {user?.avatar && (
                <button
                  onClick={handleAvatarDelete}
                  style={{
                    padding: '10px 20px',
                    background: '#d9534f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Удалить
                </button>
              )}
            </div>
          </div>

          {/* Информация и редактирование */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            justifyContent: 'center'
          }}>
            {!editMode ? (
              <>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  fontSize: '18px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid #BEBEBE',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 600, color: '#545454', minWidth: '100px' }}>Никнейм:</span>
                  <span style={{ color: '#3C3C3C' }}>{user?.username}</span>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  fontSize: '18px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid #BEBEBE',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 600, color: '#545454', minWidth: '100px' }}>Email:</span>
                  <span style={{ color: '#3C3C3C' }}>{user?.email}</span>
                </div>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '10px' }}>
                  <button
                    onClick={() => setEditMode(true)}
                    style={{
                      padding: '12px 30px',
                      background: '#949494',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    Редактировать профиль
                  </button>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    style={{
                      padding: '12px 30px',
                      background: '#7A7A7A',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    {showPasswordForm ? 'Отмена' : 'Сменить пароль'}
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '12px 30px',
                      background: '#d9534f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    Выйти
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdateProfile}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, color: '#545454' }}>
                    Никнейм
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #BEBEBE',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, color: '#545454' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #BEBEBE',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 30px',
                      background: '#7A7A7A',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setEditUsername(user.username);
                      setEditEmail(user.email);
                    }}
                    style={{
                      padding: '12px 30px',
                      background: '#BEBEBE',
                      color: '#3C3C3C',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Форма смены пароля */}
        {showPasswordForm && (
          <div style={{
            background: '#E4E4E5',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#3C3C3C', marginBottom: '20px' }}>Смена пароля</h3>
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, color: '#545454' }}>
                  Старый пароль
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #BEBEBE',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, color: '#545454' }}>
                  Новый пароль
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="6"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #BEBEBE',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500, color: '#545454' }}>
                  Подтверждение нового пароля
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #BEBEBE',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '12px 30px',
                    background: '#7A7A7A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Сменить пароль
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  style={{
                    padding: '12px 30px',
                    background: '#BEBEBE',
                    color: '#3C3C3C',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Список матчей с разделением */}
        <div style={{
          background: '#E4E4E5',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#3C3C3C', fontSize: '24px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '3px solid #BEBEBE' }}>
            Мои матчи
          </h3>

          {matchesLoading ? (
            <div style={{ textAlign: 'center', color: '#7A7A7A' }}>Загрузка матчей...</div>
          ) : (
            <>
              {/* Мои объявления */}
              <h4 style={{ margin: '20px 0 10px', color: '#545454' }}>📌 Мои объявления</h4>
              {myMatches.length === 0 ? (
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px dashed #BEBEBE',
                  textAlign: 'center',
                  color: '#7A7A7A',
                  marginBottom: '20px'
                }}>
                  Вы ещё не создали ни одного объявления.
                </div>
              ) : (
                myMatches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    isAuthor={true}
                    onDelete={handleDeleteMatch}
                  />
                ))
              )}

              {/* Мои записи */}
              <h4 style={{ margin: '20px 0 10px', color: '#545454' }}>📝 Матчи, на которые я записан</h4>
              {joinedMatches.length === 0 ? (
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px dashed #BEBEBE',
                  textAlign: 'center',
                  color: '#7A7A7A'
                }}>
                  Вы ещё не записаны ни на один матч.
                </div>
              ) : (
                joinedMatches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    isAuthor={false}
                    onLeave={handleLeaveMatch}
                  />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ---- Компонент карточки матча (внутри того же файла) ----

const MatchCard = ({ match, isAuthor, onDelete, onLeave }) => {
  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: '2px solid #D0D0D0',
      marginBottom: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#3C3C3C' }}>
          {match.title}
        </span>
        <span style={{
          background: '#7A7A7A',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '14px'
        }}>
          {match.game ? match.game.charAt(0).toUpperCase() + match.game.slice(1) : 'Игра'}
        </span>
      </div>
      <p style={{ margin: 0, color: '#555' }}>{match.description}</p>
      <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#777', flexWrap: 'wrap' }}>
        <span>📅 {new Date(match.date).toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</span>
        <span>👤 {match.author || 'Автор'}</span>
        <span>👥 {match.players?.length || 0}</span>
        <span style={{
          background: match.status === 'open' ? '#d4edda' : '#f8d7da',
          color: match.status === 'open' ? '#155724' : '#721c24',
          padding: '2px 10px',
          borderRadius: '12px',
          fontSize: '12px'
        }}>
          {match.status === 'open' ? 'Открыто' : 'Закрыто'}
        </span>
      </div>
      {/* Кнопки действий */}
      {isAuthor ? (
        <button
          onClick={() => onDelete(match.id)}
          style={{
            alignSelf: 'flex-start',
            padding: '8px 20px',
            background: '#d9534f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '5px'
          }}
        >
          Удалить объявление
        </button>
      ) : (
        <button
          onClick={() => onLeave(match.id)}
          style={{
            alignSelf: 'flex-start',
            padding: '8px 20px',
            background: '#f0ad4e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '5px'
          }}
        >
          Отписаться
        </button>
      )}
    </div>
  );
};

export default ProfilePage;