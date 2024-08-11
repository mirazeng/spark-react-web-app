/* File path: src/App.tsx */

import React from 'react';
import './App.css';
import Spark from "./Spark";
import {HashRouter, Route, Routes, Navigate} from "react-router-dom";

function App() {
    return (
        <HashRouter>
            <div>
                <Routes>
                    <Route path="/" element={<Navigate to="/Home"/>}/>
                    <Route path="/*" element={<Spark/>}/>
                    {/*<Route path="/Profile" element={<Profile />} />
                    <Route path="/Detail" element={<Detail />} />*/}
                </Routes>
            </div>
        </HashRouter>
    );
}

export default App;
