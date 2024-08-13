// File Path: src/Spark/Landing/index.tsx
import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import * as client from "../client";

interface Recipe {
    _id: string;
    name: string;
    imagePath: string;
    creator: string;
    description: string;
}

export default function SparkLanding() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const navigate = useNavigate();


    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const data = await client.getAllRecipes();
            setRecipes(data);
            console.log("DEBUG: SparkLanding -> fetchRecipes -> data", data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let data;
            switch (searchCriteria) {
                case 'name':
                    data = await client.searchRecipesByName(searchQuery);
                    break;
                case 'creator':
                    data = await client.searchRecipesByCreator(searchQuery);
                    break;
                case 'ingredient':
                    data = await client.searchRecipesByIngredient(searchQuery);
                    break;
                default:
                    data = await client.searchRecipes(searchQuery);
            }
            navigate(`/Results?query=${encodeURIComponent(searchQuery)}&criteria=${searchCriteria}`, {state: {recipes: data}});
        } catch (error) {
            console.error('Error searching recipes:', error);
        }
    };

    return (
        <div className="container-fluid mt-5 h-full d-flex flex-column">
            <div className="row flex-grow-1">
                <div className="col-12 col-lg-10 mx-auto d-flex flex-column justify-content-center">
                    <form className="d-flex mb-4" onSubmit={handleSearch}>
                        <select
                            className="form-select me-2"
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value)}
                        >
                            <option value="name">Name</option>
                            <option value="creator">Creator</option>
                            <option value="ingredient">Ingredient</option>
                        </select>
                        <input
                            className="form-control form-control-lg me-2"
                            type="search"
                            placeholder={`Search recipes by ${searchCriteria}...`}
                            aria-label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-danger btn-lg" type="submit">Go</button>
                    </form>

                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                        {recipes.map((recipe) => (
                            <div className="col" key={recipe._id}>
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={recipe.imagePath}
                                        className="card-img-top"
                                        alt={recipe.name}
                                        style={{height: '120px', objectFit: 'cover'}}
                                    />
                                    <div className="card-body p-2">
                                        <h6 className="card-title mb-0">{recipe.name}</h6>
                                        <p className="card-text small text-muted mb-2"
                                           style={{height: '3em', overflow: 'hidden'}}>
                                            {recipe.description}
                                        </p>
                                        <Link to={`/RecipeDetail/${recipe._id}`}
                                              className="btn btn-sm btn-outline-info">
                                            View
                                        </Link>
                                    </div>
                                    <div className="card-footer p-2">
                                        <small className="text-muted">
                                            By: <Link to={`/Account/Profile/${recipe.creator}`}
                                                      className="text-decoration-none">{recipe.creator}</Link>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}