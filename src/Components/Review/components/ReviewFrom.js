import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import MapComponent from '../../Applications/Component/MapComponent';
import Modal from '../../Modal';

const ReviewForm = () => {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [locationAddress, setLocationAddress] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState(0);
  const [reviewType, setReviewType] = useState('');
  const [options, setOptions] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCoordinate, setSelectedCoordinate] = useState({ lat: 0, lon: 0 });
  const [roadId, setRoadId] = useState(0);
  const [lightId, setLightId] = useState(0);
  const [roadSignId, setRoadSignId] = useState(0);
  const [ecologicFactorsId, setEcologicFactorsId] = useState(0);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const handleCoordinateSelect = ({ lat, lon }) => {
    setSelectedCoordinate({ lat, lon });
  };

  const handleShowMap = () => {
    setIsMapVisible(true);
  };

  const handleSaveCoordinates = () => {
    setIsMapVisible(false);
    handleCloseMapModal(); // Закрываем модальное окно после сохранения координат

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
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          const response = await Axios.get('http://localhost:8080/rest/user/user', {
            params: {
              'token': `${token}`
            }
          });
          setUserId(response.data.id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const allowedFileTypes = ['image/jpeg', 'image/png', 'video/mp4'];

      const fileType = selectedFile.type;

      if (allowedFileTypes.includes(fileType)) {
        setFile(selectedFile);
      } else {
        alert('Файл не поддерживается. Выберите jpeg, jpg, png, mp4');
        e.target.value = null;
        setFile(null);
      }
    }
  };

  useEffect(() => {
    if (options.length > 0) {
      setSelectedOption(options[0]);
    }
  }, [options]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Логика отправки формы
  };

  // Обработчик открытия модального окна для карты
  const handleShowMapModal = () => {
    setIsMapModalOpen(true);
  };

  // Обработчик закрытия модального окна для карты
  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
  };

  // Обработчик выбора координат на карте


  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Тип отзыва</label>
        <select value={reviewType} className="dropdown-filter" onChange={handleReviewTypeChange} required>
          <option value="">Выберите тип отзыва</option>
          <option value="Дорожный знак">Дорожный знак</option>
          <option value="Освещение">Освещение</option>
          <option value="Дорожные условия">Дорожные условия</option>
          <option value="Экологические факторы">Экологические факторы</option>
        </select>

        <label>Приложить Фото/Видео доказательство</label>
        <input type="file" onChange={handleFileChange} />
      </div>

   
      <div className="form-group">
        <label>Вид отзыва</label>
        <select
          value={selectedOption ? selectedOption.id : ''}
          className="dropdown-filter" onChange={(e) => setSelectedOption(options.find((opt) => opt.id === parseInt(e.target.value, 10)))}
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

        <label>Описание:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
  
      </div>
      <div className="form-group">
        <label>Адрес</label>
        <input type="text" disabled value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} required />
     
        <button type="button" onClick={handleShowMapModal}>Указать адрес</button>
        <button type="submit">Оставить отзыв</button>

      </div>

      <Modal isOpen={isMapModalOpen} onClose={handleCloseMapModal}>
  <div>
    <h2>Геопозиция</h2>
    <label>Долгота: {selectedCoordinate.lat} </label>
        <label>Широта: {selectedCoordinate.lon} </label>
    <MapComponent onCoordinateSelect={handleCoordinateSelect} setPlace={setLocationAddress} />
    <button type="button" onClick={handleSaveCoordinates}>Сохранить</button>
  </div>
</Modal>
    </form>
  );
};

export default ReviewForm;
