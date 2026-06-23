// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
//import App from './components/App';
import App from './components/App';
// import './index.css'; // Здесь подключается Tailwind CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);