import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import MapComponent from './MapComponent';
import Modal from '../../Modal';
import  config  from '../../Config';

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
    // eslint-disable-next-line 
  const [regions, setRegions] = useState([]);
    // eslint-disable-next-line 
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState({ lat: 0, lon: 0 });
    // eslint-disable-next-line 
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await Axios.get(`${config.BASE_URL}/rest/common-reference/by-type/001`);
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
        const response = await Axios.get(`${config.BASE_URL}/rest/violations/all`);
        setViolationsList(response.data);
      } catch (error) {
        console.error('Error fetching violations:', error.message);
      }
    };

    fetchViolations();
  }, []);

  useEffect(() => {
    const fetchDistrictsByRegionId = async () => {
      try {
        const response = await Axios.get(`${config.BASE_URL}/rest/common-reference/parent/${regionId}`);
        setFilteredDistricts(response.data);
      } catch (error) {
        console.error('Error fetching districts:', error.message);
      }
    };

    if (regionId) {
      fetchDistrictsByRegionId();
    }
  }, [regionId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          const response = await Axios.get(`${config.BASE_URL}/rest/user/user`, {
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
      const allowedFileTypes = ['image/jpeg', 'image/jpg','image/png'];
      const fileType = selectedFile.type;

      if (allowedFileTypes.includes(fileType)) {
        setFile(selectedFile);
      } else {
        alert('Файл не поддерживается. Выберите jpeg, jpg, png');
        e.target.value = null;
        setFile(null);
      }
    }
  };

  const handleShowMapModal = () => {
    setIsMapModalOpen(true);
  };

  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
  };

  const handleCoordinateSelect = ({ lat, lon }) => {
    setSelectedCoordinate({ lat, lon });
  };

  const handleSaveCoordinates = () => {
    setIsMapVisible(false);
    handleCloseMapModal(); 

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Пожалуйста выберите файл');
      return;
    }

    if (!place) {
      alert('Пожалуйста, укажите адрес перед сохранением заявки');
      return;
    }

    if (!userId) {
      console.error('Пользователь не авторизован');
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
        `${config.BASE_URL}/rest/applications/create`,
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
          userId: userId,
          applicationsId: applicationResponse.data.id,
        })
      );

      await Axios.post(`${config.BASE_URL}/rest/attachments/upload`, formData, {
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
   
        <label>Тип нарушения</label>
        <select value={typeViolationsId} className="dropdown-filter" onChange={(e) => setTypeViolationsId(e.target.value)} required>
          <option value="">Выберите тип нарушения</option>
          {violationsList.map((violation) => (
            <option key={violation.id} value={violation.id}>
              {violation.title}
            </option>
          ))}
        </select>
        <label>Гос номер</label>
        <input 
  type="text" 
  value={numberAuto} 
  onChange={(e) => setNumberAuto(e.target.value.toUpperCase())} 
  required 
/>


      
      </div>
      <div className="form-group">
        <label>Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        <label>Дата нарушения</label>
        <input type="date" value={dateOfViolation} onChange={(e) => setDateOfViolation(e.target.value)} required />

      </div>
      <div className="form-group">
        <label>Адрес</label>
        <input type="text" disabled value={place} onChange={(e) => setPlace(e.target.value)} required />
        <button type="button" onClick={handleShowMapModal}>Указать адрес</button>

        <label>Приложить фото доказательство</label>
        <input type="file" onChange={handleFileChange} />

        <button type="submut">Сохранить</button>


      </div>


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
    </form>
  );
};

export default ApplicationForm;
