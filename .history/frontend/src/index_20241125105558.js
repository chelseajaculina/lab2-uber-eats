// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use React 18's createRoot
import { Provider } from 'react-redux';
import store from './redux/store'; // Import the Redux store
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
