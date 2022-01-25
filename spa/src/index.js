import { render } from "react-dom";
import { HashRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import App from "./pages/App";

// Customized bootstrap (components, layout, utilities, ...)
import "./scss/bootstrap.scss";

// Core styles
import "./scss/index.scss";

// vendor styles

render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
