import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';

const TicketQuestions = () => {
  const { ticketNumber } = useParams();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestionsByNumber = async () => {
      try {
        const response = await Axios.get(`http://localhost:8080/rest/tickets/byNumber/${ticketNumber}`);
        setQuestions(response.data);
      } catch (error) {
        setError('Ошибка при загрузке вопросов');
      }
    };
    fetchQuestionsByNumber();
  }, [ticketNumber]);

  return (
    <div className='container'>
      <h2>Вопросы для билета №{ticketNumber}</h2>
      {error && <p>{error}</p>}
      <div>
        {questions.map(question => (
          <div key={question.id}>
            <h3>Вопрос {question.id}</h3>
            <p>{question.question}</p>
            <ul>
              <li>{question.option1}</li>
              <li>{question.option2}</li>
              <li>{question.option3}</li>
              <li>{question.option4}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketQuestions;
