import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.login || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Заполните все поля');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.login,
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка регистрации');
      }

      alert('Регистрация прошла успешно! Теперь войдите.');
      navigate('/api/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };


  return (
    <div style={{
      maxWidth: 400,
      margin: '100px auto',
      padding: 40,
      background: '#E4E4E5',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30, color: '#3C3C3C' }}>Регистрация</h2>

      {error && <div style={{
        background: '#BEBEBE',
        color: '#3C3C3C',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        textAlign: 'center'
      }}>{error}</div>}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#545454' }}>Логин</label>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: 12,
              border: '2px solid #BEBEBE',
              borderRadius: 8,
              fontSize: 16,
              boxSizing: 'border-box',
              background: 'white',
              color: '#3C3C3C'
            }}
            placeholder="Придумайте логин"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#545454' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: 12,
              border: '2px solid #BEBEBE',
              borderRadius: 8,
              fontSize: 16,
              boxSizing: 'border-box',
              background: 'white',
              color: '#3C3C3C'
            }}
            placeholder="example@mail.com"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#545454' }}>Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: 12,
              border: '2px solid #BEBEBE',
              borderRadius: 8,
              fontSize: 16,
              boxSizing: 'border-box',
              background: 'white',
              color: '#3C3C3C'
            }}
            placeholder="Минимум 6 символов"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#545454' }}>Подтверждение пароля</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: 12,
              border: '2px solid #BEBEBE',
              borderRadius: 8,
              fontSize: 16,
              boxSizing: 'border-box',
              background: 'white',
              color: '#3C3C3C'
            }}
            placeholder="Повторите пароль"
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button type="submit" style={{
            flex: 1,
            padding: 14,
            background: '#949494',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#7A7A7A'}
          onMouseLeave={(e) => e.target.style.background = '#949494'}
          >Регистрация</button>

          <button type="button" onClick={handleLogin} style={{
            flex: 1,
            padding: 14,
            background: '#7A7A7A',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#545454'}
          onMouseLeave={(e) => e.target.style.background = '#7A7A7A'}
          >Вход</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;