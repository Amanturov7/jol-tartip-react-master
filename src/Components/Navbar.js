import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const NavbarComponent = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem('token');
    return accessToken !== null && accessToken !== undefined;
  };

  const handleSignOut = () => {

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
            <Link
                to="/notifications"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  className="navbar-icon"
                  style={{ verticalAlign: 'middle' }}
                >
                  <path
                    fill="currentColor"
                    fillRule="nonzero"
                    d="M21.748 5.032a.998.998 0 0 0-.321.149L12 11.779 2.573 5.181a.998.998 0 0 0-.321-.15A2.005 2.005 0 0 1 4 4h16c.75 0 1.406.418 1.748 1.032zM22 7.22V18c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V7.22l9.427 6.6a1 1 0 0 0 1.146 0L22 7.22z"
                  ></path>
                </svg>
              </Link>

            {isAuthenticated() ? (


            <button
              className="button-navbar navbar-link"

              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
                navigate('/'); // Замените 'history' на ваш объект истории маршрутизации
              }}
            >
              Выйти
            </button>


                
                        ) : (
                          <>
                            <button
              className="button-navbar navbar-link"

              onClick={() => {
                setIsMenuOpen(false);
                navigate('/login'); // Замените 'history' на ваш объект истории маршрутизации
              }}
            >
              Войти
            </button>
                            <button
              className="button-navbar navbar-link"

              onClick={() => {
                setIsMenuOpen(false);
                navigate('/signup'); // Замените 'history' на ваш объект истории маршрутизации
              }}
            >
              Регистрация
            </button>



              </>
            )}


          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
