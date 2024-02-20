import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import MapComponent from '../Applications/Component/MapComponent';
import Modal from '../../Components/Modal'; // Импортируем компонент модального окна

const Events = () => {
  const [events, setEvents] = useState([]);
  const [place, setPlace] = useState('');
  const [selectedCoordinate, setSelectedCoordinate] = useState({ lat: 0, lon: 0 });
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [userId, setUserId] = useState(0); // Установка userId по умолчанию
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    address: '',
    lat: 0,
    lon: 0,
    typeEventId: '',
    userId: 0, 
  });

  const [eventTypes, setEventTypes] = useState([]); 

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

  const handleCoordinateSelect = async ({ lat, lon }) => {
    setSelectedCoordinate({ lat, lon });
  
    try {
      const response = await Axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const address = response.data.display_name;
      setNewEvent({ ...newEvent, lat, lon, address }); // Обновляем новое событие с полученным адресом
    } catch (error) {
      console.error('Error fetching address:', error.message);
    }
  };
  
  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
  };

  const handleShowMapModal = () => {
    setIsMapModalOpen(true);
  };

  const handleSaveCoordinates = () => {
    setIsMapVisible(false);
    handleCloseMapModal();
  };

  useEffect(() => {
    fetchEventTypes(); 
  }, []);

  const fetchEventTypes = async () => {
    try {
      const eventTypeResponse = await Axios.get('http://localhost:8080/rest/common-reference/by-type/006');
      setEventTypes(eventTypeResponse.data);
    } catch (error) {
      console.error('Error fetching event types:', error.message);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.typeEventId || !newEvent.description || !newEvent.startDate || !newEvent.address ) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
  

    try {
      const response = await Axios.post('http://localhost:8080/rest/events/create', {
        ...newEvent,
        userId: userId // Включаем userId в теле запроса
      });
      setEvents([...events, response.data]);
      setNewEvent({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        address: '',
        lat: 0,
        lon: 0,
        typeEventId: '',
        userId: userId 
      });
      setPlace(''); // Сброс текста в поле address
    } catch (error) {
      console.error('Error creating event:', error.message);
    }
  };
  
  
  
  

  const isUserAuthenticated = sessionStorage.getItem("token") !== null;
  if (!isUserAuthenticated) {
  }

  return (
    <div className="container">
      <h2>События</h2>

      <div className="form-container">
        <div className="form-group">
          <label>Тип событи:</label>
          <select
            value={newEvent.typeEventId}
            className='dropdown-filter' 
            onChange={(e) => setNewEvent({ ...newEvent, typeEventId: e.target.value })} 
            required
          >
            <option value="">Выберите тип события</option>
            {eventTypes.map((typeEventId) => (
              <option key={typeEventId.id} value={typeEventId.id}>
                {typeEventId.title}
              </option>
            ))}
          </select>

          <label>Описание</label>
          <input
            type="text"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            required
          />

          <label>Адрес</label>
          <input type="text" disabled value={place} onChange={(e) => setPlace(e.target.value)} required />
          <button type="button" onClick={handleShowMapModal}>Указать адрес</button>

          {/* Модальное окно для карты */}
          <Modal isOpen={isMapModalOpen} onClose={handleCloseMapModal}>
            <div>
              <h2>Геопозиция</h2>
              <label>Долгота: {selectedCoordinate.lat} </label>
              <label>Широта: {selectedCoordinate.lon} </label>
              <input type="text" disabled value={place} onChange={(e) => setPlace(e.target.value)} required />
              <MapComponent onCoordinateSelect={handleCoordinateSelect} setPlace={setPlace} />
              <button type="button" onClick={handleSaveCoordinates}>Сохранить</button>
            </div>
          </Modal>
        </div>

        <div className="form-group">
          <label>Дата от</label>
          <input
            type="date"
            value={newEvent.startDate}
            onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
            required
          />

          <label>Дата по (необязательно)</label>
          <input
            type="date"
            value={newEvent.endDate}
            onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
          />
          <button onClick={handleCreateEvent}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default Events;
