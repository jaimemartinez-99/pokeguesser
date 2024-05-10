import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import HomePage from './HomePage.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/app" element={<App />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);