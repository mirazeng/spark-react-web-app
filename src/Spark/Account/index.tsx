// File Path: src/Spark/Account/index.tsx

import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";
import {useSelector} from "react-redux";

export default function Account() {
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    return (
        <div className="wd-account-screen">
            <Routes>
                <Route path="/" element={<Navigate to={currentUser ? "Profile" : "Signin"}/>}/>
                <Route path="Signin" element={<Signin/>}/>
                <Route path="Signup" element={<Signup/>}/>
            </Routes>
        </div>
    );
}