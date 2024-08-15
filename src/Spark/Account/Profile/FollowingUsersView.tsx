import React, {useEffect, useState} from 'react';
import * as client from '../account-client'
import {useNavigate} from "react-router-dom";
import {cursorTo} from "node:readline";

interface FollowingUsersViewProps {
    username: string;
}

const FollowingUsersView: React.FC<FollowingUsersViewProps> = ({username}) => {
    const [following, setFollowing] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                setLoading(true);
                const userFollowing = await client.getUserFollowing(username);
                setFollowing(userFollowing);
                setError(null);
            } catch (error) {
                console.error('Error fetching following users:', error);
                setError('Failed to fetch following users. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchFollowing();
    }, [username]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleProfilePictureClick = (user: any) => {
        navigate(`/Account/Profile/${user.username}`);
    }

    return (
        <div className="following-users-view">
            <h3>Following</h3>
            {following.length === 0 ? (
                <p>Not following anyone yet.</p>
            ) : (
                <ul className="user-list">
                    {following.map((user: any) => (
                        <li key={user._id} className="user-item">
                            <img
                                onClick={() => handleProfilePictureClick(user)}
                                src={user.profilePicture || '/default-avatar.png'}
                                alt={user.username}
                                className="user-avatar"
                                style={{cursor:"pointer"}}/>
                            <span>
                                <button key={user.username}
                                        onClick={() => navigate(`/Account/Profile/${user.username}`)}>
                                    {user.username}
                                </button>
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FollowingUsersView;