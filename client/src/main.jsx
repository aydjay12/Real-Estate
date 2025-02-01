import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-ee4hguujf503yj1e.us.auth0.com"
      clientId="Uu4q7eRY5eTwasKqO6yi08uTrEEoLeLL"
      authorizationParams={{
        redirect_uri: "https://real-estate-eta-hazel.vercel.app"
      }}
      audience="http://localhost:8000"
      scope="openid profile email"
      cacheLocation="localstorage" // Ensure this is set
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
