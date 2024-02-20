import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import gosnomerImage from '../images/gosnomer.png';

const Home = () => {
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
      fetchRecentApplications();
      fetchRecentReviews();
  }, []);

  const fetchRecentApplications = async () => {
      try {
          const response = await Axios.get('http://localhost:8080/rest/applications/latest');
          setRecentApplications(response.data);
      } catch (error) {
          console.error('Error fetching recent applications:', error.message);
      }
  };

  const fetchRecentReviews = async () => {
    try {
        const response = await Axios.get('http://localhost:8080/rest/reviews/latest');
        setRecentReviews(response.data);
    } catch (error) {
        console.error('Error fetching recent applications:', error.message);
    }
};

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const renderApplications = () => {
      return recentApplications.map((application) => (
        <Link to={`/applications/${application.id}`} key={application.id} className="application-box">
          <img src={`http://localhost:8080/rest/attachments/download/applications/${application.id}`} alt={`Application ${application.id}`} />
          <div> Нарушение № {application.id}</div>
          <div>{application.title}</div>
        </Link>
      ));
  };

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
      <h2>Проверка нарушений по Гос номеру в системе Jol Tartip</h2>

      <div className="search-container">
        
      <div className="search-content">
          <input
            type="text"
            placeholder="01kg777aaa"
            className="search-input"
          />
                  <button className='submit'> Поиск </button>

        </div>
        <img src={gosnomerImage} alt="Gosnomer" className="gosnomer-image" /> <br></br>

        <p className="search-label">
        Автомобильные номера обычно изображаются на бортах автомобиля, на передней и задней сторонах машины</p>

      </div>


      <h2>Недавние нарушения</h2>
      <div className="applications-list-container">
        {renderApplications()}
      </div>

      <h2>Недавние события</h2>
      <div className="applications-list-container">
        {renderReviews()}
      </div>

    
    </div>
  );
};

export default Home;
