import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUpComponent.css'; // Подключаем файл стилей
import config from '../Config'
const SignUpComponent = () => {
  const [signUpData, setSignUpData] = useState({ login: '', password: '', inn: '', email: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Получаем объект history

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.BASE_URL}/rest/auth/signup`, signUpData);
      console.log('Sign up successful:', response.data);
      // Перенаправляем пользователя на страницу авторизации
      navigate('/login'); // Перенаправляем на страницу с маршрутом '/login'
    } catch (error) {
      console.error('Sign up error:', error);
      setError('Registration failed. Please try again.'); 
    }
  };

  return (
    <div className="signup-container"> {/* Обертка с пользовательским классом */}
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className="signup-form"> {/* Добавлен класс "signup-form" */}
        <input type="text" name="login" placeholder="Логин" value={signUpData.login} onChange={handleChange} />
        <input type="password" name="password" placeholder="Пароль" value={signUpData.password} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={signUpData.email} onChange={handleChange} />
        <input type="phone" name="phone" placeholder="Телефон" value={signUpData.phone} onChange={handleChange} />
        <input type="text" name="address" placeholder="Адрес" value={signUpData.address} onChange={handleChange} />
        <input type="phone" name="inn" placeholder="ИНН" value={signUpData.inn} onChange={handleChange} />
        <input type="text" name="passport" placeholder="Пасспорт Серия №" value={signUpData.passportSerial} onChange={handleChange} />
        <button type="submit">Регистрация</button>
        {error && <div className="error-message">{error}</div>} {/* Обертка с пользовательским классом для сообщения об ошибке */}
      </form>
    </div>
  );
};

export default SignUpComponent;
