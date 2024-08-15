import React, {useEffect, useState} from 'react';
import * as client from '../account-client';
import {useNavigate} from "react-router-dom";

interface FollowersViewProps {
    username: string;
}

const FollowersView: React.FC<FollowersViewProps> = ({username}) => {
    const [followers, setFollowers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                setLoading(true);
                const userFollowers = await client.getUserFollowers(username);
                setFollowers(userFollowers);
                setError(null);
            } catch (error) {
                console.error('Error fetching followers:', error);
                setError('Failed to fetch followers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchFollowers();
    }, [username]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleProfilePictureClick = (user: any) => {
        navigate(`/Account/Profile/${user.username}`);
    }

    return (
        <div className="followers-view">
            <h3>Followers</h3>
            {followers.length === 0 ? (
                <p>No followers yet.</p>
            ) : (
                <ul className="user-list">
                    {followers.map((user: any) => (
                        <li key={user._id} className="user-item">
                            <img
                                onClick={() => handleProfilePictureClick(user)}
                                src={user.profilePicture || '/default-avatar.png'}
                                alt={user.username}
                                className="user-avatar"
                                style={{cursor: "pointer"}}/>
                            <span>
                                <button key={user.username} onClick={() => navigate
                                (`/Account/Profile/${user.username}`)}>
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

export default FollowersView;