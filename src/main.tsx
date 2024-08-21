import React from "react";
import ReactDOM from "react-dom/client";
import "destyle.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Routers } from "./router/routes";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster />
      <Routers />
    </BrowserRouter>
  </React.StrictMode>
);
