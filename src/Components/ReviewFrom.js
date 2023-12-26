import React, { useState } from 'react';
import Axios from 'axios';

const ReviewForm = () => {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [locationAddress, setLocationAddress] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState(0);
  const [roadId, setRoadId] = useState(0);
  const [lightId, setLightId] = useState(0);
  const [roadSignId, setRoadSignId] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      lat,
      lon,
      locationAddress,
      description,
      userId,
      roadId,
      lightId,
      roadSignId,
    };

    try {
      const response = await Axios.post('http://localhost:8080/rest/reviews/create', newReview, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Review created:', response.data);
      // Reset form fields if needed
      setLat(0);
      setLon(0);
      setLocationAddress('');
      setDescription('');
      setUserId(0);
      setRoadId(0);
      setLightId(0);
      setRoadSignId(0);
    } catch (error) {
      console.error('Error creating review:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Широта:</label>
        <input type="number" value={lat} onChange={(e) => setLat(parseFloat(e.target.value))} required />

        <label>Долгота:</label>
        <input type="number" value={lon} onChange={(e) => setLon(parseFloat(e.target.value))} required />

        <label>Адрес:</label>
        <input type="text" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} required />

        <label>Описание:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>ID пользователя:</label>
        <input type="number" value={userId} onChange={(e) => setUserId(parseInt(e.target.value, 10))} required />

        <label>ID дороги:</label>
        <input type="number" value={roadId} onChange={(e) => setRoadId(parseInt(e.target.value, 10))} required />

        <label>ID светофора:</label>
        <input type="number" value={lightId} onChange={(e) => setLightId(parseInt(e.target.value, 10))} required />

        <label>ID дорожного знака:</label>
        <input type="number" value={roadSignId} onChange={(e) => setRoadSignId(parseInt(e.target.value, 10))} required />

        <button type="submit">Оставить отзыв</button>
      </div>
    </form>
  );
};

export default ReviewForm;
