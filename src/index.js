import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { saveState } from "./localStorage";
import "typeface-roboto";

store.subscribe(() => {
  saveState(store.getState());
  console.log("store updated: ", store.getState());
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
