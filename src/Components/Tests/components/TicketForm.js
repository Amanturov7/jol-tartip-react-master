import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import config from '../../Config'
const TicketForm = ({ onCancel }) => {
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');

  const [file, setFile] = useState('');
  const [userId, setUserId] = useState(0);
  const [ticketId, setTicketId] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          const response = await Axios.get(`${config.BASE_URL}/rest/user/user`, {
            params: {
              'token': `${token}`
            }
          });
          setUserId(response.data.id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
  
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTicket = {
      question,
      correctAnswer,
      option1,
      option2,
      option3,
      option4,
      ticketNumber,
    };

    try {
      const ticketResponse = await Axios.post(
        '`${config.BASE_URL}/rest/tickets/create',
        newTicket,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Created Ticket:', ticketResponse.data.id);

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('dto', JSON.stringify({
          type: 'ticket',
          originName: file.name,
          description: 'File description',
          ticketsId: ticketResponse.data.id,
        }));

        await Axios.post(`${config.BASE_URL}/rest/attachments/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }


      setQuestion('');
      setCorrectAnswer('');
      setOption1('');
      setOption2('');
      setOption3('');
      setOption4('');
      setTicketNumber(0);

      setFile(null);

    } catch (error) {
      console.error('Error creating ticket:', error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const allowedFileTypes = ['image/jpeg', 'image/png', 'video/mp4'];
      const fileType = selectedFile.type;

      if (allowedFileTypes.includes(fileType)) {
        setFile(selectedFile);
      } else {
        alert('Файл не поддерживается. Выберите jpeg, jpg, png, mp4');
        e.target.value = null;
        setFile(null);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Введите текст вопроса</label>
        <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />

        <label>Правильный ответ</label>
        <input type="text" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} required />

        <label>Приложить фото для вопроса</label>
        <input type="file" onChange={handleFileChange} />
      </div>

      <div className="form-group">
        <label>Вариант А</label>
        <input type="text" value={option1} onChange={(e) => setOption1(e.target.value)} required />
          <label>Вариант Б</label>
        <input type="text" value={option2} onChange={(e) => setOption2(e.target.value)} required /> 
        <label>Билет №</label>
        <input type="text" value={ticketNumber} onChange={(e) => setTicketNumber(e.target.value)} required /> 


        </div>

      <div className="form-group">
        <label>Вариант В</label>
        <input type="text" value={option3} onChange={(e) => setOption3(e.target.value)} required />
             <label>Вариант Г</label>
        <input type="text" value={option4} onChange={(e) => setOption4(e.target.value)} required />
        <button type="submit">Сохранить</button>

         </div>


    </form>
  );
};

export default TicketForm;
