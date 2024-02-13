// Home.jsx
import React from 'react';
import ApplicationsList from './Applications/Component/ApplciationsList';

const Home = () => {
  
  return (
    <div className="container">
      <h1>Последние нарушения</h1>
      <ApplicationsList />

    </div>
  );
};

export default Home;
