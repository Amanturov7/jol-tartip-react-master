import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faList, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../../App.css'; // Import styles
import './ApplicationList.css';

const ApplicationsList = ({ onReportClick }) => {
  const [applications, setApplications] = useState([]);
  const [isGridMode, setIsGridMode] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchApplications();
    fetchFilterOptions();
  }, [pageNumber, searchTerm, selectedFilter, title]);

  const fetchApplications = async () => {
    try {
      let url = `http://localhost:8080/rest/applications/all?page=${pageNumber}`;

      if (searchTerm) {
        url += `&searchTerm=${searchTerm}`;
      }

      if (selectedFilter) {
        url += `&typeViolations=${selectedFilter}`;
      }

      if (title) {
        url += `&title=${title}`;
      }

      const response = await Axios.get(url);
      setApplications(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching applications:', error.message);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await Axios.get('http://localhost:8080/rest/violations/all');
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching filter options:', error.message);
    }
  };

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setSelectedFilter(value);
    setPageNumber(1); // Reset page number when filter changes
  };

  const handleResetFilter = () => {
    setSelectedFilter('');
    setPageNumber(1); // Reset page number when filter is reset
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleClearTitle = () => {
    setTitle('');
    setPageNumber(1); // Reset page number when title is cleared
  };

  const toggleViewMode = () => {
    setIsGridMode(!isGridMode);
  };

  const renderApplications = () => {
    if (isGridMode) {
      return applications.map((application) => (
        <Link to={`/applications/${application.id}`} key={application.id} className="application-box">
          <img src={`http://localhost:8080/rest/attachments/download/applications/${application.id}`} alt={`Application ${application.id}`} />
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
      <div className="search-bar">
        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={handleSearchTermChange}
           icon={faSearch} />

        
                <FontAwesomeIcon icon={faSearch} />

      </div>
      {/* <div className="filter-dropdown">
        <select value={selectedFilter} onChange={handleFilterChange}>
          <option value="">Тип нарушения</option>
          {filterOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
        <button className="button-reset" onClick={handleResetFilter}>&times;</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Заголовок..."
          value={title}
          onChange={handleTitleChange}
        />
        {title && <button onClick={handleClearTitle}>&times;</button>}
      </div>
      <button onClick={toggleViewMode} className="view-mode-toggle">
        {isGridMode ? <FontAwesomeIcon icon={faList} /> : <FontAwesomeIcon icon={faTh} />}
        {isGridMode ? 'Switch to Table View' : 'Switch to Grid View'}
      </button> */}
      <div className="applications-list-container">
        {renderApplications()}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button  className="page" key={page} onClick={() => handlePageChange(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsList;
