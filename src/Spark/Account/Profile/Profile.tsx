import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setCurrentUser} from '../reducer';
import * as client from '../account-client';
import RecipesView from './RecipesView';
import BookmarksView from './BookmarksView';
import FollowingUsersView from './FollowingUsersView';
import FollowersView from './FollowersView';
import {FaEdit, FaSave} from 'react-icons/fa';

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
            /*if (username === 'self' || !username || username === currentUser.username) {
                fetchedProfile = await client.profile();*/
            if (username === 'self') {
                if (!currentUser) {
                    navigate("/Account/Signin");
                    return;
                }
                fetchedProfile = await client.profile();
            } else {
                if (typeof username === "string") {
                    fetchedProfile = await client.getUserProfile(username);
                }
            }
            setProfile(fetchedProfile);
            setEditedProfile(fetchedProfile);
            setIsEditable(canEdit(currentUser, fetchedProfile));
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
            setEditedProfile(profile)
        }
        setIsEditing(!isEditing);
    };

    const handleSaveProfile = async () => {
        try {
            await client.updateProfile(editedProfile);
            setProfile(editedProfile);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile. Please try again.");
        }
    };


    const renderFollowInfo = () => (!isAnonymous && (<div className="follow-info">
        <div className="follow-item">
            <span className="follow-count">{profile.followers?.length || 0}</span>
            <span className="follow-label fw-bold">Followers</span>
        </div>
        <div className="follow-item">
            <span className="follow-count">{profile.following?.length || 0}</span>
            <span className="follow-label fw-bold">Following</span>
        </div>
    </div>));


    const renderProfileHeader = () => (<div className="profile-header">
        <div className="profile-picture-container">
            <img
                src={editedProfile.profilePicture || "/logo192.png"}
                alt="Profile"
                className="profile-picture"
            />
            {isEditable && (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div className="row-1" style={{marginBottom: '5px'}}>
                        <button onClick={toggleEditing} className="edit-button">
                            <FaEdit/> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                    </div>
                    {isEditing && (
                        <div className="row-2">
                            <button onClick={handleSaveProfile} className="edit-button">
                                <FaSave/>Save Profile
                            </button>
                        </div>
                    )}
                </div>)}
        </div>
        <div className="profile-content">
            <div className="profile-info">
                {isEditing && isEditable ? (
                    <div className="edit-form">
                        <div>
                            <label htmlFor="first_name">First Name: </label>
                            <input
                                name="first_name"
                                value={editedProfile.first_name}
                                onChange={handleInputChange}
                                placeholder="First Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name">Last Name: </label>
                            <input
                                name="last_name"
                                value={editedProfile.last_name}
                                onChange={handleInputChange}
                                placeholder="Last Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="username">UserName: </label>
                            <input
                                name="username"
                                value={editedProfile.username}
                                onChange={handleInputChange}
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password: </label>
                            <input
                                name="password"
                                value={editedProfile.password}
                                onChange={handleInputChange}
                                placeholder="Password"
                            />
                        </div>
                        {isAdmin && (
                            <div>
                                <label htmlFor="role">Role: </label>
                                <select
                                    name="role"
                                    value={editedProfile.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="USER">USER</option>
                                    <option value="VIP">VIP</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>)}
                        <div>
                            <label htmlFor="gender">Gender: </label>
                            <input
                                name="gender"
                                value={editedProfile.gender}
                                onChange={handleInputChange}
                                placeholder="Gender"
                            />
                        </div>
                        <div>
                            <label htmlFor="description">Description: </label>
                            <textarea
                                name="description"
                                value={editedProfile.description}
                                onChange={handleInputChange}
                                placeholder="Description"
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email: </label>
                            <input
                                name="email"
                                value={editedProfile.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone">Phone: </label>
                            <input
                                name="phone"
                                value={editedProfile.phone}
                                onChange={handleInputChange}
                                placeholder="Phone"
                            />
                        </div>
                    </div>) : (
                    <div>
                        <h2>{profile.first_name} {profile.last_name}</h2>
                        <p>Username: {profile.username}</p>
                        {!isAnonymous && (isOwnProfile || isAdmin) && (
                            <div>
                                <p>Password: {profile.password}</p>
                                <p>Email: {profile.email}</p>
                                <p>Phone: {profile.phone}</p>
                            </div>)}
                        <p>Role: {profile.role}</p>
                        <p>Gender: {profile.gender}</p>
                        <p>Description: {profile.description}</p>
                    </div>)}
                {!isAnonymous && !isOwnProfile && (<div className="pt-2 pb-2">
                    <button
                        onClick={profile.followers?.includes(currentUser.username) ? unfollowUser : followUser}
                        style={{
                            padding: '10px 20px',
                            marginRight: '10px',
                            backgroundColor: 'white',
                            border: '1px solid #DB7093',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            color: '#DB7093',
                        }}>
                        {profile.followers?.includes(currentUser.username) ? 'Unfollow' : 'Follow'}
                    </button>
                </div>)}
                {renderFollowInfo()}
            </div>
        </div>
    </div>);


    const renderTabPane = () => {
        const tabs = ['Recipes', 'Bookmarks', 'Following', 'Followers'];
        return (!isAnonymous && (<div className="tab-pane"
                                      style={{
                                          display: 'flex',
                                          justifyContent: 'flex-start',
                                          marginTop: '20px',
                                          marginLeft: '185px',
                                          borderBottom: '1px solid #e0e0e0',
                                          paddingBottom: '10px'
                                      }}>
            {tabs.map((tabName) => ((tabName !== 'Bookmarks' || isOwnProfile || isAdmin) && (<Link
                key={tabName}
                to={`/Account/Profile/${isOwnProfile ? 'self' : profile.username}/${tabName}`}
                style={{
                    padding: '10px 20px',
                    marginRight: '10px',
                    backgroundColor: location.pathname.includes(tabName) ? '#DB7093' : '#f0f0f0',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: location.pathname.includes(tabName) ? 'white' : '#333',
                    fontWeight: 'bold'
                }}
                className={location.pathname.includes(tabName) ? 'active-tab' : ''}
            >
                {tabName}
            </Link>)))}
        </div>));
    };


    const renderAdminUserList = () => (isAdmin && (<div className="admin-user-list mt-4">
        <br/>
        <h3>All Users:</h3>
        <div className="d-flex flex-wrap justify-content-start align-items-center mt-3">
            {allUsers.map(user => (<div
                key={user._id}
                className="user-preview m-2"
                onClick={() => navigate(`/Account/Profile/${user.username}`)}>
                <img
                    src={user.profilePicture || "/logo192.png"}
                    alt={user.username}
                    className="rounded-circle"
                    style={{
                        width: '50px', height: '50px', objectFit: 'cover', border: '1px transparent solid'
                    }}
                    title={user.username}
                />
            </div>))}
        </div>
    </div>));

    return (<div className="profile-page-wrapper">
        {renderProfileHeader()}
        {renderTabPane()}
        <div className="content-wrapper">
            {renderContent()}
        </div>
        {renderAdminUserList()}
        <br/>
        <br/>
        {isOwnProfile && (<button className="btn btn-lg btn-danger" onClick={signout}>Sign out</button>)}
    </div>);
}
