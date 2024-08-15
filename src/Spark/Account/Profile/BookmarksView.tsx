import React, {useEffect, useState} from 'react';
import * as accountClient from '../account-client';
import * as recipeClient from '../../recipe-client';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

interface BookmarksViewProps {
    username: string;
}

interface Bookmark {
    idMeal: string;
    bookmarkedAt: string;
}

interface Recipe {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strInstructions: string;
}

const BookmarksView: React.FC<BookmarksViewProps> = ({username}) => {
    const [bookmarks, setBookmarks] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {currentUser} = useSelector((state: any) => state.accountReducer);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                setLoading(true);
                setError(null);
                const userBookmarks = await accountClient.getUserBookmarks(username);
                const recipePromises = userBookmarks.map((bookmark: Bookmark) =>
                    recipeClient.getRemoteRecipeDetails(bookmark.idMeal)
                );
                const recipeDetails = await Promise.all(recipePromises);
                const recipes = recipeDetails.map(detail => detail.meals[0]).filter(Boolean);
                setBookmarks(recipes);
            } catch (err) {
                console.error('Error fetching bookmarks:', err);
                setError('Failed to load bookmarks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && (currentUser.role === 'VIP' || currentUser.role === 'ADMIN' || currentUser.username === username)) {
            fetchBookmarks();
        }
    }, [username, currentUser]);

    if (!currentUser || (currentUser.role !== 'VIP' && currentUser.role !== 'ADMIN' && currentUser.username !== username)) {
        return <div>You don't have permission to view these bookmarks.</div>;
    }

    if (loading) {
        return <div>Loading bookmarks...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="bookmarks-view">
            <h3>Bookmarked Recipes</h3>
            {bookmarks.length === 0 ? (
                <p>No bookmarks found.</p>
            ) : (
                <div className="recipe-grid">
                    {bookmarks.map((recipe: Recipe) => (
                        <div key={recipe.idMeal} className="recipe-card">
                            <img src={recipe.strMealThumb} alt={recipe.strMeal}/>
                            <h4>{recipe.strMeal}</h4>
                            <p>{recipe.strInstructions.substring(0, 100)}...</p>
                            <Link to={`/RemoteRecipeDetail/${recipe.idMeal}`}>View Details</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookmarksView;