// ApplicationsList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faList } from '@fortawesome/free-solid-svg-icons';
import '../../../App.css'; // Import styles
import './ApplicationList.css';


const isImage = (id) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const extension = getFileExtension(id);
  return imageExtensions.includes(extension);
};

const isVideo = (id) => {
  const videoExtensions = ['mp4', 'avi', 'mkv']; 
  const extension = getFileExtension(id);
  return videoExtensions.includes(extension);
};

const getFileExtension = (id) => {
  const idString = id.toString();
  const parts = idString.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : null;
};




const ApplicationsList = ({ onReportClick }) => {
  const [applications, setApplications] = useState([]);
  const [isGridMode, setIsGridMode] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/rest/applications/all');
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error.message);
      }
    };

    fetchApplications();
  }, []);

  const toggleViewMode = () => {
    setIsGridMode(!isGridMode);
  };

  const renderApplications = () => {
    if (isGridMode) {
      return applications.map((application) => (
        <Link to={`/applications/${application.id}`} key={application.id} className="application-box">
          <img src={`http://localhost:8080/rest/attachments/download/applications/${application.id}`} />
          <div> Нарушение № {application.id}</div>
        <div>{application.title}</div>

      </Link>
      
      ));
    } else {
      return (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td>{application.id}</td>
                <td>{application.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div>
      <button onClick={toggleViewMode} className="view-mode-toggle">
        {isGridMode ? <FontAwesomeIcon icon={faList} /> : <FontAwesomeIcon icon={faTh} />}
        {isGridMode ? 'Switch to Table View' : 'Switch to Grid View'}
      </button>
      <div className="applications-list-container">
        {renderApplications()}
      </div>
    </div>
  );
};

export default ApplicationsList;
