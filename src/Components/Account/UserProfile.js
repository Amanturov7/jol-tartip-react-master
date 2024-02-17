import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Получение JWT токена из localStorage (предполагается, что он был сохранен там после успешной аутентификации)
    const token = sessionStorage.getItem('token');
    console.log('JWT токен:', token); // Вывод токена на консоль
    if (token) {
        // Устанавливаем JWT токен в заголовок Authorization
        axios.defaults.headers.common['Authorization'] = `${token}`;

        // Отправляем запрос к серверу для получения данных о пользователе
        axios.get('http://localhost:8080/rest/user/user', {
    params: {
        token: token
    }
})
.then(response => {
    // Устанавливаем данные пользователя в состояние
    setUserData(response.data);
})
.catch(error => {
    console.error('Ошибка при получении данных о пользователе:', error);
});

    }
}, []);


  return (
    <div>
      {userData ? (
        <div className='container'>
          <h2>Профиль</h2>
          <p>Имя: {userData.username}</p>
          <p>Роль: {userData.role}</p>
          <p>№: {userData.id}</p>

        </div>
      ) : (
        <p>Загрузка данных пользователя...</p>
      )}
    </div>
  );
}

export default UserProfile;
