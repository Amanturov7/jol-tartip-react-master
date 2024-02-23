import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import MapDetailedView from '../../Maps/MapDetailedView';

const DetailedApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [userData, setUserData] = useState(null);
  const handleGoBack = () => {
    // Использование объекта navigate для перехода назад
    navigate(-1);
  };
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await Axios.get(`https://jortartip.onrender.com/rest/applications/${id}`);
        setApplication(response.data);

        const attachmentResponse = await Axios.get(`https://jortartip.onrender.com/rest/attachments/download/applications/${id}`, {
          responseType: 'blob',
        });
        const blob = new Blob([attachmentResponse.data]);
        const url = URL.createObjectURL(blob);
        setAttachmentUrl(url);
      } catch (error) {
        console.error('Error fetching application:', error.message);
      }
    };

    fetchApplication();

   
    const token = sessionStorage.getItem('token');
    if (token) {
      Axios.defaults.headers.common['Authorization'] = token;

      // Отправляем запрос к серверу для получения данных о пользователе
      Axios.get('https://jortartip.onrender.com/rest/user/user', {
        params: { token: token }
      })
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.error('Ошибка при получении данных о пользователе:', error);
        });
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      await Axios.delete(`https://jortartip.onrender.com/rest/applications/delete/${id}`);
      navigate('/report');
    } catch (error) {
      console.error('Error deleting application:', error.message);
    }
  };

  const handleStatusAccept = async () => {
    try {
      await Axios.put(`https://jortartip.onrender.com/rest/applications/update/status/accept/${id}`);
      // Обновляем информацию о заявлении после изменения статуса
      const response = await Axios.get(`https://jortartip.onrender.com/rest/applications/${id}`);
      setApplication(response.data);
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  
  const handleStatusProtocol = async () => {
    try {
      await Axios.put(`https://jortartip.onrender.com/rest/applications/update/status/protocol/${id}`);
      // Обновляем информацию о заявлении после изменения статуса
      const response = await Axios.get(`https://jortartip.onrender.com/rest/applications/${id}`);
      setApplication(response.data);
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  if (!application) {
    return <div className='container'>Loading...</div>;
  }

  // Проверяем, является ли пользователь владельцем записи
  const isOwner = userData && userData.id === application.userId;

  // Проверяем роль пользователя
  const isEmployee = userData && userData.role === 'EMPLOYEE';

  return (
    <div className='container'>
      <div className='attributes'>
        <h2>Нарушение № {id}</h2>
        <p>Тип нарушения пдд: {application.title}</p>
        <p>Дата Нарушения: {application.dateOfViolation}</p>
        <p>Гос номер: {application.numberAuto}</p>
        <p>Описание: {application.description}</p>
        <p>Статус: {application.statusName}</p>
        <p>Адрес: {application.place}</p>
        <p>Дата создания заявления: {application.createdDate}</p>
      </div>

      <div className='img-box'>
        <img src={attachmentUrl} alt={`Attachment for application ${id}`} />
      </div>

      <MapDetailedView lat={application.lat} lon={application.lon} />

      {isOwner && (
        <button type="button" className='button-red' onClick={handleDelete}>
          Удалить
        </button>
      )}

      {isEmployee && application.statusName === 'Принят на рассмотрение' && (
        <button type="button" className='submit' onClick={handleStatusAccept}>
          Рассмотрение
        </button>
      )}

{isEmployee && application.statusName === 'На рассмотрении' && (
        <button type="button" className='submit' onClick={handleStatusProtocol}>
          Протокол
        </button>
      )}


  <button type="button" className='submit' onClick={handleGoBack}>
    Назад
  </button>

      <Link to="/">
        <button type="button" className='submit'>
          На главную
        </button>
      </Link>
    </div>
  );
};

export default DetailedApplicationView;
