import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import * as client from "../recipe-client";

interface Recipe {
    _id: string;
    name: string;
    imagePath: string;
    creator: string;
    description: string;
    likes: number;
}

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const query = searchParams.get('query') || '';
    const criteria = searchParams.get('criteria') || '';
    const location = useLocation();

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                let data;
                if (location.state && location.state.recipes) {
                    data = location.state.recipes;
                } else {
                    switch (criteria) {
                        case 'name':
                            data = await client.searchRecipesByName(query);
                            break;
                        case 'creator':
                            data = await client.searchRecipesByCreator(query);
                            break;
                        case 'ingredient':
                            data = await client.searchRecipesByIngredient(query);
                            break;
                        default:
                            data = await client.searchRecipes(query);
                    }
                }
                setRecipes(data);
            } catch (error) {
                console.error('Error searching recipes:', error);
            }
        };

        fetchSearchResults();
    }, [query, criteria, location.state]);

    return (
        <div className="container mt-4">
            <h2>Search Results for "{query}"{criteria ? ` in ${criteria}` : ''}</h2>
            <div className="list-group">
                {recipes.map((recipe) => (
                    <Link
                        to={`/RecipeDetail/${recipe._id}`}
                        className="list-group-item list-group-item-action flex-column align-items-start mb-3"
                        key={recipe._id}
                    >
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{recipe.name}</h5>
                            <small className="text-danger">{recipe.likes} likes</small>
                        </div>
                        <div className="d-flex">
                            <img
                                src={recipe.imagePath}
                                alt={recipe.name}
                                className="me-3"
                                style={{width: '100px', height: '100px', objectFit: 'cover'}}
                            />
                            <div className="d-flex flex-column justify-content-end" style={{flex: 1}}>
                                <p className="mb-2">{recipe.description}</p>
                                <small className="text-success">Created by: {recipe.creator}</small>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}