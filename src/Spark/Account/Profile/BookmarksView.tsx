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
        <div className="bookmarks-view mt-4">
            <h3>Bookmarked Recipes</h3>
            <br />
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                {bookmarks.length === 0 ? (
                    <p>No bookmarks found.</p>
                ) : (
                    bookmarks.map((recipe: Recipe) => (
                        <div className="col" key={recipe.idMeal}>
                            <div className="card h-100 shadow-sm">
                                <img src={recipe.strMealThumb}
                                     className="card-img-top"
                                     alt={recipe.strMeal}
                                     style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body p-2">
                                    <h6 className="card-title mb-0">{recipe.strMeal}</h6>
                                    <p className="card-text small text-muted mb-2"
                                       style={{ height: '3em', overflow: 'hidden' }}>
                                        {recipe.strInstructions}
                                    </p>
                                    <Link to={`/RemoteRecipeDetail/${recipe.idMeal}`}
                                          className="btn btn-sm btn-outline-info">
                                        View
                                    </Link>
                                </div>
                                <br />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BookmarksView;