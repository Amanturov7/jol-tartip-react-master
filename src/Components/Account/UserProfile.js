import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAvatar, setNewAvatar] = useState(null);
  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `${token}`;

      axios.get('http://localhost:8080/rest/user/user', {
        params: {
          token: token
        }
      })
      .then(response => {
        setUserData(response.data);
        setLoading(false);
        fetchAvatar(response.data.id);
      })
      .catch(error => {
        console.error('Ошибка при получении данных о пользователе:', error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAvatar = (userId) => {
    axios.get(`http://localhost:8080/rest/attachments/download/avatar/user/${userId}`, {
      responseType: 'arraybuffer'
    })
    .then(response => {
      const imageUrl = URL.createObjectURL(new Blob([response.data]));
      setAvatar(imageUrl);
    })
    .catch(error => {
      console.error('Ошибка при загрузке аватара:', error);
    });
  };

  const handleAvatarChange = (event) => {
    setNewAvatar(event.target.files[0]);
  };

  const handleAvatarUpload = async () => {
    if (!newAvatar) {
      console.error('Файл не выбран');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', newAvatar);

      await axios.post(`http://localhost:8080/rest/user/${userData.id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchAvatar(userData.id); // Обновляем аватар после успешной загрузки
    } catch (error) {
      console.error('Ошибка при загрузке аватара:', error);
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/rest/user/${userData.id}/avatar`);
      setAvatar(null); // Удаляем текущий аватар изображения после успешного удаления
    } catch (error) {
      console.error('Ошибка при удалении аватара:', error);
    }
  };

  if (loading) {
    return <p>Загрузка данных пользователя...</p>;
  }

  return (
    <div>
      {userData ? (
        <div className='container'>
          <h2>Профиль</h2>
          <p>Аватар</p>

          <div className='img-box'>
           {avatar && <img src={avatar} alt="Аватар пользователя" />}
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          <button onClick={handleAvatarUpload}>Загрузить аватарку</button>
          <button onClick={handleAvatarDelete}>Удалить аватарку</button>
          <p>Имя {userData.username}</p>
          <p>Роль {userData.role}</p>
          <p>№ {userData.id}</p>
  
    

        </div>
      ) : (
        <p>Данные пользователя не найдены.</p>
      )}
    </div>
  );
}

export default UserProfile;
