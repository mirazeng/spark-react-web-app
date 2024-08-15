// File Path: src/Spark/index.tsx

import {Link, Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import SparkLanding from "./Landing";
import Account from "./Account";
import {useSelector} from "react-redux";
import Session from "./Account/Session";
import React, {useEffect, useState} from "react";
import {FaBookmark, FaGithub} from 'react-icons/fa';
import SearchResults from "./Result";
import RecipeDetail from "./Details";
import * as client from "./recipe-client";
import RemoteSearchResults from "./RemoteResult";
import RemoteRecipeDetail from "./RemoteRecipeDetail";
import * as accountClient from "./Account/account-client";

function Navigation() {
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any | null>(null);

    const isLandingPage = location.pathname === '/' || location.pathname === '/Home';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await accountClient.profile();
                setUser(userData);
            } catch (error) {
                setUser(null);
            }
        };
        fetchUserData();
    }, [currentUser]);
    const isVipOrAdmin = user && (user.role === 'VIP' || user.role === 'ADMIN');


    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let data;
            if (searchCriteria === 'mealdb') {
                if (isVipOrAdmin) {
                    data = await client.searchRemoteRecipes(searchQuery);
                    navigate(`/RemoteResults?query=${encodeURIComponent(searchQuery)}`);
                } else {
                    alert('Only VIP and Admin users can search MealDB.');
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

    return (<div className="row mt-2 mx-5">
            <div className="col-6">
                <Link to="/" className="text-decoration-none">
                    <div className="fs-1 fw-bold custom-name-font">
                        <span className="text-danger">S</span>
                        <span className="text-success">p</span>
                        <span className="text-primary">a</span>
                        <span className="text-warning">r</span>
                        <span className="text-info">k</span>
                    </div>
                </Link>
            </div>
            <div className="col-6 text-end d-flex justify-content-end align-items-center">
                {!isLandingPage && (
                    <form className="d-flex me-5" onSubmit={handleSearch}>
                        <select
                            className="form-select me-2"
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value)}
                            style={{width: 'auto'}}
                        >
                            <option value="name">Name</option>
                            <option value="creator">Creator</option>
                            <option value="ingredient">Ingredient</option>
                            <option value="mealdb">Search on MealDB</option>
                        </select>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder={`Search by ${searchCriteria}...`}
                            aria-label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-outline-danger"
                                type="submit"
                                style={{ minWidth:'80px'}}>
                            Search
                        </button>
                    </form>)}
                    {currentUser ?
                        (<>
                            <Link to="/Account/Profile"
                                  className="btn btn-outline-primary me-2">
                                {currentUser.username}
                            </Link>
                            <Link to="/Account/Profile/self/Bookmarks"
                                  className="btn btn-outline-secondary">
                                <FaBookmark/>
                            </Link>
                        </>) :
                    (<div className="d-flex">
                        <Link to="/Account/Signin" className="btn btn-outline-success me-2">Sign in</Link>
                        <Link to="/Account/Signup" className="btn btn-outline-primary">Sign up</Link>
                    </div>)}
            </div>
        </div>);
}

function Footer() {
    /* My Full name, link to frontend and backend GitHub repo */
    return (
        <div className=" row mt-2 mx-5">
            <hr/>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2 className="text-center mb-3 custom-name-font">Miranda Zeng</h2>
                    <div className="d-flex justify-content-center gap-4">
                        <a
                            href="https://github.com/mirazeng/spark-react-web-app"
                            className="text-decoration-none text-dark d-flex align-items-center"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGithub size={24} className="me-2"/>
                            <span>React Frontend Repo</span>
                        </a>
                        <a
                            href="https://github.com/mirazeng/spark-server-app"
                            className="text-decoration-none text-dark d-flex align-items-center"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGithub size={24} className="me-2"/>
                            <span>Node Backend Repo</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>)
}

function NotFound() {
    return (<div className="row mt-2 mx-5">
            <h1>404 Not Found</h1>
        </div>);

}

export default function Spark() {
    return (<Session>
            <Navigation/>
            <div id="wd-spark">
                <Routes>
                    <Route path="/" element={<Navigate to="/Home"/>}/>
                    <Route path="/Home" element={<SparkLanding/>}/>

                    <Route path="/Account/*" element={<Account/>}/>

                    <Route path="/Results/*" element={<SearchResults/>}/>
                    <Route path="/RecipeDetail/:recipeID" element={<RecipeDetail/>}/>

                    <Route path="/RemoteResults/*" element={<RemoteSearchResults/>}/>
                    <Route path="/RemoteRecipeDetail/:idMeal" element={<RemoteRecipeDetail/>}/>

                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>
            <Footer/>
        </Session>);
}