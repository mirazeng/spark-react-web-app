import React from 'react';
import './App.css';
import Spark from "./Spark";
import {HashRouter, Route, Routes, Navigate} from "react-router-dom";

function App() {
  return (
      <HashRouter>
      <div>
        <Routes>
            <Route path="/" element={<Navigate to="Spark" />} />
            <Route path="/Spark/*" element={<Spark />} />
        </Routes>
      </div>
      </HashRouter>
  );
}

export default App;
