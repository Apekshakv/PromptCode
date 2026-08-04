import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";

import Authpage from "./pages/Authpage";
import Home from "./pages/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Authpage mode="login" />} />
      <Route path="/register" element={<Authpage mode="register" />} />
      <Route path="/builder" element={<Home />} />
    </Routes>
  );
};

export default App;