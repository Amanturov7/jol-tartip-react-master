import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import TicketForm from './components/TicketForm';
// import "../../Components/Tests/Tests.css"

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
      <TicketForm />
      <div>
        <br></br>
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
    </div>
  );
};

export default Tests;
