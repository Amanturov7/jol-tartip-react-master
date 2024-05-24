import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css'; // Importing the CSS file

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAvatar, setNewAvatar] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUserData, setEditedUserData] = useState({});
  const defaultAvatar = 'path/to/default/avatar.png'; // Replace with the path to your default avatar image

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
        setEditedUserData(response.data);
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

      fetchAvatar(userData.id);
    } catch (error) {
      console.error('Ошибка при загрузке аватара:', error);
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/rest/user/${userData.id}/avatar`);
      setAvatar(null);
    } catch (error) {
      console.error('Ошибка при удалении аватара:', error);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData({ ...editedUserData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/rest/user/${userData.id}`, editedUserData);
      setUserData(editedUserData);
      setEditMode(false);
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  };

  const handleCancel = () => {
    setEditedUserData(userData);
    setEditMode(false);
  };

  if (loading) {
    return <p>Загрузка данных пользователя...</p>;
  }

  return (
    <div className="container">
      {userData ? (
        <>
          <div className="avatar-section">
            <h2> @{userData.username}</h2>
            <div className="img-box">
              <img src={avatar || defaultAvatar} alt="Аватар пользователя" />
            </div>
            <div className="user-data">
              {editMode ? (
                <>
                  <p>Имя: <input type="text" name="username" value={editedUserData.username} onChange={handleInputChange} /></p>
                  <p>Роль: <input type="text" name="role" value={editedUserData.role} onChange={handleInputChange} /></p>
                  <p>№: <input type="text" name="id" value={editedUserData.id} disabled /></p>
                  <div className="button-container">
                    <button className="button" onClick={handleSave}>Сохранить</button>
                    <button className="button" onClick={handleCancel}>Отменить</button>
                  </div>
                </>
              ) : (
                <>
                  <p>Имя: <input type="text" name="username" value={editedUserData.username} disabled /></p>
                  <p>Роль: <input type="text" name="role" value={editedUserData.role} disabled /></p>
                  <p>№: <input type="text" name="id" value={editedUserData.id} disabled /></p>
                  <button className="button" onClick={handleEditToggle}>Изменить</button>
                </>
              )}
            </div>
            <div className="custom-file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                className="custom-file-input"
                id="fileInput"
                onChange={handleAvatarChange}
              />
              <label className="custom-file-input-label" htmlFor="fileInput">
                Выбрать файл
              </label>
            </div>
            <div className="button-container">
              <button className="button" onClick={handleAvatarUpload}>Загрузить аватарку</button>
              <button className="button" onClick={handleAvatarDelete}>Удалить аватарку</button>
            </div>
          </div>
        </>
      ) : (
        <p>Данные пользователя не найдены.</p>
      )}
    </div>
  );
}

export default UserProfile;
