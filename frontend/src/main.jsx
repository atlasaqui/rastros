import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/retro.css";
import "./styles/os.css";
import "./styles/journal.css";

let started = false;
window.startRastros = () => {
if (started) return;
started = true;
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
};
// The native host installs its persistence bridge after the document loads.
if (location.protocol !== 'file:' || window.bridge) window.startRastros();

import './styles/continuation.css';
import './styles/revision.css';

import './styles/mediaRevision.css';

import './styles/ending.css';

import './styles/review2026.css';

import './styles/iwakuraMono.css';

import './styles/worldUnified.css';
