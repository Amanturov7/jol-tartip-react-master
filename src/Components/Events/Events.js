import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import MapComponent from '../Applications/Component/MapComponent';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [place, setPlace] = useState('');
  const [selectedCoordinate, setSelectedCoordinate] = useState({ lat: 0, lon: 0 });
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    address: '',
    lat: 0,
    lon: 0,
    typeEventId: '', // Новое поле для типа события
  });

  const [eventTypes, setEventTypes] = useState([]); // Состояние для хранения типов событий

  const handleCoordinateSelect = ({ lat, lon }) => {
    setSelectedCoordinate({ lat, lon });
    setNewEvent({ ...newEvent, lat, lon, address: place });
    setPlace(place);
  };
  

  const handleShowMap = () => {
    setIsMapVisible(true);
  };

  const handleSaveCoordinates = () => {
    setIsMapVisible(false);
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
    try {
      const response = await Axios.post('http://localhost:8080/rest/events/create', newEvent);
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
      });
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
          <label>Title:</label>
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />

          <label>Description:</label>
          <input
            type="text"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />

          <label>Start Date:</label>
          <input
            type="date"
            value={newEvent.startDate}
            onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
          />

          <label>End Date:</label>
          <input
            type="date"
            value={newEvent.endDate}
            onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
          />

          <label>Тип события:</label>
          <select
            value={newEvent.typeEventId}
           className='dropdown-filter' onChange={(e) => setNewEvent({ ...newEvent, typeEventId: e.target.value })}
          >
            <option value="">Выберите тип события</option>
            {eventTypes.map((typeEventId) => (
              <option key={typeEventId.id} value={typeEventId.id}>
                {typeEventId.title}
              </option>
            ))}
          </select>

          <button onClick={handleCreateEvent}>Create Event</button>
        </div>

        <div className="form-group">
          <label>Адрес</label>
          <input type="text" disabled value={place} onChange={(e) => setPlace(e.target.value)} required />

          <label>Долгота: {selectedCoordinate.lat}</label>
          <label>Широта: {selectedCoordinate.lon}</label>
          {isMapVisible ? (
            <>
              <MapComponent onCoordinateSelect={handleCoordinateSelect} setPlace={setPlace} />
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
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Event Type</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>{event.startDate}</td>
              <td>{event.endDate}</td>
              <td>{event.typeEventName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Events;
