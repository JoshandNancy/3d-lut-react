import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Home from "./routes/Home";
import Gallery from "./routes/Gallery";

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home}></Route>
      <Route path="/:id" exact component={Gallery}></Route>
    </Router>
  );
}

export default App;
