/* File path: src/App.tsx */

import React from 'react';
import './App.css';
import Spark from "./Spark";
import {HashRouter, Route, Routes, Navigate} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./Spark/store";

function App() {
    return (
        <Provider store={store}>
            <HashRouter>
                <div>
                    <Routes>
                        <Route path="/" element={<Navigate to="/Home"/>}/>
                        <Route path="/*" element={<Spark/>}/>

                    </Routes>
                </div>
            </HashRouter>
        </Provider>
    );
}

export default App;
