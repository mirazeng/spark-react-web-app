import React, {useEffect, useState} from 'react';
import {useNavigate, useParams, Link, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setCurrentUser} from '../reducer';
import * as client from '../account-client';
import RecipesView from './RecipesView';
import BookmarksView from './BookmarksView';
import FollowingUsersView from './FollowingUsersView';
import FollowersView from './FollowersView';

import {FaEdit} from 'react-icons/fa';

export default function Profile() {
    const {username, tab} = useParams();
    const location = useLocation();
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    const [profile, setProfile] = useState<any>({});
    const [isEditable, setIsEditable] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<any>({});
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const fetchProfile = async () => {
        try {
            let fetchedProfile;
            if (username === 'self' || !username || username === currentUser.username) {
                fetchedProfile = await client.profile();
            } else {
                fetchedProfile = await client.getUserProfile(username);
            }
            setProfile(fetchedProfile);
            setEditedProfile(fetchedProfile);
            setIsEditable(canEdit(currentUser, fetchedProfile));
        } catch (err: any) {
            console.log("DEBUG: Profile.tsx -> fetchProfile -> err", err);
            navigate("/Account/Signin");
        }
    };

    const updateProfile = async () => {
        try {
            await client.updateProfile(editedProfile);
            // dispatch(setCurrentUser(editedProfile));
            setProfile(editedProfile);
            setIsEditing(false);
            fetchProfile();
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

    const followUser = async () => {
        try {
            await client.followUser(profile.username);
            fetchProfile();
        } catch (err: any) {
            console.log("DEBUG: Profile.tsx -> followUser -> err", err);
        }
    };

    const unfollowUser = async () => {
        try {
            await client.unfollowUser(profile.username);
            fetchProfile();
        } catch (err: any) {
            console.log("DEBUG: Profile.tsx -> unfollowUser -> err", err);
        }
    };

    const fetchAllUsers = async () => {
        if (currentUser && currentUser.role === 'ADMIN') {
            const users = await client.getAllUsers();
            setAllUsers(users);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchAllUsers();
    }, [username, tab, currentUser]);


    const renderContent = () => {
        const currentTab = tab || 'Recipes';
        switch (currentTab) {
            case 'Recipes':
                return <RecipesView username={profile.username}/>;
            case 'Bookmarks':
                return (isOwnProfile || isAdmin) ? <BookmarksView username={profile.username}/> : null;
            case 'Following':
                return <FollowingUsersView username={profile.username}/>;
            case 'Followers':
                return <FollowersView username={profile.username}/>;
            default:
                return <RecipesView username={profile.username}/>;
        }
    };


    const canEdit = (currentUser: any, profileUser: any) => {
        if (!currentUser || !profileUser) return false;
        return currentUser.role === 'ADMIN' || currentUser.username === profileUser.username;
    };

    const isOwnProfile = username === 'self' || (currentUser && profile && currentUser.username === profile.username);
    const isAdmin = currentUser && currentUser.role === 'ADMIN';
    const isAnonymous = !currentUser;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setEditedProfile((prev: any) => ({...prev, [name]: value}));
    };

    const toggleEditing = () => {
        if (isEditing) {
            // If we're exiting edit mode, reset the editedProfile to the current profile
            setEditedProfile(profile);
        }
        setIsEditing(!isEditing);
    };

    const renderFollowInfo = () => (
        !isAnonymous && (
            <div className="follow-info">
                <div className="follow-item">
                    <span className="follow-count">{profile.followers?.length || 0}</span>
                    <span className="follow-label fw-bold">Followers</span>
                </div>
                <div className="follow-item">
                    <span className="follow-count">{profile.following?.length || 0}</span>
                    <span className="follow-label fw-bold">Following</span>
                </div>
            </div>
        )
    );


    const renderProfileHeader = () => (
        <div className="profile-header">
            <div className="profile-picture-container">
                <img
                    src={editedProfile.profilePicture || "/logo192.png"}
                    alt="Profile"
                    className="profile-picture"
                />
                {isEditable && (
                    <button onClick={toggleEditing} className="edit-button">
                        <FaEdit/> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                )}
            </div>
            <div className="profile-content">
                <div className="profile-info">
                    {isEditing && isEditable ? (
                        <>
                            <input
                                name="first_name"
                                value={editedProfile.first_name}
                                onChange={handleInputChange}
                                placeholder="First Name"
                            />
                            <input
                                name="last_name"
                                value={editedProfile.last_name}
                                onChange={handleInputChange}
                                placeholder="Last Name"
                            />
                            <input
                                name="username"
                                value={editedProfile.username}
                                onChange={handleInputChange}
                                placeholder="Username"
                            />
                            {isAdmin && (
                                <select
                                    name="role"
                                    value={editedProfile.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="USER">USER</option>
                                    <option value="VIP">VIP</option>
                                    <option value="INFLUENCER">INFLUENCER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            )}
                            <input
                                name="gender"
                                value={editedProfile.gender}
                                onChange={handleInputChange}
                                placeholder="Gender"
                            />
                            <textarea
                                name="description"
                                value={editedProfile.description}
                                onChange={handleInputChange}
                                placeholder="Description"
                            />
                            <input
                                name="email"
                                value={editedProfile.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                            />
                            <input
                                name="phone"
                                value={editedProfile.phone}
                                onChange={handleInputChange}
                                placeholder="Phone"
                            />
                            <input
                                name="dob"
                                type="date"
                                value={new Date(editedProfile.dob).toISOString().split('T')[0]}
                                onChange={handleInputChange}
                            />
                        </>
                    ) : (
                        <>
                            <h2>{profile.first_name} {profile.last_name}</h2>
                            <p>Username: {profile.username}</p>
                            <p>Role: {profile.role}</p>
                            <p>Gender: {profile.gender}</p>
                            <p>Description: {profile.description}</p>
                            {!isAnonymous && (isOwnProfile || isAdmin) && (
                                <>
                                    <p>Email: {profile.email}</p>
                                    <p>Phone: {profile.phone}</p>
                                    <p>Date of Birth: {new Date(profile.dob).toLocaleDateString()}</p>
                                </>
                            )}
                        </>
                    )}
                    {!isAnonymous && !isOwnProfile && (
                        <button onClick={profile.followers?.includes(currentUser.username) ? unfollowUser : followUser}>
                            {profile.followers?.includes(currentUser.username) ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                    {renderFollowInfo()}
                </div>
            </div>
        </div>
    );


    const renderTabPane = () => {
        const tabs = ['Recipes', 'Bookmarks', 'Following', 'Followers'];
        return (
            !isAnonymous && (
                <div className="tab-pane">
                    {tabs.map((tabName) => (
                        (tabName !== 'Bookmarks' || isOwnProfile || isAdmin) && (
                            <Link
                                key={tabName}
                                to={`/Account/Profile/${isOwnProfile ? 'self' : profile.username}/${tabName}`}
                                className={location.pathname.includes(tabName) ? 'active-tab' : ''}
                            >
                                {tabName}
                            </Link>
                        )
                    ))}
                </div>
            )
        );
    };


    const renderAdminUserList = () => (
        isAdmin && (
            <div className="admin-user-list">
                <h3>All Users:</h3>
                {allUsers.map(user => (
                    <button key={user._id} onClick={() => navigate(`/Account/Profile/${user.username}`)}>
                        {user.username}
                    </button>
                ))}
            </div>
        )
    );

    return (
        <div className="profile-page-wrapper" style={{paddingLeft: '100px', paddingRight: '100px', paddingTop: '80px'}}>
            {renderProfileHeader()}
            {renderTabPane()}
            {renderContent()}
            {isOwnProfile && (
                <button onClick={signout}>Sign out</button>
            )}
            {renderAdminUserList()}
        </div>
    );
}
