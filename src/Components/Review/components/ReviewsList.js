import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faList, faSearch } from '@fortawesome/free-solid-svg-icons';
// import '../../../App.css'; // Import styles
// import './ApplicationList.css'; // Import specific styles for ApplicationList

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [isGridMode, setIsGridMode] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [ecologicFactors, setEcologicFactors] = useState('');
  const [roadSign, setRoadSign] = useState('');
  const [lights, setLights] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [pageNumber, ecologicFactors, roadSign, lights]);

  const fetchReviews = async () => {
    try {
      let url = `http://localhost:8080/rest/reviews/all?page=${pageNumber}`;

      if (ecologicFactors) {
        url += `&ecologicFactorsId=${ecologicFactors}`;
      }

      if (roadSign) {
        url += `&roadSignId=${roadSign}`;
      }

      if (lights) {
        url += `&lightsId=${lights}`;
      }

      const response = await Axios.get(url);
      setReviews(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
    }
  };

  const toggleViewMode = () => {
    setIsGridMode(!isGridMode);
  };

  const renderReviews = () => {
    if (isGridMode) {
      return reviews.map((review) => (
        <Link to={`/reviews/${review.id}`} key={review.id} className="application-box">
          <img src={`http://localhost:8080/rest/attachments/download/reviews/${review.id}`} alt={`Review ${review.id}`} />
          <div>Отзыв №: {review.id}</div>
        </Link>
      ));
    } else {
      return (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Latitude</th>
              {/* Other table headers based on your Review model */}
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>{review.lat}</td>
                {/* Other table data based on your Review model */}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div>
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} />
      </div>
      <div>
        <input
          type="text"
          placeholder="Экологические факторы..."
          value={ecologicFactors}
          onChange={(e) => setEcologicFactors(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Дорожные знаки..."
          value={roadSign}
          onChange={(e) => setRoadSign(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Светофоры..."
          value={lights}
          onChange={(e) => setLights(e.target.value)}
        />
      </div>
      <button
        onClick={() => {
          fetchReviews();
          setPageNumber(1);
          toggleViewMode();
        }}
        className="view-mode-toggle"
      >
        {isGridMode ? <FontAwesomeIcon icon={faList} /> : <FontAwesomeIcon icon={faTh} />}
        {isGridMode ? 'Switch to Table View' : 'Switch to Grid View'}
      </button>

      {/* Render reviews using the same structure as ApplicationsList */}
      <div className="applications-list-container">
        {renderReviews()}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page} onClick={() => setPageNumber(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
