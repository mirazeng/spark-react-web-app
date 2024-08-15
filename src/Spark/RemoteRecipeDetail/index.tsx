import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import { FaClock, FaBookmark} from 'react-icons/fa';
import * as client from '../recipe-client';

interface RemoteRecipe {
    idMeal: string;
    strMeal: string;
    strInstructions: string;
    strMealThumb: string;
    strArea: string;
    strCategory: string;
    // Add other fields as needed
}

export default function RemoteRecipeDetail() {
    const {idMeal} = useParams<{ idMeal: string }>();
    const [recipe, setRecipe] = useState<RemoteRecipe | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            if (idMeal) {
                try {
                    const recipeData = await client.getRemoteRecipeDetails(idMeal);
                    setRecipe(recipeData.meals[0]);
                    const bookmarkStatus = await client.isRemoteRecipeBookmarked(idMeal);
                    setIsBookmarked(bookmarkStatus.isBookmarked);
                    const recipeComments = await client.getRemoteRecipeComments(idMeal);
                    setComments(recipeComments);
                } catch (error) {
                    console.error('Error fetching remote recipe details:', error);
                }
            }
        };
        fetchRecipeDetails();
    }, [idMeal]);

    const handleBookmark = async () => {
        try {
            if (isBookmarked) {
                await client.removeRemoteRecipeBookmark(idMeal!);
            } else {
                await client.addRemoteRecipeBookmark(idMeal!);
            }
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    const handleAddComment = async () => {
        try {
            const addedComment = await client.addRemoteRecipeComment(idMeal!, newComment);
            setComments([...comments, addedComment]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <h1 className="display-4">{recipe.strMeal}</h1>
            </div>

            <div className="row mb-4">
                <div className="col">
                    <span className="fs-5">Area: {recipe.strArea}</span>
                </div>
                <div className="col text-end">
                    <button
                        onClick={handleBookmark}
                        className={`btn ${isBookmarked ? 'btn-warning' : 'btn-outline-warning'} me-3`}
                    >
                        <FaBookmark/> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                    <span><FaClock/> Category: {recipe.strCategory}</span>
                </div>
            </div>

            <div className="row mb-4">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="img-fluid"/>
            </div>

            <div className="row mb-4">
                <h3>Instructions</h3>
                <p>{recipe.strInstructions}</p>
            </div>

            <div className="row mb-4">
                <h3>Comments</h3>
                {comments.map((comment, index) => (
                    <div key={index} className="mb-2">
                        <Link
                            to={`/Account/Profile/${comment.username}`}><strong>{comment.username}:</strong></Link> {comment.comment}
                    </div>
                ))}
                <div className="mt-3">
                    <textarea
                        className="form-control mb-2"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                    />
                    <button className="btn btn-primary" onClick={handleAddComment}>
                        Add Comment
                    </button>
                </div>
            </div>
        </div>
    );
}