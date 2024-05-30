import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css'; // Importing the CSS file
import defaultAvatar from '../../images/demo-avatar.jpg'
import  config  from '../Config';

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAvatar, setNewAvatar] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUserData, setEditedUserData] = useState({});

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `${token}`;

      axios.get(`${config.BASE_URL}/rest/user/user`, {
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
    axios.get(`${config.BASE_URL}/rest/attachments/download/avatar/user/${userId}`, {
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

      await axios.post(`${config.BASE_URL}/rest/user/${userData.id}/avatar`, formData, {
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
      await axios.delete(`${config.BASE_URL}/rest/user/${userData.id}/avatar`);
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
      await axios.put(`${config.BASE_URL}/rest/user/${userData.id}`, editedUserData);
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
          <div className="form-container">
            <div className="img-box-profile ">
            <h2> @{userData.username}</h2>

              <img src={avatar || defaultAvatar} alt="Аватар пользователя" />
              <div className="custom-file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                className="custom-file-input"
                id="fileInput"
                onChange={handleAvatarChange}
              />
              <label className="custom-file-input-label" htmlFor="fileInput">
                Выбрать Аватарку
              </label>
              <div className="button-container">
              <button className="button" onClick={handleAvatarUpload}>Загрузить </button>
              <button className="button" onClick={handleAvatarDelete}>Удалить </button>
            </div>
            </div>
           
            </div>
            
              {editMode ? (
                <>
                               <div className="form-group">
                               <h3>ID</h3>
                   <input type="text" name="id" value={editedUserData.id} disabled />
                  <h3>Логин</h3>
                  <input type="text" name="username" value={editedUserData.username}  />
                  <h3>Роль</h3>
                  <input type="text" name="role" value={editedUserData.role} disabled />
                  <h3>Дата регистрации</h3>
                  <input type="text" name="signupDate" value={editedUserData.signupDate} disabled />
                  <h3>Email</h3>
                   <input type="text" name="email" value={editedUserData.email}  />
                  
                  

                   </div>
                   <div className="form-group">
                <h3>Паспорт серия №</h3>
                  <input type="text" name="passportSerial" value={editedUserData.passportSerial}  />
                  <h3>ИНН</h3>
                   <input type="text" name="inn" value={editedUserData.inn}  />
                   <h3>Номер телефона</h3>
                   <input type="text" name="phone" value={editedUserData.phone}  />
                   <h3>Адрес</h3>
                   <input type="text" name="address" value={editedUserData.address}  />
                   <div className="button-container">
                    <button className="button" onClick={handleSave}>Сохранить</button>
                    <button className="button" onClick={handleCancel}>Отменить</button>
                  </div>
                   </div>
            
                  
                  
                </>
              ) : (
                <>
                                <div className="form-group">
                                <h3>ID</h3>
                   <input type="text" name="id" value={editedUserData.id} disabled />
                  <h3>Логин</h3>
                  <input type="text" name="username" value={editedUserData.username} disabled />
                  <h3>Роль</h3>
                  <input type="text" name="role" value={editedUserData.role} disabled />
                  <h3>Дата регистрации</h3>
                  <input type="text" name="signupDate" value={editedUserData.signupDate} disabled />
                  <h3>Email</h3>
                   <input type="text" name="email" value={editedUserData.email} disabled />
                  

                   </div>
                   <div className="form-group">
                   <h3>Паспорт серия №</h3>
                  <input type="text" name="passportSerial" value={editedUserData.passportSerial} disabled/>
                  <h3>ИНН</h3>
                   <input type="text" name="inn" value={editedUserData.inn}  disabled/>
                   <h3>Номер телефона</h3>
                   <input type="text" name="phone" value={editedUserData.phone} disabled />
                   <h3>Адрес</h3>
                   <input type="text" name="address" value={editedUserData.address} disabled />
           
                   <button className="button" onClick={handleEditToggle}>Изменить</button>

                   </div>
                </>
                
              )}
            </div>
        
        
        </>
      ) : (
        <p>Данные пользователя не найдены.</p>
      )}
    </div>
  );
}

export default UserProfile;
