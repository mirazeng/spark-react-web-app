import {Route, Routes, Navigate} from "react-router-dom";
import TOC from "../TOC";
import Dashboard from "./Dashboard";


export default function Spark() {
    return (

        <div id="wd-spark">
            <h2>Spark</h2>
            <Dashboard/>
            <TOC/>
            <Routes>
                <Route path="/" element={<Navigate to="Spark"/>} />
            </Routes>
        </div>
    );
}