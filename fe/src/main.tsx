// import { worker } from '@mocks/browser';
import App from 'App';
import React from 'react';
import ReactDOM from 'react-dom/client';

// if (process.env.NODE_ENV === 'development') {
//   worker.start({
//     onUnhandledRequest: 'bypass',
//   });
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
