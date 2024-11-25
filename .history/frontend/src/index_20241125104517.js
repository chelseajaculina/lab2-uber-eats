import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the correct ReactDOM for React 18
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
