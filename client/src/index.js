import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CurrentUserProvider } from "./CurrentUser";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Auth0Provider
            domain="dev-t8v4fael2ayazpv0.us.auth0.com"
            clientId="r0ry9J8gJLYYwYUy0ax6jfCZ6Mf1A8Y5"
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: "http://localhost:3003",
                scope: "read:current_user update:current_user_metadata",
            }}
        >
            <CurrentUserProvider>
                <App />
            </CurrentUserProvider>
        </Auth0Provider>
    </React.StrictMode>
);
