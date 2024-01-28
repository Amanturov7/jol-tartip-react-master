import React, { useState } from 'react';
import axios from 'axios';

const SignUpComponent = () => {
  const [signUpData, setSignUpData] = useState({ login: '', password: '', inn: '', email: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/auth/signup`, [signUpData]); // Оборачиваем signUpData в массив
      console.log('Sign up successful:', response.data);
      // Добавьте логику для обработки успешной регистрации
    } catch (error) {
      console.error('Sign up error:', error);
      // Добавьте логику для обработки ошибок регистрации
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="login" placeholder="Login" value={signUpData.login} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={signUpData.password} onChange={handleChange} />
        <input type="number" name="inn" placeholder="INN" value={signUpData.inn} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={signUpData.email} onChange={handleChange} />
        <button type="submit">Sign Up</button>
        {error && <div style={{ color: 'red' }}>{error}</div>} {/* Отображаем ошибку, если она есть */}
      </form>
    </div>
  );
};

export default SignUpComponent;
