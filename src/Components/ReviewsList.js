import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/rest/reviews/all');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error.message);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="reviews-list">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Широта</th>
            <th>Долгота</th>
            <th>Адрес</th>
            <th>Описание</th>
            <th>ID пользователя</th>
            <th>ID дороги</th>
            <th>ID светофора</th>
            <th>ID дорожного знака</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.lat}</td>
              <td>{review.lon}</td>
              <td>{review.locationAddress}</td>
              <td>{review.description}</td>
              <td>{review.userId}</td>
              <td>{review.roadId}</td>
              <td>{review.lightId}</td>
              <td>{review.roadSignId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsList;
