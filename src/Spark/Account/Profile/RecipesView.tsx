import React, {useEffect, useState} from 'react';
import * as client from '../../recipe-client';
import {searchRecipesByCreator} from "../../recipe-client";
import {Link} from "react-router-dom";

interface RecipesViewProps {
    username: string;
}

const RecipesView: React.FC<RecipesViewProps> = ({username}) => {
    const [recipes, setRecipes] = useState([]);

    console.log('RecipesView rendered. Username:', username);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                console.log('Fetching recipes for user:', username);
                const userRecipes = await client.searchRecipesByCreator(username);
                console.log('Recipes fetched:', userRecipes);
                setRecipes(userRecipes);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };
        fetchRecipes();
    }, [username]);

    return (
        <div className="recipes-view mt-4">
            <h3>Recipes</h3>
            <br/>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                {recipes.map((recipe: any) => (
                    <div className="col" key={recipe._id}>
                        <div className="card h-100 shadow-sm">
                            <img src={recipe.imagePath || '/default-recipe.jpg'}
                                 className="card-img-top"
                                 alt={recipe.name}
                                 style={{height: '200px', objectFit: 'cover'}}
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
                            <br/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipesView;