import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import Header from "./components/header";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

import "./styles/bootstrap.css";
import "./styles/styles.css";

root.render(
  <>
    <Header />
    <div className="container mt-4">
      <App />
    </div>
  </>
);
