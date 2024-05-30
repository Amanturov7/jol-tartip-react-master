import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  config  from './Config';

import Axios from 'axios';
const NavbarComponent = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState(false);

  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem('token');
    return accessToken !== null && accessToken !== undefined;
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          const response = await Axios.get(`${config.BASE_URL}/rest/user/user`, {
            params: {
              'token': `${token}`
            }
          });
          setUserName(response.data.username);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
  
    fetchUserData();
  }, []);


  const handleSignOut = () => {

    sessionStorage.removeItem('token');
    navigate('/');
    setIsMenuOpen(false); 
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
            <Link to="/reviews" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Отзывы
            </Link>
            {isAuthenticated() ? (

            <Link to="/events" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              События
            </Link>      
            ): null}
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
            <Link to="/monitoring" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Мониторинг
            </Link>
             ): null}
            {isAuthenticated() ? (
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
            ): null}

              {isAuthenticated() ? (
  <Link to="/account" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
<svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 512.000000 512.000000"
            style={{ verticalAlign: 'middle', marginBottom: '5px' }}
            className="navbar-icon"
            >
         
<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
     fill="currentColor"
     fillRule="nonzero">
<path d="M2330 5110 c-494 -48 -950 -230 -1350 -538 -195 -150 -448 -432 -594
-662 -63 -99 -186 -351 -230 -471 -310 -847 -143 -1817 433 -2509 405 -488
970 -805 1603 -901 203 -31 533 -31 736 0 769 117 1433 561 1829 1221 351 587
452 1296 278 1959 -48 180 -92 297 -180 476 -132 269 -269 460 -489 681 -221
220 -412 357 -681 489 -246 121 -474 193 -740 235 -147 23 -475 34 -615 20z
m520 -195 c531 -66 1005 -298 1386 -679 453 -454 694 -1035 694 -1676 0 -549
-176 -1051 -521 -1485 -77 -98 -263 -289 -275 -284 -99 43 -897 454 -917 473
-56 52 -67 95 -67 269 l0 157 64 93 c73 105 170 287 210 392 23 60 33 74 71
97 24 14 60 48 79 75 61 82 68 121 64 390 -3 228 -4 240 -27 283 -13 25 -29
52 -36 60 -10 12 -14 91 -17 340 -4 321 -4 326 -31 405 -37 113 -90 197 -177
286 -177 179 -422 260 -790 260 -368 0 -613 -81 -790 -260 -87 -89 -140 -173
-177 -286 -27 -79 -27 -84 -31 -405 -3 -249 -7 -328 -17 -340 -7 -8 -23 -35
-36 -60 -23 -44 -24 -51 -24 -300 0 -255 0 -255 26 -311 15 -31 42 -74 61 -95
20 -23 40 -60 48 -89 35 -130 116 -299 216 -454 l56 -84 -4 -161 c-3 -149 -5
-164 -27 -203 -14 -24 -41 -54 -60 -67 -20 -14 -200 -114 -401 -224 -201 -110
-379 -208 -397 -218 l-32 -19 -72 70 c-203 200 -386 464 -505 726 -235 523
-270 1144 -94 1694 162 505 503 954 950 1252 300 200 651 331 1011 377 146 19
438 19 589 1z m-115 -735 c338 -38 537 -176 621 -430 16 -49 19 -93 19 -392
l0 -337 33 -34 c18 -18 37 -49 42 -68 12 -42 13 -350 1 -403 -12 -48 -52 -91
-107 -112 -41 -15 -43 -19 -74 -107 -61 -171 -156 -346 -267 -488 l-43 -55 0
-182 c0 -203 9 -262 52 -343 54 -104 75 -117 539 -349 486 -244 448 -211 331
-289 -393 -264 -847 -401 -1322 -401 -384 0 -732 84 -1074 257 -119 61 -356
209 -356 222 1 3 174 100 387 216 249 135 403 225 434 253 59 53 105 142 119
232 5 36 10 136 10 222 l0 157 -60 83 c-103 144 -193 334 -235 496 -16 60 -24
76 -51 94 -63 43 -69 64 -72 257 -5 227 -1 252 49 306 l40 43 -1 334 c-2 367
0 382 63 503 95 180 288 282 602 319 67 7 235 5 320 -4z"/>
</g>
          </svg>
          {userName}
          </Link>

        ) : null}
            {isAuthenticated() ? (


            <button
              className="button-navbar navbar-link logout"

              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
                navigate('/');
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
                navigate('/login'); 
              }}
            >
              Войти
            </button>
                            <button
              className="button-navbar navbar-link"

              onClick={() => {
                setIsMenuOpen(false);
                navigate('/signup'); 
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
