import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import MapDetailedView from '../../Maps/MapDetailedView';
import  config from '../../Config';

const DetailedApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [userData, setUserData] = useState(null);
  const handleGoBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await Axios.get(`${config.BASE_URL}/rest/applications/${id}`);
        setApplication(response.data);

        const attachmentResponse = await Axios.get(`${config.BASE_URL}/rest/attachments/download/applications/${id}`, {
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

      Axios.get(`${config.BASE_URL}/rest/user/user`, {
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
      await Axios.delete(`${config.BASE_URL}/rest/applications/delete/${id}`);
      navigate('/report');
    } catch (error) {
      console.error('Error deleting application:', error.message);
    }
  };

  const handleStatusAccept = async () => {
    try {
      await Axios.put(`${config.BASE_URL}/rest/applications/update/status/accept/${id}`);
      const response = await Axios.get(`${config.BASE_URL}/rest/applications/${id}`);
      setApplication(response.data);
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  
  const handleStatusProtocol = async () => {
    try {
      await Axios.put(`${config.BASE_URL}/rest/applications/update/status/protocol/${id}`);
      const response = await Axios.get(`${config.BASE_URL}/rest/applications/${id}`);
      setApplication(response.data);
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  if (!application) {
    return <div className='container'>Loading...</div>;
  }

  const isOwner = userData && userData.id === application.userId;

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
