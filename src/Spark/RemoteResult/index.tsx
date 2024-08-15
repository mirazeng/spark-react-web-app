import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import * as client from "../recipe-client";

interface RemoteRecipe {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strArea: string;
    strCategory: string;
}

export default function RemoteSearchResults() {
    const [searchParams] = useSearchParams();
    const [recipes, setRecipes] = useState<RemoteRecipe[]>([]);
    const query = searchParams.get('query') || '';
    const location = useLocation();

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                let data;
                if (location.state && location.state.recipes) {
                    data = location.state.recipes;
                } else {
                    data = await client.searchRemoteRecipes(query);
                }
                setRecipes(data.meals || []);
            } catch (error) {
                console.error('Error searching remote recipes:', error);
            }
        };

        fetchSearchResults();
    }, [query, location.state]);

    return (
        <div className="container mt-4">
            <h2>Remote Search Results for "{query}"</h2>
            <div className="list-group">
                {recipes.map((recipe) => (
                    <Link
                        to={`/RemoteRecipeDetail/${recipe.idMeal}`}
                        className="list-group-item list-group-item-action flex-column align-items-start mb-3"
                        key={recipe.idMeal}
                    >
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{recipe.strMeal}</h5>
                            <small>{recipe.strArea} - {recipe.strCategory}</small>
                        </div>
                        <div className="d-flex">
                            <img
                                src={recipe.strMealThumb}
                                alt={recipe.strMeal}
                                className="mr-3"
                                style={{width: '100px', height: '100px', objectFit: 'cover'}}
                            />
                            <div>
                                <p className="mb-1">Category: {recipe.strCategory}</p>
                                <small>Area: {recipe.strArea}</small>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}