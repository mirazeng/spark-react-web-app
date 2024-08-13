import React, {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import {getRecipeById, getRecipesByCreator, incrementLikes} from './client';
import {FaHeart, FaClock} from 'react-icons/fa';

interface Recipe {
    _id: string;
    name: string;
    description: string;
    creator: string;
    likes: number;
    createdAt: string;
    updatedAt: string;
    instructions: string[];
    imagePath: string;
}

export default function RecipeDetail() {
    const {recipeID} = useParams<{ recipeID: string }>();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            if (recipeID) {
                try {
                    const recipeData = await getRecipeById(recipeID);
                    setRecipe(recipeData);
                    if (recipeData.creator) {
                        const creatorRecipes = await getRecipesByCreator(recipeData.creator);
                        setRelatedRecipes(creatorRecipes.filter((r: Recipe) => r._id !== recipeID).slice(0, 3));
                    }
                } catch (error) {
                    console.error('Error fetching recipe details:', error);
                }
            }
        };
        fetchRecipeDetails();
    }, [recipeID]);

    const handleLike = async () => {
        if (recipeID && recipe && !isLiking) {
            setIsLiking(true);
            try {
                await incrementLikes(recipeID);
                setRecipe(prevRecipe => {
                    if (prevRecipe) {
                        return {...prevRecipe, likes: prevRecipe.likes + 1};
                    }
                    return prevRecipe;
                });
            } catch (error) {
                console.error('Error incrementing likes:', error);
            } finally {
                setIsLiking(false);
            }
        }
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <h1 className="display-4">{recipe.name}</h1>
            </div>

            <div className="row mb-4">
                <p className="lead">{recipe.description}</p>
            </div>

            <div className="row mb-4">
                <div className="col">
                    <Link to={`/Account/Profile/${recipe.creator}`} className="text-decoration-none">
                        <span className="fs-5">By: {recipe.creator}</span>
                    </Link>
                </div>
                <div className="col text-end">
                    <button
                        onClick={handleLike}
                        className="btn btn-outline-danger me-3"
                        disabled={isLiking}
                    >
                        <FaHeart/> {recipe.likes}
                    </button>
                    <span><FaClock/> Created: {new Date(recipe.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="row mb-4">
                <h3>Instructions</h3>
                {recipe.instructions && recipe.instructions.map((step, index) => (
                    <div key={index} className="mb-2">
                        <strong>Step {index + 1}:</strong> {step}
                    </div>
                ))}
            </div>

            <div className="row">
                <h3>More from {recipe.creator}</h3>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {relatedRecipes.map((relatedRecipe) => (
                        <div className="col" key={relatedRecipe._id}>
                            <div className="card h-100">
                                <img src={relatedRecipe.imagePath} className="card-img-top" alt={relatedRecipe.name}/>
                                <div className="card-body">
                                    <h5 className="card-title">{relatedRecipe.name}</h5>
                                    <Link to={`/RecipeDetail/${relatedRecipe._id}`} className="btn btn-primary">View
                                        Recipe</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}