import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import '../../../App.css'; // Import styles

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
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

  const renderReviews = () => {
 
      return reviews.map((review) => (
        <Link to={`/reviews/${review.id}`} key={review.id} className="application-box">
          <img src={`http://localhost:8080/rest/attachments/download/reviews/${review.id}`} alt={`Review ${review.id}`} />
          <div>Отзыв №: {review.id}</div>
        </Link>
      ));

  };

  return (
    <div>
      <div className="filters-container">
        <div className="filter">
          <input
            type="text"
            placeholder="Экологические факторы..."
            value={ecologicFactors}
            onChange={(e) => setEcologicFactors(e.target.value)}
          />
        </div>
        <div className="filter">
          <input
            type="text"
            placeholder="Дорожные знаки..."
            value={roadSign}
            onChange={(e) => setRoadSign(e.target.value)}
          />
        </div>
        <div className="filter">
          <input
            type="text"
            placeholder="Светофоры..."
            value={lights}
            onChange={(e) => setLights(e.target.value)}
          />
        </div>
      </div>

   
    

      <div className="applications-list-container">
        {renderReviews()}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page}  className="page"onClick={() => setPageNumber(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
