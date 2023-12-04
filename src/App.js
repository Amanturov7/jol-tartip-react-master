import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ApplicationForm from './Components/Applications/ApplicationSection';
import Events from './Components/Events/Events';
import Notifications from './Components/Notifications';
import Reviews from './Components/Reviews';
import ViolationsList from './Components/ViolationsList';
import Tests from './Components/Tests';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer/Footer';

import './App.css';

export default function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/report" element={<ApplicationForm />} />
          <Route path="/events" element={<Events />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/violations-list" element={<ViolationsList />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/" element={<Home />} />
          <Route
            path="*"
            element={
              <div>
                <h2>404 Page not found etc</h2>
              </div>
            }
          />
          
        </Routes>
        <Footer />

      </div>
    </Router>
  );
}
