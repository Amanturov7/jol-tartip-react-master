import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './Tests.css'; // Импортируем файл стилей
import TicketForm from './components/TicketForm';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/rest/tickets');
        setTests(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error.message);
      }
    };

    fetchTests();
  }, []);

  const showImage = (imageSrc) => {
    setCurrentImage(imageSrc);
  };

  return (
    <div className='container'>

      <TicketForm />
      <h2>Тесты ПДД</h2>
      {currentImage && (
        <div className="image-container">
          <img src={`http://localhost:8080/rest/attachments/download/tickets/${test.id}`} alt="Question" className="question-image" />
        </div>
      )}
      {tests.map((test) => (
        <div key={test.id}>
          <div className="question-container">
            <p className="question"></p>
          </div>
          <div className="options-container">
            <div className="option">
              <input type="radio" id={`option1_${test.id}`} name={`options_${test.id}`} value={test.option1} />
              <label htmlFor={`option1_${test.id}`}>{test.option1}</label>
            </div>
            <div className="option">
              <input type="radio" id={`option2_${test.id}`} name={`options_${test.id}`} value={test.option2} />
              <label htmlFor={`option2_${test.id}`}>{test.option2}</label>
            </div>
            <div className="option">
              <input type="radio" id={`option3_${test.id}`} name={`options_${test.id}`} value={test.option3} />
              <label htmlFor={`option3_${test.id}`}>{test.option3}</label>
            </div>
            <div className="option">
              <input type="radio" id={`option4_${test.id}`} name={`options_${test.id}`} value={test.option4} />
              <label htmlFor={`option4_${test.id}`}>{test.option4}</label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tests;
