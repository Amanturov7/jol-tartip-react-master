import React, { useState } from 'react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem('token');
    return accessToken !== null && accessToken !== undefined;
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('token');
    navigate('/');
    setIsMenuOpen(false); // Закрываем бургер-меню при выходе
    sessionStorage.removeItem('token');
    navigate('/');
    setIsMenuOpen(false); // Закрываем бургер-меню при выходе
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Jol Tartip
        </Link>
        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <div className="burger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="navbar-links-container">
            <Link to="/report" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Нарушения
            </Link>
            <Link to="/events" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              События
            </Link>
            <Link to="/notifications" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              №
            </Link>
            <Link to="/reviews" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Отзывы и оценки
            </Link>
            <Link to="/violations-list" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Штрафы
            </Link>
            <Link to="/tests" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Тесты
            </Link>
            <Link to="/maps" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Карты
            </Link>
            <Link to="/about" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              О нас
            </Link>
            {isAuthenticated() ? (
              <Link to="/" className="navbar-link" onClick={handleSignOut}>
                Выйти
              </Link>
            ) : (
              <>
                <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  Войти
                </Link>
                <Link to="/signup" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
