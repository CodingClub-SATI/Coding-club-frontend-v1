import React from 'react';
import ReactDOM from 'react-dom/client';
import router from './router';
import { RouterProvider } from 'react-router-dom';

// Global styles
import './styles/global.css';
import './styles/utilities.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);