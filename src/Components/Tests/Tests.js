import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import TicketForm from './components/TicketForm';
import image from '../../images/unnamed.png';
import "../Tests/Tests.css"

const Tests = () => {
  const [ticketNumbers, setTicketNumbers] = useState([]);
  const [selectedTicketNumber, setSelectedTicketNumber] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
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

  const handleTicketNumberClick = async (ticketNumber) => {
    setSelectedTicketNumber(ticketNumber);
    try {
      const response = await Axios.get(`http://localhost:8080/rest/tickets/byNumber/${ticketNumber}`);
      setQuestions(response.data);
      setSelectedQuestion(response.data[0]); // Выбираем первый вопрос
      setError('');
    } catch (error) {
      setError('Ошибка при загрузке билетов');
      setQuestions([]);
    }
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [selectedQuestion.id]: option });
  };

  return (
<div className='container'>
  <TicketForm />
  <h2>Тесты ПДД</h2>
  <div>
    <h3>Выберите номер билета:</h3>
    {error && <p>{error}</p>}
    {ticketNumbers.map(ticketNumber => (
      <button 
        key={ticketNumber} 
        onClick={() => handleTicketNumberClick(ticketNumber)}
        style={{ marginRight: '10px' }}
      >
        Билет {ticketNumber}
      </button>
    ))}
  </div>
  {questions.length > 0 && (
    <div>
      <h3>Билеты №{selectedTicketNumber}:</h3>
      <div>
        <h4>Вопрос:</h4>
        {selectedQuestion && (
          <div>
            <img src={`http://localhost:8080/rest/attachments/download/tickets/${selectedQuestion.id}`} alt="Question" />
            <p>{selectedQuestion.question}</p>
          </div>
        )}
<div className="options-container">
  <div className="option" onClick={() => handleAnswerSelect(selectedQuestion.option1)}>
    <label className="option-label" htmlFor="option1">
      {selectedQuestion.option1}
    </label>
  </div>
  <div className="option" onClick={() => handleAnswerSelect(selectedQuestion.option2)} >
    <label className="option-label" htmlFor="option2">
      {selectedQuestion.option2}
    </label>
  </div>
  <div className="option" onClick={() => handleAnswerSelect(selectedQuestion.option3)} >
    <label className="option-label" htmlFor="option3">
      {selectedQuestion.option3}
    </label>
  </div>
  <div className="option" onClick={() => handleAnswerSelect(selectedQuestion.option4)} >
    <label className="option-label" htmlFor="option4">
      {selectedQuestion.option4}
    </label>
  </div>
</div>

      </div>
      <div>
        {questions.map(question => (
          <button 
            key={question.id} 
            onClick={() => handleQuestionSelect(question)} 
            style={{ marginRight: '10px' }}
          >
            Вопрос {question.id}
          </button>
        ))}
      </div>
    </div>
  )}
</div>

  );
};

export default Tests;
