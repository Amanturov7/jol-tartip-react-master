// ApplicationForm.jsx
import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const ApplicationForm = ({ onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [place, setPlace] = useState('');
  const [lon, setLon] = useState('');
  const [lat, setLat] = useState('');
  const [status, setStatus] = useState('');
  const [regionId, setRegionId] = useState('');
  const [file, setFile] = useState(null);
  const [districtId, setDistrictId] = useState('');
  const [typeViolationsId, setTypeViolationsId] = useState('');
  const [userId, setUserId] = useState(1);
  const [violationsList, setViolationsList] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchRegionsAndDistricts = async () => {
      try {
        const regionsResponse = await Axios.get('http://localhost:8080/rest/common-reference/by-type/001');
        const districtsResponse = await Axios.get('http://localhost:8080/rest/common-reference/by-type/002');
  
        console.log('Regions response:', regionsResponse.data);
        console.log('Districts response:', districtsResponse.data);
  
        setRegions(regionsResponse.data);
        setDistricts(districtsResponse.data);
      } catch (error) {
        console.error('Error fetching regions and districts:', error.message);
      }
    };
  
    fetchRegionsAndDistricts();
  }, []);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/rest/violations/all');
        setViolationsList(response.data);
      } catch (error) {
        console.error('Error fetching violations:', error.message);
      }
    };

    fetchViolations();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
  
    // Check if a file is selected
    if (selectedFile) {
      // Check if the file type is supported (for example, allow only images)
      const allowedFileTypes = ['image/jpeg', 'image/png']; // Add or modify allowed file types
  
      // Get the actual file type
      const fileType = selectedFile.type;
  
      if (allowedFileTypes.includes(fileType)) {
        setFile(selectedFile);
      } else {
        alert('Файл не поддерживается. Выберите jpeg, jpg, png, mp4'); // You can replace this with a more user-friendly notification
        e.target.value = null; // Clear the input field
        setFile(null);
      }
    }
  };
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file.'); 
      return;
    }
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
    };
  
    try {
      const applicationResponse = await Axios.post(
        'http://localhost:8080/rest/applications/create',
        newApplication,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Application created:', applicationResponse.data);
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dto', JSON.stringify({
        type: 'application',
        originName: file ? file.name : '',
        description: 'File description',  
        userId: 1,  
        applicationsId: applicationResponse.data.id,
      }));
  
      await Axios.post('http://localhost:8080/rest/attachments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      onCancel();
      // Reset form fields
      setTitle('');
      setDescription('');
      setPlace('');
      setLon('');
      setLat('');
      setStatus(0);
      setRegionId(0);
      setDistrictId(0);
      setTypeViolationsId(0);
      setUserId(0);
      setFile(null);
    } catch (error) {
      console.error('Error creating application:', error.message);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>Адрес</label>
        <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} required />

        <label>Область</label>
        <select value={regionId} onChange={(e) => setRegionId(e.target.value)} required>
          <option value="">Выберите область</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.title}
            </option>
          ))}
        </select>

        <label>Район</label>
        <select value={districtId} onChange={(e) => setDistrictId(e.target.value)} required>
          <option value="">Выберите район</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.title}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        {/* <label>Longitude:</label>
        <input type="number" value={lon} onChange={(e) => setLon(e.target.value)}  />

        <label>Latitude:</label>
        <input type="number" value={lat} onChange={(e) => setLat(e.target.value)}  /> */}

        <label>Тип нарушения</label>
        <select value={typeViolationsId} onChange={(e) => setTypeViolationsId(e.target.value)} required>
          <option value="">Выберите тип нарушения </option>
          {violationsList.map((violation) => (
            <option key={violation.id} value={violation.id}>
              {violation.title}
            </option>
          ))}
        </select>

        <label>Приложить Фото/Видео доказательство</label>
        <input type="file" onChange={handleFileChange} />

        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default ApplicationForm;
