import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginComponent.css'; // Подключаем файл стилей

const LoginComponent = () => {
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/authenticate', loginData);
      console.log('Login successful:', response.data);

      sessionStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container"> {/* Обертка с пользовательским классом */}
      <h2>Войти</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container"> 
          <input type="text" name="login" placeholder="Логин" value={loginData.login} onChange={handleChange} />
        </div>
        <div className="input-container">
          <input type="password" name="password" placeholder="Пароль" value={loginData.password} onChange={handleChange} />
        </div>
        <button  className="submit" type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginComponent;
