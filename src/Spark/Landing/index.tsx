// File Path: src/Spark/Landing/index.tsx
import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import * as client from "../recipe-client";
import * as accountClient from "../Account/account-client";
import ProfilePreview from "./ProfilePreview";
import {useSelector} from "react-redux";

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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);
    const {CurrentUser} = useSelector((state: any) => state.accountReducer);


    useEffect(() => {
        fetchRecipes();
        checkLoginStatus();
        const fetchUserData = async () => {
            try {
                const userData = await accountClient.profile();
                setUser(userData);
            } catch (error) {
                setUser(null);
            }
        };
        fetchUserData();
    }, [CurrentUser]);
    const isVipOrAdmin = user && (user.role === 'VIP' || user.role === 'ADMIN');

    const fetchRecipes = async () => {
        try {
            const data = await client.getAllRecipes();
            setRecipes(data);
            console.log("DEBUG: SparkLanding -> fetchRecipes -> data", data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const checkLoginStatus = async () => {
        try {
            const user = await accountClient.profile();
            setIsLoggedIn(!!user);
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
        }
    };

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let data;
            if (searchCriteria === 'mealdb') {
                if (isVipOrAdmin) {
                    data = await client.searchRemoteRecipes(searchQuery);
                    navigate(`/RemoteResults?query=${encodeURIComponent(searchQuery)}`);
                } else {
                    alert('Join Spark Premium to search in MealDB.');
                    return;
                }
            } else {
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
            }
        } catch (error) {
            console.error('Error searching recipes:', error);
        }
    };

    return (
        <div className="container-fluid mt-5 h-full d-flex flex-column">
            <div className="row flex-grow-1">
                <div className="col-12 col-lg-10 mx-auto d-flex flex-column justify-content-center">
                    {isLoggedIn &&
                        (<div className="mb-4">
                            <ProfilePreview />
                        </div>)
                    }
                    <form className="d-flex mb-4" onSubmit={handleSearch}>
                        <select
                            className="form-select me-2 w-auto"
                            style={{ minWidth: '120px'}}
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value)}
                        >
                            <option value="name">Name</option>
                            <option value="creator">Creator</option>
                            <option value="ingredient">Ingredient</option>
                            <option value="mealdb">MealDB Search</option>
                        </select>
                        <input
                            className="form-control form-control-lg me-2 flex-grow-1"
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
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body p-2">
                                        <h6 className="card-title mb-0">{recipe.name}</h6>
                                        <p className="card-text small text-muted mb-2"
                                           style={{ height: '3em', overflow: 'hidden' }}>
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