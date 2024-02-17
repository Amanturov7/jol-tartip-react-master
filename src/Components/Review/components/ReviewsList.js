import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

import '../../../App.css'; // Импорт стилей

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [ecologicFactors, setEcologicFactors] = useState([]);
  const [roadSigns, setRoadSigns] = useState([]);
  const [lights, setLights] = useState([]);
  const [roads, setRoads] = useState([]);
  const [selectedEcologicFactor, setSelectedEcologicFactor] = useState('');
  const [selectedRoadSign, setSelectedRoadSign] = useState('');
  const [selectedLight, setSelectedLight] = useState('');
  const [selectedRoad, setSelectedRoad] = useState('');

  useEffect(() => {
    fetchReviews();
    fetchFilterOptions();
  }, [pageNumber, selectedEcologicFactor, selectedRoadSign, selectedLight, selectedRoad]);

  const fetchReviews = async () => {
    try {
      let url = `http://localhost:8080/rest/reviews/all?page=${pageNumber}`;

      if (selectedEcologicFactor) {
        url += `&ecologicFactorId=${selectedEcologicFactor}`;
      }

      if (selectedRoadSign) {
        url += `&roadSignId=${selectedRoadSign}`;
      }

      if (selectedLight) {
        url += `&lightId=${selectedLight}`;
      }

      if (selectedRoad) {
        url += `&roadId=${selectedRoad}`;
      }

      const response = await Axios.get(url);
      setReviews(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Ошибка при получении отзывов:', error.message);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const ecologicFactorsResponse = await Axios.get('http://localhost:8080/rest/common-reference/by-type/007');
      setEcologicFactors(ecologicFactorsResponse.data);

      const roadSignsResponse = await Axios.get('http://localhost:8080/rest/common-reference/by-type/003');
      setRoadSigns(roadSignsResponse.data);

      const lightsResponse = await Axios.get('http://localhost:8080/rest/common-reference/by-type/004');
      setLights(lightsResponse.data);

      const roadsResponse = await Axios.get('http://localhost:8080/rest/common-reference/by-type/005');
      setRoads(roadsResponse.data);
    } catch (error) {
      console.error('Ошибка при получении списков:', error.message);
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
          <select value={selectedEcologicFactor} className='dropdown-filter' onChange={(e) => setSelectedEcologicFactor(e.target.value)}>
            <option value="">Выберите экологический фактор</option>
            {ecologicFactors.map((factor) => (
              <option key={factor.id} value={factor.id}>{factor.title}</option>
            ))}
          </select>
        </div>
        <div className="filter">
          <select value={selectedRoadSign}  className='dropdown-filter' onChange={(e) => setSelectedRoadSign(e.target.value)}>
            <option value=""> Выберите дорожный знак</option>
            {roadSigns.map((sign) => (
              <option key={sign.id} value={sign.id}>{sign.title}</option>
            ))}
          </select>
        </div>
        <div className="filter">
          <select value={selectedLight} className='dropdown-filter' onChange={(e) => setSelectedLight(e.target.value)}>
            <option value=""> Выберите освещение</option>
            {lights.map((light) => (
              <option key={light.id} value={light.id}>{light.title}</option>
            ))}
          </select>
        </div>
        <div className="filter">
          <select value={selectedRoad} className='dropdown-filter' onChange={(e) => setSelectedRoad(e.target.value)}>
            <option value=""> Выберите дорожнное условие</option>
            {roads.map((road) => (
              <option key={road.id} value={road.id}>{road.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="applications-list-container">
        {renderReviews()}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page} className="page" onClick={() => setPageNumber(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
