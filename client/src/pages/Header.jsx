import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../photos/logo.png';

function Header() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Пример статического числа уведомлений – позже замените на состояние/пропс
  const notificationCount = 3;

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
            <Link className={`header_list-link ${isActive('/match')}`} to="/match">
              Сообщения
            </Link>
          </li>
        </ul>

        {/* НОВЫЙ БЛОК – уведомления */}
        <div className="header_notification">
          <button className="notification_button" onClick={() => {/* временно */}}>
            <i className="fas fa-bell"></i>
            {notificationCount > 0 && (
              <span className="notification_badge">{notificationCount}</span>
            )}
          </button>
        </div>

        <Link className="header_button" to="/profile">
          Личный кабинет
        </Link>
      </nav>
    </header>
  );
}

export default Header;