import React from 'react';
import * as client from "../client";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentUser} from "../reducer";

export default function Profile() {
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    const [profile, setProfile] = useState<any>({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchProfile = async () => {
        try {
            // const account = await client.profile();
            setProfile(currentUser);
        } catch (err: any) {
            console.log("DEBUG: Profile.tsx -> fetchProfile -> err", err);
            navigate("/Account/Signin");
        }
    };

    const signout = async () => {
        await client.signout();
        dispatch(setCurrentUser(null));
        navigate("/Account/Signin");
    };

    useEffect(() => {
        fetchProfile();
    }, []);


    return (<div className="wd-profile-screen">
        <h1>Profile</h1>
        {profile &&
            (<div className="container mt-4">
                <input className="wd-username form-control mb-3" value={profile.username}
                       onChange={(e) => setProfile({...profile, username: e.target.value})}/>
                <input className="wd-password form-control mb-3" value={profile.password}
                       onChange={(e) => setProfile({...profile, password: e.target.value})}/>
                <input className="wd-firstname form-control mb-3" value={profile.firstName}
                       onChange={(e) => setProfile({...profile, firstName: e.target.value})}/>
                <input className="wd-lastname form-control mb-3" value={profile.lastName}
                       onChange={(e) => setProfile({...profile, lastName: e.target.value})}/>
                <input className="wd-dob form-control mb-3" value={profile.dob}
                       onChange={(e) => setProfile({...profile, dob: e.target.value})} type="date"/>
                <input className="wd-email form-control mb-3" value={profile.email}
                       onChange={(e) => setProfile({...profile, email: e.target.value})}/>
                <select className="wd-role form-control mb-3"
                        onChange={(e) => setProfile({...profile, role: e.target.value})}>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VIP">VIP</option>
                    <option value="INFLUENCER">Influencer</option>
                </select>
                <button onClick={signout} id={"wd-signout-btn"} className="btn btn-danger w-100">
                    Sign out
                </button>




            </div>)}
    </div>);

}