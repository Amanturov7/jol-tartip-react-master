import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';

const DetailedApplicationView = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await Axios.get(`http://localhost:8080/rest/applications/${id}`);
        setApplication(response.data);
      } catch (error) {
        console.error('Error fetching application:', error.message);
      }
    };

    fetchApplication();
  }, [id]);

  if (!application) {
    return  <div className='container' >Loading...</div>;
  }

  return (
    <div className='container'>
      <h2>Detailed View of Application {id}</h2>
      <p>Title: {application.title}</p>
      <p>Description: {application.description}</p>
      {/* Render other application details here */}
    </div>
  );
};

export default DetailedApplicationView;
