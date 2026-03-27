import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { PackageManagerProvider } from "@/components/PackageManagerTabs";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PackageManagerProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PackageManagerProvider>
  </React.StrictMode>,
);
