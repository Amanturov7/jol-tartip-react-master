import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';

const DetailedApplicationView = () => {
  const { id } = useParams();
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

  if (!application) {
    return <div className='container'>Loading...</div>;
  }

  return (
    <div className='container'>
      <h2>Detailed View of Application {id}</h2>
      <p>Нарушение {application.title}</p>
      <p>Описание: {application.description}</p>

      {attachmentUrl && (
        <div>
          <h3>Attachment</h3>
          <img src={attachmentUrl} alt={`Attachment for application ${id}`} />
        </div>
      )}
    </div>
  );
};

export default DetailedApplicationView;
