import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const navigate = useNavigate(); // Используем useNavigate для перенаправления

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="login" placeholder="Login" value={loginData.login} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginComponent;
