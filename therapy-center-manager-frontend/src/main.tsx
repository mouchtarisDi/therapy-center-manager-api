import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CenterProvider } from "./context/CenterContext";
import "./index.css";
import "./styles/layout.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CenterProvider>
          <App />
        </CenterProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);