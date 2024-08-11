// File path: src/Spark/index.tsx

import {Route, Routes, Navigate, Link} from "react-router-dom";
import SparkLanding from "./Landing";
import Account from "./Account";
import {Provider} from "react-redux";
import store from "./store";
import Session from "./Account/Session";
import React from "react";

export default function Spark() {
    return (
        <Provider store={store}>
            <Session>
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
                    {/*TODO: Conditionally render the buttons, when user is not signed and when page is already at Signin or Signup*/}

                    {
                        (<div className="col-6 text-end">
                            <Link to="/Account/Signin" className="btn btn-outline-success me-2">Sign in</Link>
                            <Link to="/Account/Signup" className="btn btn-outline-primary">Sign up</Link>
                        </div>)
                    }
                </div>
                <div id="wd-spark">
                    <Routes>
                        <Route path="/" element={<SparkLanding/>}/>
                        <Route path="Home" element={<SparkLanding/>}/>
                        <Route path="Account/*" element={<Account/>}/>
                        <Route path="*" element={<Navigate to="Home"/>}/>

                        {/*<Route path="/Profile" element={<Profile />} />
                    <Route path="/Detail" element={<Detail />} />*/}

                    </Routes>
                </div>
            </Session>
        </Provider>
    );
}