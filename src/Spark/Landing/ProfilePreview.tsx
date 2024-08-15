import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as client from '../recipe-client';
import * as accountClient from '../Account/account-client';

interface User {
    username: string;
    profilePicture: string;
}

const ProfilePreview: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [recipeCount, setRecipeCount] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = await accountClient.profile();
                setUser(currentUser);

                if (currentUser) {
                    const userRecipes = await client.searchRecipesByCreator(currentUser.username);
                    setRecipeCount(userRecipes.length);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleCreateRecipe = () => {
        navigate('/create-recipe'); // Adjust this path as needed
    };

    if (!user) {
        return null; // Or a loading spinner
    }

    return (
        <div className="profile-preview card">
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <img
                        src={user.profilePicture || '/default-avatar.png'}
                        alt={user.username}
                        className="rounded-circle me-3"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <h5 className="card-title mb-0">{user.username}</h5>
                </div>
                <p className="card-text">Recipes created: {recipeCount}</p>
                <div className="d-flex justify-content-between">
                    <Link to={`/Account/Profile/${user.username}`} className="btn btn-outline-primary">
                        View Full Profile
                    </Link>
                    <button onClick={handleCreateRecipe} className="btn btn-success">
                        Create New Recipe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePreview;