// ApplicationForm.jsx
import React, { useState } from 'react';
import Axios from 'axios';
const ApplicationForm = ({ onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [place, setPlace] = useState('');
  const [lon, setLon] = useState(0);
  const [lat, setLat] = useState(0);
  const [status, setStatus] = useState(0);
  const [regionId, setRegionId] = useState(0);
  const [districtId, setDistrictId] = useState(0);
  const [typeViolationsId, setTypeViolationsId] = useState(0);
  const [userId, setUserId] = useState(0);
  const [createdDate, setCreatedDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newApplication = {
      title,
      description,
      place,
      lon,
      lat,
      status,
      regionId,
      districtId,
      typeViolationsId,
      userId,
      createdDate,
    };

    try {
      const response = await Axios.post('http://localhost:8080/rest/applications/create', newApplication, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Application created:', response.data);
      onCancel();
      setTitle('');
      setDescription('');
      setPlace('');
      setLon(0);
      setLat(0);
      setStatus(0);
      setRegionId(0);
      setDistrictId(0);
      setTypeViolationsId(0);
      setUserId(0);
      setCreatedDate('');
    } catch (error) {
      console.error('Error creating application:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button type="submit">Заявить</button>

      </div>
      <div className="form-group">
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
    
      </div>
      <div className="form-group">
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setPlace(e.target.value)} required />
        
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
    
      </div>
    </form>
  );
};

export default ApplicationForm;
