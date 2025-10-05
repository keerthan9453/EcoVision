// client/src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import './index.css';
import reportWebVitals from './reportWebVitals';

const domain = process.env.REACT_APP_AUTH0_DOMAIN; // or VITE_AUTH0_DOMAIN if using Vite
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider domain={domain} clientId={clientId} redirectUri={redirectUri}>
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
