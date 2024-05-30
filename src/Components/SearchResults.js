import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import  config  from './Config';

const SearchResults = () => {
  const { searchQuery } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await Axios.get(`${config.BASE_URL}/rest/applications/by-gos-number?gosNumber=${searchQuery}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error.message);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);


  const renderApplications = () => {
    return searchResults.map((application) => (
      <Link to={`/applications/${application.id}`} key={application.id} className="application-box">
        <img src={`${config.BASE_URL}/rest/attachments/download/applications/${application.id}`} alt={`Application ${application.id}`} />
        <div> Нарушение № {application.id}</div>
        <div>{application.title}</div>
      </Link>
    ));
  };

  return (
    <div className='container'>

      <h2>Результаты поиска по Гос номеру {searchQuery.toUpperCase()}</h2>
      <div className="applications-list-container">
        {renderApplications()}
      </div>
      <button type="button" className='submit' onClick={handleGoBack}>
    Назад
  </button>
    </div>
  );
};

export default SearchResults;
