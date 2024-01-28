import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavbarComponent = () => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem('token');
    return accessToken !== null && accessToken !== undefined;
  };

  console.log('Is authenticated:', isAuthenticated()); // Выводим результат проверки на консоль
  const handleSignOut = () => {

    sessionStorage.removeItem("token");

    navigate("/");
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Jol Tartip
        </Link>
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
          {isAuthenticated() ? (
            <Link to="/" className="navbar-link" onClick={handleSignOut}>
              Выйти
            </Link>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Войти
              </Link>
              <Link to="/signup" className="navbar-link">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
