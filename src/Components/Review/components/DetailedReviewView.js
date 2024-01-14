import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';

const DetailedReviewView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await Axios.get(`http://localhost:8080/rest/reviews/${id}`);
        setReview(response.data);

        // Request to get the attachment
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
  }, [id]);

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

  return (
    <div className='container'>
      <h2>Отзыв № {id}</h2>
      <p>Адрес: {review.locationAddress}</p>
      <p>Описание: {review.description}</p>
      <p>Статус: {review.statusName}</p>

      {attachmentUrl && (
        <div>
          <h3>Attachment</h3>
          <img src={attachmentUrl} alt={`Attachment for review ${id}`} />
        </div>
      )}

      <button type="button" className='button-red' onClick={handleDelete}>
        Delete
      </button>

      <Link to="/reviews">
        <button type="button" className='button-green'>
          Back
        </button>
      </Link>
      <Link to="/">
        <button type="button" className='button-green'>
          Home
        </button>
      </Link>
    </div>
  );
};

export default DetailedReviewView;
