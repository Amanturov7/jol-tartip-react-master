import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import TicketForm from './components/TicketForm';
import config from '../Config'
// import "../../Components/Tests/Tests.css"

const isAuthenticated = () => {
  const accessToken = sessionStorage.getItem('token');
  return accessToken !== null && accessToken !== undefined;
};

const Tests = () => {
  const [ticketNumbers, setTicketNumbers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicketNumbers = async () => {
      try {
        const response = await Axios.get(`${config.BASE_URL}/rest/tickets/uniqueNumbers`);
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
      {isAuthenticated() ? (
        <>
          <TicketForm />
          <div>
            <br />
            {error && <p>{error}</p>}
            {ticketNumbers.map(ticketNumber => (
              <Link
                key={ticketNumber}
                to={`/tickets/${ticketNumber}`}
                className='blue-button'
                style={{ cursor: 'pointer', marginRight: '10px' }}
              >
                <button type="submit">Билет {ticketNumber}</button>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div>
          <br />
          {error && <p>{error}</p>}
          {ticketNumbers.map(ticketNumber => (
            <Link
              key={ticketNumber}
              to={`/tickets/${ticketNumber}`}
              className='blue-button'
              style={{ cursor: 'pointer', marginRight: '10px' }}
            >
              <button type="submit">Билет {ticketNumber}</button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tests;
