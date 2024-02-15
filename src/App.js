import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import ApplicationForm from './Components/Applications/ApplicationSection';
import Events from './Components/Events/Events';
import Notifications from './Components/Notifications';
import Reviews from './Components/Review/Reviews';
import ViolationsList from './Components/ViolationsList';
import Tests from './Components/Tests';
import Home from './Components/Home';

import Navbar from './Components/Navbar';
import MapComponent from './Components/Maps/MapComponent';
import './App.css';
import DetailedApplicationView from './Components/Applications/Component/DetailedApplicationView';
import DetailedReviewView from './Components/Review/components/DetailedReviewView';
import About from './Components/About';
import LoginComponent from './Components/Auth/LoginComponent';
import SignUpComponent from './Components/Auth/SignUpComponent';

export default function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ApplicationForm />} />
            <Route path="/events" element={<Events />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/violations-list" element={<ViolationsList />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignUpComponent />} />
            <Route path="/applications/:id" element={<DetailedApplicationView />} />
            <Route path="/reviews/:id" element={<DetailedReviewView />} />
          </Route>
          <Route path="/maps/*" element={<MapComponent />} />

          <Route path="*" element={
            <div>
              <h2>404 Page not found etc</h2>
            </div>
          } />
        </Routes>

      </div>
    </Router>
  );
}
