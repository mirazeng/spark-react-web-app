// File path: src/Spark/index.tsx

import {Route, Routes, Navigate, Link} from "react-router-dom";
import SparkLanding from "./Landing";
import Account from "./Account";
import {useSelector} from "react-redux";
import Session from "./Account/Session";
import React from "react";
import {FaBookmark} from 'react-icons/fa';

function Navigation() {
    const {currentUser} = useSelector((state: any) => state.accountReducer);

    return (
        <div className="row mt-2 mx-5">
            <div className="col-6">
                <Link to="/" className="text-decoration-none">
                    <div className="fs-1 fw-bold">
                        <span className="text-danger">S</span>
                        <span className="text-success">p</span>
                        <span className="text-primary">a</span>
                        <span className="text-warning">r</span>
                        <span className="text-info">k</span>
                    </div>
                </Link>
            </div>
            <div className="col-6 text-end d-flex justify-content-end align-items-center">
                {currentUser ? (
                    <>
                        <Link to="/Account/Profile" className="btn btn-outline-primary me-2">
                            {currentUser.username}
                        </Link>
                        <Link to="/Account/Profile/bookmarks" className="btn btn-outline-secondary">
                            <FaBookmark/>
                        </Link>
                    </>
                ) : (
                    <div className="btn-group">
                        <Link to="/Account/Signin" className="btn btn-outline-success">Sign in</Link>
                        <Link to="/Account/Signup" className="btn btn-outline-primary">Sign up</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Spark() {
    return (
        <Session>
            <Navigation/>
            <div id="wd-spark">
                <Routes>
                    <Route path="/" element={<SparkLanding/>}/>
                    <Route path="Home" element={<SparkLanding/>}/>
                    <Route path="Account/*" element={<Account/>}/>
                    <Route path="*" element={<Navigate to="Home"/>}/>
                </Routes>
            </div>
        </Session>
    );
}