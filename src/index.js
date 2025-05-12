import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App';
import { CouponProvider } from './context/CouponContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CouponProvider>
      <App />
    </CouponProvider>
  </React.StrictMode>
);
