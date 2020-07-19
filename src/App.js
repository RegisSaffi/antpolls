import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import { MyTheme } from "./utils/styles.jsx";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/home.jsx";

import { SnackbarProvider } from "notistack";
import { v4 as uuid } from "uuid";

import { DeviceUUID } from "device-uuid/index";

function App() {
  const [theme, setTheme] = useState(0);

  useEffect(() => {
    const t = window.localStorage.getItem("theme");
    if (t != null) {
      setTheme(t);
    }

    const crf = window.localStorage.getItem("crf_token");
    if (crf == null) {
      localStorage.setItem("crf_token", uuid());
    }
  }, []);

  const toggleTheme = () => {
    const t2 = theme == 0 ? 1 : 0;
    window.localStorage.setItem("theme", t2);
    setTheme(t2);
  };

  return (
    <div className="App">
      <MuiThemeProvider theme={MyTheme(theme)}>
        <SnackbarProvider
          preventDuplicate
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Router>
            <Home themer={toggleTheme} theme={theme} />
          </Router>
        </SnackbarProvider>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
