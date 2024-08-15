import React, {useEffect, useState} from 'react';
import * as client from '../account-client'
import {useNavigate} from "react-router-dom";

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
        <div className="following-users-view mt-4">
            <h3>Following</h3>
            <br/>
            {following.length === 0 ? (
                <p>Not following anyone yet.</p>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                    {following.map((user: any) => (
                        <div key={user._id} className="user-item col">
                            <div className="card h-100 shadow-sm">
                                <img
                                    onClick={() => handleProfilePictureClick(user)}
                                    src={user.profilePicture || '/default-avatar.png'}
                                    alt={user.username}
                                    className="user-avatar card-img-top"
                                    style={{cursor: "pointer", height: '200px', objectFit: 'cover'}}/>
                                <span>
                                    <div className="card-body p-2">
                                        <button
                                            className="card-title mb-0 btn btn-outline-dark"
                                            key={user.username}
                                            onClick={() => navigate(`/Account/Profile/${user.username}`)}>
                                        {user.username}
                                        </button>
                                    </div>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FollowingUsersView;