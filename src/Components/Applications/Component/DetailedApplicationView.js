import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';  // Import useNavigate
import Axios from 'axios';

const DetailedApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();  // Use useNavigate instead of useHistory
  const [application, setApplication] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await Axios.get(`http://localhost:8080/rest/applications/${id}`);
        setApplication(response.data);

        // Запрос для получения байтового файла
        const attachmentResponse = await Axios.get(`http://localhost:8080/rest/attachments/download/applications/${id}`, {
          responseType: 'blob',
        });
        const blob = new Blob([attachmentResponse.data]);
        const url = URL.createObjectURL(blob);
        setAttachmentUrl(url);
      } catch (error) {
        console.error('Error fetching application:', error.message);
      }
    };

    fetchApplication();
  }, [id]);

  const handleDelete = async () => {
    try {
      await Axios.delete(`http://localhost:8080/rest/applications/delete/${id}`);
      navigate('/report'); // Use navigate to redirect
    } catch (error) {
      console.error('Error deleting application:', error.message);
    }
  };

  if (!application) {
    return <div className='container'>Loading...</div>;
  }

  return (
    <div className='container'>
<h2>Нарушение № {id}</h2>
<p>Тип нарушение  пдд: {application.title}</p>
<p>Дата Нарушения: {application.dateOfViolation}</p>
<p>Гос номер: {application.numberAuto}</p>
<p>Описание: {application.description}</p>
<p>Статус: {application.statusName}</p>
<p>Адрес: {application.place}</p>
<p>Дата создания заявления: {application.createdDate}</p>
      {attachmentUrl && (
        <div>
          <h3>Attachment</h3>
          <img src={attachmentUrl} alt={`Attachment for application ${id}`} />
        </div>
      )}

      <button type="button" className='button-red' onClick={handleDelete}>
        Удалить
      </button>

      <Link to="/report">
        <button type="button" className='button-green'>
          Назад
        </button>
      </Link>
      <Link to="/">
        <button type="button" className='button-green'>
          На главную
        </button>
      </Link>
    </div>
  );
};

export default DetailedApplicationView;
