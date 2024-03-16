import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import MapDetailedView from '../../Maps/MapDetailedView';

const DetailedReviewView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [userData, setUserData] = useState(null); 
  const handleGoBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await Axios.get(`http://localhost:8080/rest/reviews/${id}`);
        setReview(response.data);

        const attachmentResponse = await Axios.get(`http://localhost:8080/rest/attachments/download/reviews/${id}`, {
          responseType: 'blob',
        });
        const blob = new Blob([attachmentResponse.data]);
        const url = URL.createObjectURL(blob);
        setAttachmentUrl(url);
      } catch (error) {
        console.error('Error fetching review:', error.message);
      }
    };

    fetchReview();

    const token = sessionStorage.getItem('token');
    if (token) {
      Axios.defaults.headers.common['Authorization'] = token;
      Axios.get('http://localhost:8080/rest/user/user', {
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


  const handleStatusAccept = async () => {
    try {
      await Axios.put(`http://localhost:8080/rest/reviews/update/status/accept/${id}`);
      const response = await Axios.get(`http://localhost:8080/rest/reviews/${id}`);
      setReview(response.data);
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  
  const handleStatusProtocol = async () => {
    try {
      await Axios.put(`http://localhost:8080/rest/reviews/update/status/protocol/${id}`);
      const response = await Axios.get(`http://localhost:8080/rest/reviews/${id}`);
      setReview(response.data);
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await Axios.delete(`http://localhost:8080/rest/reviews/delete/${id}`);
      navigate('/reviews'); 
    } catch (error) {
      console.error('Error deleting review:', error.message);
    }
  };

  if (!review) {
    return <div className='container'>Loading...</div>;
  }

  const isOwner = userData && userData.id === review.userId;


    const isEmployee = userData && userData.role === 'EMPLOYEE';

  return (
    <div className='container'>
         <h2>Отзыв № {id}</h2>
        <p>Тип нарушения пдд: {review.title}</p>
        <p>Дата Нарушения: {review.dateOfViolation}</p>
        <p>Описание: {review.description}</p>
        <p>Статус: {review.statusName}</p>
        <p>Адрес: {review.locationAddress}</p>
        <p>Дата создания заявления: {review.createdDate}</p>
      {attachmentUrl && (
        <div className='img-box'>
          <img src={attachmentUrl} alt={`Attachment for review ${id}`} />
        </div>
      )}
      <MapDetailedView lat={review.lat} lon={review.lon} />

      {isOwner && (
        <button type="button" className='button-red' onClick={handleDelete}>
          Удалить
        </button>
      )}
            {isEmployee && review.statusName === 'Принят на рассмотрение' && (
        <button type="button" className='submit' onClick={handleStatusAccept}>
          Рассмотрение
        </button>
      )}

{isEmployee && review.statusName === 'На рассмотрении' && (
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

export default DetailedReviewView;
