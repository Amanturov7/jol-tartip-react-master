import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import MapComponent from './MapComponent';

const ApplicationForm = ({ onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [place, setPlace] = useState('');
  const [status, setStatus] = useState('');
  const [regionId, setRegionId] = useState('');
  const [dateOfViolation, setDateOfViolation] = useState('');
  const [numberAuto, setNumberAuto] = useState('');
  const [file, setFile] = useState(null);
  const [districtId, setDistrictId] = useState('');
  const [typeViolationsId, setTypeViolationsId] = useState('');
  const [userId, setUserId] = useState(1);
  const [violationsList, setViolationsList] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState({ lat: 0, lon: 0 });
  const [isMapVisible, setIsMapVisible] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/rest/common-reference/by-type/001');
        setRegions(response.data);
      } catch (error) {
        console.error('Error fetching regions:', error.message);
      }
    };

    fetchRegions();
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

  useEffect(() => {
    // Фильтруем районы по выбранной области
    const fetchDistrictsByRegionId = async () => {
      try {
        const response = await Axios.get(`http://localhost:8080/rest/common-reference/parent/${regionId}`);
        setFilteredDistricts(response.data);
      } catch (error) {
        console.error('Error fetching districts:', error.message);
      }
    };

    if (regionId) {
      fetchDistrictsByRegionId();
    }
  }, [regionId]);

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

  const handleCoordinateSelect = ({ lat, lon }) => {
    setSelectedCoordinate({ lat, lon });
  };

  const handleShowMap = () => {
    setIsMapVisible(true);
  };

  const handleSaveCoordinates = () => {
    setIsMapVisible(false);
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
      lat: selectedCoordinate.lat,
      lon: selectedCoordinate.lon,
      status,
      dateOfViolation,
      regionId,
      districtId,
      typeViolationsId,
      userId,
      numberAuto
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

      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'dto',
        JSON.stringify({
          type: 'application',
          originName: file ? file.name : '',
          description: 'File description',
          userId: 1,
          applicationsId: applicationResponse.data.id,
        })
      );

      await Axios.post('http://localhost:8080/rest/attachments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onCancel();
      setTitle('');
      setDescription('');
      setPlace('');
      setDateOfViolation('')
      setSelectedCoordinate({ lat: 0, lon: 0 });
      setStatus(0);
      setRegionId(0);
      setNumberAuto('')
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

        <label>Область</label>
        <select value={regionId} className='dropdown-filter' onChange={(e) => setRegionId(e.target.value)} required>
          <option value="">Выберите область</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.title}
            </option>
          ))}
        </select>

        <label>Район</label>
        <select value={districtId} className="dropdown-filter" onChange={(e) => setDistrictId(e.target.value)} required>
          <option value="">Выберите район</option>
          {filteredDistricts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.title}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Дата нарушения</label>
        <input type="date" onChange={(e) => setDateOfViolation(e.target.value)} required />

        <label>Гос номер </label>
        <input type="text" style={{textTransform: "uppercase"}} onChange={(e) => setNumberAuto(e.target.value)} required />

        <label>Тип нарушения</label>
        <select value={typeViolationsId} className="dropdown-filter" onChange={(e) => setTypeViolationsId(e.target.value)} required>
          <option value="">Выберите тип нарушения</option>
          {violationsList.map((violation) => (
            <option key={violation.id} value={violation.id}>
              {violation.title}
            </option>
          ))}
        </select>

        <label>Приложить Фото/Видео доказательство</label>
        <input type="file" onChange={handleFileChange} />
      </div>

      <div className="form-group">
        <label>Адрес</label>
        <input type="text" disabled value={place} onChange={(e) => setPlace(e.target.value)} required />

        <label>Долгота: {selectedCoordinate.lat}</label>
        <label>Широта: {selectedCoordinate.lon}</label>
        {isMapVisible ? (
          <>
            <MapComponent onCoordinateSelect={handleCoordinateSelect} setPlace={setPlace} />
            <button type="button" onClick={handleSaveCoordinates}>Сохранить</button>
          </>
        ) : (
          <button type="button" onClick={handleShowMap}>Указать адрес</button>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ApplicationForm;
