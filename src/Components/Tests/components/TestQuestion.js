import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import '../Tests.css'; // Проверьте, что путь к вашему CSS файлу указан корректно
import config from '../../Config'
const TicketQuestions = () => {
  const { ticketNumber } = useParams();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questionImages, setQuestionImages] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionsByNumber = async () => {
      try {
        const response = await Axios.get(`${config.BASE_URL}/rest/tickets/byNumber/${ticketNumber}`);
        setQuestions(response.data);

        const imagePromises = response.data.map(async question => {
          try {
            const imageResponse = await Axios.get(`${config.BASE_URL}/rest/attachments/download/tickets/${question.id}`, {
              responseType: 'blob'
            });
            const imageUrl = URL.createObjectURL(imageResponse.data);
            setQuestionImages(prevState => ({
              ...prevState,
              [question.id]: imageUrl
            }));
          } catch (error) {
            console.error('Ошибка при загрузке изображения для вопроса:', error);
          }
        });
        await Promise.all(imagePromises);
      } catch (error) {
        setError('Ошибка при загрузке вопросов');
      }
    };
    fetchQuestionsByNumber();
  }, [ticketNumber]);

  const handleOptionClick = (questionId, selectedOption) => {
    setSelectedAnswers(prevState => ({
      ...prevState,
      [questionId]: selectedOption
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    let incorrect = 0;
    
    questions.forEach(question => {
      const selectedAnswer = selectedAnswers[question.id];
      if (selectedAnswer === question.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });
    setCorrectCount(correct);
    setIncorrectCount(incorrect);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='container'>
      <h2>Билет №{ticketNumber}</h2>
      {error && <p>{error}</p>}
      <div>
        {questions.map(question => (
          <div key={question.id} className="question-container">
{questionImages[question.id] ? (
  <img className="question-image" src={questionImages[question.id]} alt={`Вопрос ${question.id}`} />
) : (
  <img className="question-image" src={require('../../../images/unnamed.png')} alt={`Вопрос ${question.id}`} />
)}

            <p className="question">Вопрос {question.id}, {question.question}</p>

            <div className="options-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    checked={selectedAnswers[question.id] === question.option1}
                    onChange={() => handleOptionClick(question.id, question.option1)}
                  />
                  <label>{question.option1}</label>
                </li>
                <li>
                  <input
                    type="checkbox"
                    checked={selectedAnswers[question.id] === question.option2}
                    onChange={() => handleOptionClick(question.id, question.option2)}
                  />
                  <label>{question.option2}</label>
                </li>
                <li>
                  <input
                    type="checkbox"
                    checked={selectedAnswers[question.id] === question.option3}
                    onChange={() => handleOptionClick(question.id, question.option3)}
                  />
                  <label>{question.option3}</label>
                </li>
                <li>
                  <input
                    type="checkbox"
                    checked={selectedAnswers[question.id] === question.option4}
                    onChange={() => handleOptionClick(question.id, question.option4)}
                  />
                  <label>{question.option4}</label>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className='submit' onClick={handleSubmit}>
        Завершить
      </button>
      <button type="button" className='submit' onClick={handleGoBack}>
        Назад
      </button>
      <div>
        <p>Правильные ответы: {correctCount}</p>
        <p>Неправильные ответы: {incorrectCount}</p>
      </div>
    </div>
  );
};

export default TicketQuestions;
