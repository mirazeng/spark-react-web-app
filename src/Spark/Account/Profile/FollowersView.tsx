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
        <div className="followers-view mt-4">
            <h3>Followers</h3>
            <br/>
            {followers.length === 0 ? (
                <p>No followers yet.</p>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                    {followers.map((user: any) => (
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
                                    <button className="card-title mb-0 btn btn-outline-dark"
                                            key={user.username}
                                            onClick={() => navigate
                                            (`/Account/Profile/${user.username}`)}>
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

export default FollowersView;