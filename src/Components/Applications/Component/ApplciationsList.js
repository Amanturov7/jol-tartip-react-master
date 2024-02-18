import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

import '../../../App.css'; // Import styles
import './ApplicationList.css';

const ApplicationsList = ({ onReportClick }) => {
  const [applications, setApplications] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [numberAuto, setNumberAuto] = useState('');
  useEffect(() => {
    fetchApplications();
    fetchFilterOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, id, selectedFilter, title, numberAuto]);

  const fetchApplications = async () => {
    try {
      let url = `http://localhost:8080/rest/applications/all?page=${pageNumber}`;


      if (selectedFilter) {
        url += `&typeViolations=${selectedFilter}`;
      }

      if (title) {
        url += `&title=${title}`;
      }

      
      if (id) {
        url += `&id=${id}`;
      }

      if (numberAuto) {
        url += `&numberAuto=${numberAuto}`;
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



  const handleFilterChange = (event) => {
    const value = event.target.value;
    setSelectedFilter(value);
    setPageNumber(1); // Reset page number when filter changes
  };

  // const handleResetFilter = () => {
  //   setSelectedFilter('');
  //   setPageNumber(1); // Reset page number when filter is reset
  // };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleIdChange = (event) => {
    setId(event.target.value);
  };
  const handleNumberAutoChange = (event) => {
    setNumberAuto(event.target.value);
  };
  const handleClearTitle = () => {
    setTitle('');
    setPageNumber(1);
  };
  const handleClearId = () => {
    setId('');
    setPageNumber(1);
  };

  const handleClearNumberAuto = () => {
    setNumberAuto('');
    setPageNumber(1);
  };



  const renderApplications = () => {
      return applications.map((application) => (
        <Link to={`/applications/${application.id}`} key={application.id} className="application-box">
          <img src={`http://localhost:8080/rest/attachments/download/applications/${application.id}`} alt={`Application ${application.id}`} />
          <div> Нарушение № {application.id}</div>
          <div>{application.title}</div>
        </Link>
      ));
    
  };

  return (
    <div>
   
        <div className="filters-container">
        <div className="filter">
            <input
                type="text"
                placeholder="№"
                value={id}              
                onChange={handleIdChange}
                />
                {id && <button onClick={handleClearId}>&times;</button>}

        </div>
        <div className="filter">
            <input
                type="text"
                placeholder="Гос номер"
                value={numberAuto}
                onChange={handleNumberAutoChange}
                />
               {numberAuto && <button onClick={handleClearNumberAuto}>&times;</button>}

        </div>
            <div className="filter">
                <select value={selectedFilter} className='dropdown-filter' onChange={handleFilterChange}>
                    <option value="">Тип нарушения</option>
                    {filterOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.title}
                        </option>
                    ))}
                </select>
                {/* <button className="button-reset" onClick={handleResetFilter}>&times;</button> */}
            </div>
            <div className="filter">
                <input
                    type="text"
                    placeholder="Описание"
                    value={title}
                    onChange={handleTitleChange}
                />
                {title && <button onClick={handleClearTitle}>&times;</button>}
            </div>
        </div>

        <div className="applications-list-container">
            {renderApplications()}
        </div>
        <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button className="page" key={page} onClick={() => handlePageChange(page)}>
                    {page}
                </button>
            ))}
        </div>
    </div>
);
            }
export default ApplicationsList;
