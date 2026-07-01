import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../photos/logo.png';

function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

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
            <Link className={`header_list-link ${isActive('/messages')}`} to="/messages">
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