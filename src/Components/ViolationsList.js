import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const ViolationsList = () => {
  const [violations, setViolations] = useState([]);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/rest/violations/all');
        setViolations(response.data);
      } catch (error) {
        console.error('Error fetching violations:', error.message);
      }
    };

    fetchViolations();
  }, []);

  return (
    <div className='container'>
      <h2>Список штрафов ПДД</h2>
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
              <td>{violation.title}</td>
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
