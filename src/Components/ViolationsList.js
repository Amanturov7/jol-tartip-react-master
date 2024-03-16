import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"
const ViolationsList = () => {
  const [violations, setViolations] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); 

  const [title, setTitle] = useState('');
  const [statya, setStatya] = useState('');
  const [part, setPart] = useState('');
  const [description, setDescription] = useState('');
  const [costFiz, setCostFiz] = useState('');
  const [costUr, setCostUr] = useState('');
  const [organId, setOrganId] = useState('');

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await axios.get('http://localhost:8080/rest/violations/all');
        setViolations(response.data);
      } catch (error) {
        console.error('Error fetching violations:', error.message);
      }
    };

    fetchViolations();

    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:8080/rest/user/user', {
            params: {
              'token': `${token}`
            }
          });

          const userData = response.data;

          if (userData.role === 'SUPER_ADMIN') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        const response = await axios.post('http://localhost:8080/rest/violations/create', {
          title,
          statya,
          part,
          description,
          costFiz,
          costUr,
          organId
        }, {
          headers: {
            'Authorization': token
          }
        });

        console.log('Нарушение успешно создано:', response.data);
      }
    } catch (error) {
      console.error('Ошибка при создании нарушения:', error.message);
    }
  };

  return (
    <div className='container'>
      <h2>Список штрафов ПДД</h2>
      {isAdmin && (
        <div>

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">

              <label>Наименование</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
  
              <label>Статья</label>
              <input type="text"  onKeyPress={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }}value={statya} onChange={(e) => setStatya(e.target.value)} required />
         
              <label>Часть</label>
              <input type="text" onKeyPress={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }} value={part} onChange={(e) => setPart(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Описание</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Цена физ. лицо</label>
              <input type="text" onKeyPress={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }} value={costFiz} onChange={(e) => setCostFiz(e.target.value)} required />
          
              <label>Цена юр. лицо</label>
              <input type="text"  onKeyPress={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }} value={costUr} onChange={(e) => setCostUr(e.target.value)} required />
              <button type="submit">Создать</button>

            </div>
          </form>

  
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Статья</th>
            <th>Часть</th>
            <th>Описание</th>
            <th>Цена физ. лицо</th>
            <th>Цена юр. лицо</th>
          </tr>
        </thead>
        <tbody>
          {violations.map((violation) => (
            <tr key={violation.id}>
              <td className='table-title'>{violation.title}</td>
              <td>{violation.statya}</td>
              <td>{violation.part}</td>
              <td>{violation.description}</td>
              <td>{violation.costFiz}</td>
              <td>{violation.costUr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViolationsList;
