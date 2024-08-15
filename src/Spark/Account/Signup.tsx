import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import * as client from "./account-client";
import {useDispatch} from "react-redux";
import {setCurrentUser} from "./reducer";

export default function Signup() {
    const [user, setUser] = useState<any>({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        description: "",
        role: "USER"
    });
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const signup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const currentUser = await client.signup(user);
            dispatch(setCurrentUser(currentUser));
            navigate("/Account/Profile/self");
        } catch (err: any) {
            setError(err.response.data.message || "An error occurred");
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    }

    return (
        <div id="wd-signup-screen" className="container mt-5">
            <h1>Sign up</h1>
            {error && <div className="wd-error alert alert-danger">{error}</div>}
            <form onSubmit={signup}>
                <div className="mb-3">
                    <input
                        name="username"
                        value={user.username}
                        onChange={handleInputChange}
                        id="wd-username"
                        className="form-control mb-2"
                        placeholder="Username"
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        name="password"
                        value={user.password}
                        onChange={handleInputChange}
                        type="password"
                        id="wd-password"
                        className="form-control mb-2"
                        placeholder="Password"
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        name="first_name"
                        value={user.first_name}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                        placeholder="First Name"
                    />
                </div>
                <div className="mb-3">
                    <input
                        name="last_name"
                        value={user.last_name}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                        placeholder="Last Name"
                    />
                </div>
                <div className="mb-3">
                    <input
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                        placeholder="Email"
                    />
                </div>
                <div className="mb-3">
                    <input
                        name="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                        placeholder="Phone"
                    />
                </div>
                <div className="mb-3">
                    <input
                        name="dob"
                        type="date"
                        value={user.dob}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                    />
                </div>
                <div className="mb-3">
                    <input
                        name="gender"
                        value={user.gender}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                        placeholder="Gender"
                    />
                </div>
                <div className="mb-3">
                    <textarea
                        name="description"
                        value={user.description}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                        placeholder="Description"
                    />
                </div>
                <div className="mb-3">
                    <select
                        name="role"
                        value={user.role}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                    >
                        <option value="USER">User</option>
                        <option value="VIP">VIP</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <button id="wd-signup-btn" type="submit" className="btn btn-primary w-100 mb-2">
                    Sign up
                </button>
            </form>
            <div className="mt-3">
                <Link to="/Account/Signin" className="wd-signin-link">Sign in</Link>
            </div>
        </div>
    );
}