import React from 'react'
import ReactDOM from 'react-dom/client'
import { EventType } from '@azure/msal-browser'
import { msalInstance } from './auth/msalConfig'
import App from './App.jsx'
import './index.css'

async function init() {
  // 1. Obligatorio en MSAL v3+: Inicializa la instancia
  await msalInstance.initialize();

  try {
    // 2. 🔑 CRUCIAL: Captura y procesa los datos del token que Microsoft devuelve en la URL
    const response = await msalInstance.handleRedirectPromise();

    if (response && response.account) {
      msalInstance.setActiveAccount(response.account);
    } else if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
      msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }
  } catch (error) {
    console.error("Error al procesar la redirección en Frontend 2:", error);
  }

  // 3. Escuchador para eventos de login futuros
  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
      msalInstance.setActiveAccount(event.payload.account);
    }
  });

  // 4. Se renderiza la aplicación SOLO cuando el token de la URL ya fue procesado
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

init();
