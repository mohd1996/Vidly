import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import logger from "./services/logService";
import App from "./App";

console.log("FIRST REACT PROJ", process.env.REACT_APP_NAME);

logger.init();
// console.log("%c Test", "color:orange");
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
//ReactDOM.render(React component (JS func) to render, element(<div> tag) in the DOM document)
//ReactDOM.render(element, container)
