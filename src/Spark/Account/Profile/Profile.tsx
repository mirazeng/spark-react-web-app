// File Path: src/Spark/Account/Profile/Profile.tsx

import React, {useEffect, useState} from 'react';
import * as client from "../client";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentUser} from "../reducer";

export default function Profile() {
    const {uid} = useParams();
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    const [profile, setProfile] = useState<any>({});
    const [isEditable, setIsEditable] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchProfile = async () => {
        try {
            let fetchedProfile;
            if (uid) {
                fetchedProfile = await client.getUserProfile(uid);
            } else {
                fetchedProfile = await client.profile();
            }
            setProfile(fetchedProfile);
            setIsEditable(canEdit(currentUser, fetchedProfile));
        } catch (err: any) {
            console.log("DEBUG: Profile.tsx -> fetchProfile -> err", err);
            navigate("/Account/Signin");
        }
    };

    const updateProfile = async () => {
        try {
            await client.updateProfile(profile);
            dispatch(setCurrentUser(profile));
        } catch (err: any) {
            console.log("DEBUG: Profile.tsx -> updateProfile -> err", err);
        }
    };

    const deleteProfile = async () => {
        if (window.confirm("Are you sure you want to delete this profile?")) {
            try {
                await client.deleteProfile(profile._id);
                navigate("/Account/Signin");
            } catch (err: any) {
                console.log("DEBUG: Profile.tsx -> deleteProfile -> err", err);
            }
        }
    };

    const signout = async () => {
        await client.signout();
        dispatch(setCurrentUser(null));
        navigate("/Account/Signin");
    };

    useEffect(() => {
        fetchProfile();
    }, [uid, fetchProfile]);

    const canEdit = (currentUser: any, profileUser: any) => {
        try {
            return currentUser.role === 'ADMIN' || currentUser._id === profileUser._id;
        } catch (e) {
            console.log("DEBUG: Profile.tsx -> canEdit -> e", e);
            return false;
        }
    };

    const canViewFull = (currentUser: any, profileUser: any) => {
        try {
            return ['ADMIN', 'VIP'].includes(currentUser.role) || currentUser._id === profileUser._id;
        } catch (err) {
            console.log("DEBUG: Profile.tsx -> canViewFull -> err", err);
            return false;
        }
    };

    const renderField = (label: string, value: string, fieldName: string) => {
        try {
            const canViewField = canViewFull(currentUser, profile) || ['username', 'firstName', 'lastName'].includes(fieldName);
            if (!canViewField) return null;
        } catch (e) {
            console.log("DEBUG: Profile.tsx -> renderField -> e", e);
            return null;
        }

        return (
            <div className="mb-3">
                <label className="form-label">{label}</label>
                <input
                    className={`form-control wd-${fieldName.toLowerCase()}`}
                    value={value}
                    onChange={(e) => setProfile({...profile, [fieldName]: e.target.value})}
                    readOnly={!isEditable}
                />
            </div>
        );
    };

    return (
        <div className="wd-profile-screen">
            <h1>{profile.username}'s Profile</h1>
            {profile && (
                <div className="container mt-4">
                    {renderField("Username", profile.username, "username")}
                    {renderField("First Name", profile["first_name"], "firstName")}
                    {renderField("Last Name", profile["last_name"], "lastName")}
                    {renderField("Email", profile.email, "email")}
                    {renderField("Date of Birth", profile.dob, "dob")}

                    {isEditable && (
                        <div className="mb-3">
                            <label className="form-label">Role</label>
                            <select
                                className="form-control wd-role"
                                value={profile.role}
                                onChange={(e) => setProfile({...profile, role: e.target.value})}
                            >
                                <option value="USER">User</option>
                                <option value="VIP">VIP</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    )}

                    {isEditable && (
                        <>
                            <button onClick={updateProfile} className="btn btn-primary w-100 mb-2">
                                Update Profile
                            </button>
                            {currentUser.role === 'ADMIN' && currentUser._id !== profile._id && (
                                <button onClick={deleteProfile} className="btn btn-danger w-100 mb-2">
                                    Delete Profile
                                </button>
                            )}
                        </>
                    )}

                    {currentUser._id === profile._id && (
                        <button onClick={signout} id="wd-signout-btn" className="btn btn-warning w-100">
                            Sign out
                        </button>
                    )}
                </div>

                /*TODO: Add the three views */

            )}
        </div>
    );
}

