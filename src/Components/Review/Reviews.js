
import React from 'react';
import ReviewForm from './components/ReviewFrom';
import ReviewsList from './components/ReviewsList';

const Reviews = () => {
  return (
    <div className='container'>
        
    <h2>Отзывы</h2>
    <ReviewForm />
    <ReviewsList />
    </div>
      )};

export default Reviews;
