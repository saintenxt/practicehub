import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../photos/logo.png';

function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch('/api/profile', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUserId(data.user.id);
      })
      .catch(() => {});
  }, []);

  const messagesPath = userId ? `/messages/${userId}` : '/messages';

  return (
    <header className="shapka">
      <nav className="header_nav">
        <Link to="/">
          <img src={logo} width="100" height="50" alt="Logo" />
        </Link>

        <ul className="header_list">
          <li>
            <Link className={`header_list-link ${isActive('/')}`} to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className={`header_list-link ${isActive(messagesPath)}`} to={messagesPath}>
              Сообщения
            </Link>
          </li>
        </ul>

        <div className="header_right">
          <Link className="header_button" to="/profile">
            Личный кабинет
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;