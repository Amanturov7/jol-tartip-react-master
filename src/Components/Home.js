import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import gosnomerImage from '../images/gosnomer.png';
import config from './Config';

const Home = () => {
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentApplications();
    fetchRecentReviews();
  }, []);

  const fetchRecentApplications = async () => {
    try {
      const response = await Axios.get(`${config.BASE_URL}/rest/applications/latest`);
      setRecentApplications(response.data);
    } catch (error) {
      console.error('Error fetching recent applications:', error.message);
    }
  };

  const fetchRecentReviews = async () => {
    try {
      const response = await Axios.get(`${config.BASE_URL}/rest/reviews/latest`);
      setRecentReviews(response.data);
    } catch (error) {
      console.error('Error fetching recent reviews:', error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async () => {
    try {
      const response = await Axios.get(`${config.BASE_URL}/rest/applications/by-gos-number?gosNumber=${searchQuery}`);
      const searchResults = response.data;
      if (searchResults.length > 0) {
        navigate(`/search-results/${searchQuery}`);
      } else {
        setErrorMessage('Нарушений нет! Ура!');
      }
    } catch (error) {
      console.error('Error fetching search results:', error.message);
    }
  };

  const renderApplications = () => {
    return recentApplications.map((application) => (
      <Link to={`/applications/${application.id}`} key={application.id} className="application-box">
        <img src={`${config.BASE_URL}/rest/attachments/download/applications/${application.id}`} alt={`Application ${application.id}`} />
        <div> Нарушение № {application.id}</div>
        <div>{application.title}</div>
      </Link>
    ));
  };

  const renderReviews = () => {
    return recentReviews.map((review) => (
      <Link to={`/reviews/${review.id}`} key={review.id} className="application-box">
        <img src={`${config.BASE_URL}/rest/attachments/download/reviews/${review.id}`} alt={`Review ${review.id}`} />
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
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className='submit' onClick={handleSearchSubmit}> Поиск </button>
        </div>
        <img src={gosnomerImage} alt="Gosnomer" className="gosnomer-image" /> <br />
        <p className="search-label">
          Автомобильные номера обычно изображаются на бортах автомобиля, на передней и задней сторонах машины
        </p>
      </div>

      {errorMessage && (
        <div className="success-message">
          {errorMessage}
        </div>
      )}

      <h2>Недавние нарушения</h2>
      <div className="applications-list-container">
        {renderApplications()}
      </div>

      <h2>Недавние отзывы</h2>
      <div className="applications-list-container">
        {renderReviews()}
      </div>
    </div>
  );
};

export default Home;
