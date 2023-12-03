import React, { useState, useEffect } from 'react';
import Axios from 'axios';
const Events = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await Axios.get('http://localhost:8080/rest/events/all');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error.message);
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
      });
    } catch (error) {
      console.error('Error creating event:', error.message);
    }
  };

  return (
    <div className='container'>
      <h2>События</h2>

      <div className="form-container">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={newEvent.startDate}
            onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            value={newEvent.endDate}
            onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
          />
        </div>

        <button onClick={handleCreateEvent}>Create Event</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>{event.startDate}</td>
              <td>{event.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default Events;
