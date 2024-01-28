
import React from 'react';
import ReviewForm from './components/ReviewFrom';
import ReviewsList from './components/ReviewsList';

const Reviews = () => {

  const isUserAuthenticated = sessionStorage.getItem("token") !== null;
  if (!isUserAuthenticated) {
    return (
      <div className='container'>
          
      <h2>Отзывы</h2>
      <ReviewsList />
      </div>
        )
      };
  
  

  return (
    <div className='container'>
        
    <h2>Отзывы</h2>
    <ReviewForm />
    <ReviewsList />
    </div>
      );
  }
export default Reviews;
