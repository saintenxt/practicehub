import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', 
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Заполните все поля');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email
        }),
        credentials: 'include' 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка входа');
      }

      
      navigate('/mainpage');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = () => {
    navigate('/register');
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
      <h2 style={{ textAlign: 'center', marginBottom: 30, color: '#3C3C3C' }}>Вход</h2>

      {error && <div style={{
        background: '#BEBEBE',
        color: '#3C3C3C',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        textAlign: 'center'
      }}>{error}</div>}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#545454' }}>Логин</label>
          <input
            type="text"
            name="username"   
            value={formData.username}
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
            placeholder="Введите логин"
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
            placeholder="Введите пароль"
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button type="submit" style={{
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

          <button type="button" onClick={handleRegister} style={{
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
        </div>
      </form>
    </div>
  );
};

export default LoginPage;