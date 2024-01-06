import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import MapComponent from '../Components/Applications/Component/MapComponent';

const ReviewForm = () => {
  // eslint-disable-next-line 
  const [lat, setLat] = useState(0);
  // eslint-disable-next-line 
  const [lon, setLon] = useState(0);
  const [locationAddress, setLocationAddress] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState(0);
  const [reviewType, setReviewType] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState({ lat: 0, lon: 0 });
  // eslint-disable-next-line 
  const [roadId, setRoadId] = useState(0);
  // eslint-disable-next-line 
  const [lightId, setLightId] = useState(0);
  // eslint-disable-next-line 
  const [roadSignId, setRoadSignId] = useState(0);
  // eslint-disable-next-line 
  const [ecologicFactorsId, setEcologicFactorsId] = useState(0);

  const handleCoordinateSelect = ({ lat, lon }) => {
    setSelectedCoordinate({ lat, lon });
  };

  const handleShowMap = () => {
    setIsMapVisible(true);
  };

  const handleSaveCoordinates = () => {
    setIsMapVisible(false);
  };

  const handleReviewTypeChange = (e) => {
    const type = e.target.value;
    setReviewType(type);

    Axios.get(`http://localhost:8080/rest/common-reference/by-type/${getTypeReferenceType(type)}`)
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching options:', error.message);
      });
  };

  const getTypeReferenceType = (type) => {
    switch (type) {
      case 'Дорожный знак':
        return '003';
      case 'Освещение':
        return '004';
      case 'Дорожные условия':
        return '005';
      case 'Экологические факторы':
        return '007';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (options.length > 0) {
      setSelectedOption(options[0]);
    }
  }, [options]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let reviewTypeFields;
    switch (reviewType) {
      case 'Дорожный знак':
        reviewTypeFields = { roadSignId: selectedOption.id };
        break;
      case 'Освещение':
        reviewTypeFields = { lightId: selectedOption.id };
        break;
      case 'Дорожные условия':
        reviewTypeFields = { roadId: selectedOption.id };
        break;
      case 'Экологические факторы':
        reviewTypeFields = { ecologicFactorsId: selectedOption.id };
        break;
      default:
        reviewTypeFields = {};
        break;
    }
  
    const newReview = {
      lat: selectedCoordinate.lat, 
      lon: selectedCoordinate.lon,  
      locationAddress,
      description,
      userId,
      reviewType,
      ...reviewTypeFields, 
    };
  
    try {
      const response = await Axios.post('http://localhost:8080/rest/reviews/create', { ...newReview, ...reviewTypeFields }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Review created:', response.data);
      setLat(0);
      setLon(0);
      setLocationAddress('');
      setDescription('');
      setUserId(0);
      setReviewType('');
      setOptions([]);
      setSelectedOption(null);
      setRoadId(0);
      setLightId(0);
      setRoadSignId(0);
      setEcologicFactorsId(0);
    } catch (error) {
      console.error('Error creating review:', error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Тип отзыва</label>
        <select value={reviewType} onChange={handleReviewTypeChange} required>
          <option value="">Выберите тип отзыва</option>
          <option value="Дорожный знак">Дорожный знак</option>
          <option value="Освещение">Освещение</option>
          <option value="Дорожные условия">Дорожные условия</option>
          <option value="Экологические факторы">Экологические факторы</option>
        </select>

        <label>Вид отзыва</label>
        <select
          value={selectedOption ? selectedOption.id : ''}
          onChange={(e) => setSelectedOption(options.find((opt) => opt.id === parseInt(e.target.value, 10)))}
          required
        >
          <option value="" disabled>
            Выберите вид
          </option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.title}
            </option>
          ))}
        </select>
        <div />

        <div className="form-group">
          <label>Адрес</label>

          <input type="text" disabled value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} required />

          <label>Долгота: {selectedCoordinate.lat} </label>
          <label>Широта: {selectedCoordinate.lon} </label>

          {isMapVisible ? (
            <>
              <MapComponent onCoordinateSelect={handleCoordinateSelect} setPlace={setLocationAddress} />
              <button type="button" onClick={handleSaveCoordinates}>
                Сохранить
              </button>
            </>
          ) : (
            <button type="button" onClick={handleShowMap}>
              Указать адрес
            </button>
          )}
        </div>

        <label>Описание:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>ID пользователя:</label>
        <input type="number" value={userId} onChange={(e) => setUserId(parseInt(e.target.value, 10))} required />


        <button type="submit">Оставить отзыв</button>
      </div>
    </form>
  );
};

export default ReviewForm;
