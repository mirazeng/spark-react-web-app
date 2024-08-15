import React, {useEffect, useState} from 'react';
import * as client from '../../recipe-client';
import {searchRecipesByCreator} from "../../recipe-client";

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
        <div className="recipes-view">
            <h3>Recipes</h3>
            <div className="recipe-grid">
                {recipes.map((recipe: any) => (
                    <div key={recipe._id} className="recipe-card">
                        <img src={recipe.image || '/default-recipe.jpg'} alt={recipe.name}/>
                        <h4>{recipe.name}</h4>
                        <p>{recipe.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipesView;