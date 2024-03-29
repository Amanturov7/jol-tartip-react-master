import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const TicketQuestions = ({ selectedTicketNumber, handleAnswerSelect }) => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [questionImages, setQuestionImages] = useState({});



  const loadQuestionImage = async (questionId) => {
    try {
      const response = await Axios.get(`http://localhost:8080/rest/attachments/download/tickets/${questionId}`, {
        responseType: 'blob'
      });
      const imageUrl = URL.createObjectURL(response.data);
      setQuestionImages(prevState => ({
        ...prevState,
        [questionId]: imageUrl
      }));
    } catch (error) {
      console.error('Ошибка при загрузке изображения вопроса:', error);
      // Если изображение не загружено, установите пустую строку в качестве URL
      setQuestionImages(prevState => ({
        ...prevState,
        [questionId]: ''
      }));
    }
  };

  return (
    <div className='container'>
      <h2>Билет №{selectedTicketNumber}</h2>
      {error && <p>{error}</p>}
      <div>
        {questions.map(question => (
          <div key={question.id}>
            <h3>Вопрос {question.id}</h3>
            {questionImages[question.id] && <img src={questionImages[question.id]} alt="Question" />}
            <p>{question.question}</p>
            <div className="options-container">
              <div className="option" onClick={() => handleAnswerSelect(question.option1)}>
                <label className="option-label" htmlFor="option1">
                  {question.option1}
                </label>
              </div>
              <div className="option" onClick={() => handleAnswerSelect(question.option2)} >
                <label className="option-label" htmlFor="option2">
                  {question.option2}
                </label>
              </div>
              <div className="option" onClick={() => handleAnswerSelect(question.option3)} >
                <label className="option-label" htmlFor="option3">
                  {question.option3}
                </label>
              </div>
              <div className="option" onClick={() => handleAnswerSelect(question.option4)} >
                <label className="option-label" htmlFor="option4">
                  {question.option4}
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketQuestions;
