/* eslint-disable prettier/prettier */
import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
// import store from './redux/store'
import { BrowserRouter } from 'react-router-dom'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { persistor, store } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>

    </Provider>
  </BrowserRouter>

)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals())
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
