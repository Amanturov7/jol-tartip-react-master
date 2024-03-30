import React, { useEffect, useState } from 'react';
import Axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(0);
  const [formData, setFormData] = useState({
    description: '',
    notificationTypeId: '',
    userId: 0
  });
  const [notificationTypes, setNotificationTypes] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/rest/notifications/all');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      }
    };

    fetchNotifications();

    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          const response = await Axios.get('http://localhost:8080/rest/user/user', {
            params: {
              'token': `${token}`
            }
          });

          const userData = response.data;
          setUserId(userData.id);
          if (userData.role === 'SUPER_ADMIN') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();

    const fetchNotificationTypes = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/rest/common-reference/by-type/008');
        setNotificationTypes(response.data);
      } catch (error) {
        console.error('Error fetching notification types:', error.message);
      }
    };

    fetchNotificationTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData, userId: userId };
      await Axios.post('http://localhost:8080/rest/notifications/save', dataToSend);
      const response = await Axios.get('http://localhost:8080/rest/notifications/all');
      setNotifications(response.data);
      setFormData({ description: '', notificationTypeId: '' });
    } catch (error) {
      console.error('Error saving notification:', error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isAdmin) {
    return (
      <div className='container'>
        <h2>Уведомления</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="description">Описание:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="notificationTypeId">Тип уведомления:</label>
            <select
              id="notificationTypeId"
              name="notificationTypeId"
              value={formData.notificationTypeId}
              onChange={handleChange}
              className='dropdown-filter'
            >
              <option value="">Выберите тип уведомления</option>
              {notificationTypes.map(type => (
                <option key={type.id} value={type.id}>{type.title}</option>
              ))}
            </select>
            <button type="submit">Сохранить</button>

          </div>
        </form>
        
        <table>
          <thead>
            <tr>
            <th>Тип уведомления</th>
              <th>Описание</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(notification => (
              <tr key={notification.id || Math.random()}>
                <td>{notification.notificationName}</td>
                <td>{notification.description}</td>
                <td>{notification.createdDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div className='container'>
        <h2>Уведомления</h2>
        <h3>Список уведомлений</h3>
        <table>
          <thead>
            <tr>
              <th>Описание</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(notification => (
              <tr key={notification.id || Math.random()}>
                <td>{notification.description}</td>
                <td>{notification.createdDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default Notifications;
