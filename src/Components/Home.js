import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
      fetchRecentApplications();
      fetchRecentReviews();
  }, []);

  const fetchRecentApplications = async () => {
      try {
          const response = await Axios.get('http://localhost:8080/rest/applications/latest');
          setRecentApplications(response.data); // Предполагается, что сервер возвращает только последние 4 нарушения
      } catch (error) {
          console.error('Error fetching recent applications:', error.message);
      }
  };

  const fetchRecentReviews = async () => {
    try {
        const response = await Axios.get('http://localhost:8080/rest/reviews/latest');
        setRecentReviews(response.data); // Предполагается, что сервер возвращает только последние 4 нарушения
    } catch (error) {
        console.error('Error fetching recent applications:', error.message);
    }
};
  const renderApplications = () => {
  
      return recentApplications.map((application) => (
        <Link to={`/applications/${application.id}`} key={application.id} className="application-box">
          <img src={`http://localhost:8080/rest/attachments/download/applications/${application.id}`} alt={`Application ${application.id}`} />
          <div> Нарушение № {application.id}</div>
          <div>{application.title}</div>
        </Link>
      ));
    }
  
    const renderReviews = () => {
  
        return recentReviews.map((review) => (
          <Link to={`/reviews/${review.id}`} key={review.id} className="application-box">
            <img src={`http://localhost:8080/rest/attachments/download/reviews/${review.id}`} alt={`Review ${review.id}`} />
            <div>Отзыв №: {review.id}</div>
          </Link>
        ));
    };
  return (
      <div className="container">
          <h1>Недавние нарушения</h1>
          <div className="applications-list-container">
        {renderApplications()}
        </div>

        <h1>Недавние события</h1>
          <div className="applications-list-container">
        {renderReviews()}
      </div>
      </div>

  );
};

export default Home;
