import React, { useState, useEffect } from 'react';
import Axios from 'axios';
const Tests = () => {

  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/rest/tickets');
        setTests(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error.message);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className='container'>
      <h2>Тесты ПДД</h2>
      <table>
        <thead>
          <tr>
            <th>Вопрос </th>
            <th>А</th>
            <th>Б</th>
            <th>В</th>
            <th>Г</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.id}>
              <td>{test.question}</td>
              <td>{test.option1}</td>
              <td>{test.option2}</td>
              <td>{test.option3}</td>
              <td>{test.option4}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      )
};

export default Tests;
