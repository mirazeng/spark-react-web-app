// File Path: src/Spark/Account/Signup.tsx

import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import * as client from "./client";
import {useDispatch} from "react-redux";
import {setCurrentUser} from "./reducer";

export default function Signup() {
    const [user, setUser] = useState<any>({});
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const signup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const currentUser = await client.signup(user);
            dispatch(setCurrentUser(currentUser));
            navigate("/Profile");
        } catch (err: any) {
            setError(err.response.data.message || "An error occurred");
        }
    }
    return (<div id="wd-signup-screen" className={"container mt-5"}>
        <h1>Sign up</h1>
        {error && <div className="wd-error alert alert-danger">{error}</div>}
        <form onSubmit={signup}>
            <div className="mb-3"><input value={user.username}
                                         onChange={(e) => setUser({...user, username: e.target.value})}
                                         id={"wd-username"}
                                         className="form-control mb-2" placeholder="Username"/>
            </div>
            <div className="mb-3"><input value={user.password}
                                         onChange={(e) => setUser({...user, password: e.target.value})}
                                         type="password" id={"wd-password"}
                                         className="form-control mb-2" placeholder="Password"/>
            </div>
            <button id={"wd-signup-btn"} type="submit" className="btn btn-primary w-100 mb-2"> Sign up</button>
        </form>
        <div className={"mt-3"}><Link to="/Account/Signin" className="wd-signin-link">Sign in</Link></div>
    </div>);
}