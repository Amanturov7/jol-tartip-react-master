import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import TicketForm from './components/TicketForm';
import TicketQuestions from './components/TestQuestion';

const Tests = () => {
  const [ticketNumbers, setTicketNumbers] = useState([]);
  const [selectedTicketNumber, setSelectedTicketNumber] = useState('');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchQuestionsByNumber = async () => {
      if (!selectedTicketNumber) return; // Если номер билета не выбран, не делаем запрос
      try {
        const response = await Axios.get(`http://localhost:8080/rest/tickets/byNumber/${selectedTicketNumber}`);
        setQuestions(response.data); // Сохраняем вопросы в состоянии компонента
      } catch (error) {
        setError('Ошибка при загрузке вопросов');
      }
    };
    fetchQuestionsByNumber();
  }, [selectedTicketNumber]);

  const handleTicketNumberClick = (ticketNumber) => {
    setSelectedTicketNumber(ticketNumber);
    navigate(`/tickets/${ticketNumber}`);
  };

  return (
    <div className='container'>
      <TicketForm />
      <h2>Тесты ПДД</h2>
      <div>
        <h3>Выберите номер билета:</h3>
        {error && <p>{error}</p>}
        {ticketNumbers.map(ticketNumber => (
          <div 
            key={ticketNumber} 
            onClick={() => handleTicketNumberClick(ticketNumber)}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          >
            Билет {ticketNumber}
          </div>
        ))}
      </div>
 
      {/* Проверяем, выбран ли билет, прежде чем отображать вопросы */}
      {selectedTicketNumber && (
        <TicketQuestions selectedTicketNumber={selectedTicketNumber} />
      )}
    </div>
  );
};

export default Tests;
