
import {Route, Routes, Navigate, Link, useNavigate, useLocation} from "react-router-dom";
import SparkLanding from "./Landing";
import Account from "./Account";
import {useSelector} from "react-redux";
import Session from "./Account/Session";
import React, {useState} from "react";
import {FaBookmark} from 'react-icons/fa';
import SearchResults from "./Result";
import RecipeDetail from "./Details";
import * as client from "./client";

function Navigation() {
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const navigate = useNavigate();
    const location = useLocation();

    const isLandingPage = location.pathname === '/' || location.pathname === '/Home';

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
        <div className="row mt-2 mx-5">
            <div className="col-6">
                <Link to="/" className="text-decoration-none">
                    <div className="fs-1 fw-bold">
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
                    <form className="d-flex me-2" onSubmit={handleSearch}>
                        <select
                            className="form-select me-2"
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value)}
                            style={{width: 'auto'}}
                        >
                            <option value="name">Name</option>
                            <option value="creator">Creator</option>
                            <option value="ingredient">Ingredient</option>
                        </select>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder={`Search by ${searchCriteria}...`}
                            aria-label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                )}
                {currentUser ? (
                    <>
                        <Link to="/Account/Profile" className="btn btn-outline-primary me-2">
                            {currentUser.username}
                        </Link>
                        <Link to="/Account/Profile/bookmarks" className="btn btn-outline-secondary">
                            <FaBookmark/>
                        </Link>
                    </>
                ) : (
                    <div className="btn-group">
                        <Link to="/Account/Signin" className="btn btn-outline-success">Sign in</Link>
                        <Link to="/Account/Signup" className="btn btn-outline-primary">Sign up</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function Footer() {
    /* My Full name, link to frontend and backend github repo */
    return (
        <>

            <div className=" row mt-2 mx-5">
                <hr></hr>
                <h2> Miranda Zeng </h2>
                <a href={"https://github.com/mirazeng/spark-react-web-app"}> React Frontend Repo Link </a>
                <a href={"https://github.com/mirazeng/spark-server-app"}> Node Backend Repo Link</a>

            </div>
        </>
    )
}

export default function Spark() {
    return (
        <Session>
            <Navigation/>
            <div id="wd-spark">
                <Routes>
                    <Route path="*" element={<Navigate to="Home"/>}/>
                    <Route path="/" element={<SparkLanding/>}/>
                    <Route path="Home" element={<SparkLanding/>}/>
                    <Route path="Account/*" element={<Account/>}/>
                    <Route path={"Results/*"} element={<SearchResults/>}/>
                    <Route path="RecipeDetail/:recipeID" element={<RecipeDetail/>}/>
                </Routes>
            </div>
            <Footer/>
        </Session>
    );
}