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
                  <button onClick={handleCreateEvent}>Create Event</button>

        </div>

        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
        </div>

      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>{event.startDate}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default Events;
