import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

const Tests = () => {
  const [ticketNumbers, setTicketNumbers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicketNumbers = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/rest/tickets/uniqueNumbers');
        setTicketNumbers(response.data);
      } catch (error) {
        setError('Ошибка при загрузке номеров билетов');
      }
    };
    fetchTicketNumbers();
  }, []);



  return (
    <div className='container'>
      <h2>Тесты ПДД</h2>
      <div>
        <h3>Выберите номер билета:</h3>
        {error && <p>{error}</p>}
        {ticketNumbers.map(ticketNumber => (
          <Link 
            key={ticketNumber} 
            to={`/tickets/${ticketNumber}`} // Перенаправляем на страницу с вопросами для выбранного билета
            style={{ cursor: 'pointer', marginRight: '10px' }}
          >
            Билет {ticketNumber}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tests;
