// File Path: src/Spark/Account/Signin.tsx

import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import * as client from "./account-client";
import {useDispatch} from "react-redux";
import {setCurrentUser} from "./reducer";

export default function Signin() {
    const [credentials, setCredentials] = useState({username: "", password: ""});
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const signin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form from submitting normally
        try {
            const currentUser = await client.signin(credentials);
            dispatch(setCurrentUser(currentUser));
            navigate("/Account/Profile/self");
        } catch (err: any) {
            setError(err.response.data.message || "An error occurred during sign in");
        }
    };

    return (
        <div id="wd-signin-screen" className="container mt-5">
            <h1>Sign in</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={signin}>
                <div className="mb-3">
                    <input
                        id="wd-username"
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        id="wd-password"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        required
                    />
                </div>
                <button id={"wd-signin-btn"} type="submit" className="btn btn-primary w-100 mb-2">Sign in</button>
            </form>
            <div className="mt-3">
                <Link to="/Account/Signup">Don't Have An Account? Sign Up Today! </Link>
            </div>
        </div>
    );
}