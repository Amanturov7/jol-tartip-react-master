import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
Jol Tartip        </Link>
        <div className="navbar-links">
          <Link to="/report" className="navbar-link">
            Заявить о нарушении
          </Link>
          <Link to="/events" className="navbar-link">
            События
          </Link>
          <Link to="/notifications" className="navbar-link">
            Уведомления
          </Link>
          <Link to="/reviews" className="navbar-link">
            Отзывы и оценки
          </Link>
          <Link to="/violations-list" className="navbar-link">
          Список штрафов ПДД
          </Link>
          <Link to="/tests" className="navbar-link">
            Тесты ПДД
          </Link>
          <Link to="/maps" className="navbar-link">
            Карты
          </Link>
          <Link to="/about" className="navbar-link">
            О нас
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
