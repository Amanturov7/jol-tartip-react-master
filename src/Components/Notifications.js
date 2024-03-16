import React, { useEffect, useState } from 'react';
import Axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/rest/notifications/all');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error.message);
      }
    };

    fetchApplications();
  }, []);
  return (
    <div className='container'>
      <h2>Уведомления</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Описание</th>
            <th>Дата создания</th>
       
          </tr>
        </thead>
        <tbody>
        {notifications.map(notification => (
   <tr key={notification.id || Math.random()}>
    <td>{notification.id}</td>
    <td>{notification.description}</td>
    <td>{notification.createdDate}</td>
  </tr>
))}


        </tbody>
      </table>
    </div>
  );
};

export default Notifications;
