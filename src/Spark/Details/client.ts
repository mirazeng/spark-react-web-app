import axios from 'axios';

const API_BASE = process.env.REACT_APP_REMOTE_SERVER || 'http://localhost:4000';

export const getRecipeById = async (recipeID: string) => {
    try {
        const response = await axios.get(`${API_BASE}/api/recipes/${recipeID}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;
    }
};

export const getRecipesByCreator = async (creator: string) => {
    try {
        const response = await axios.get(`${API_BASE}/api/recipes?creator=${creator}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes by creator:', error);
        throw error;
    }
};

export const incrementLikes = async (recipeID: string) => {
    try {
        const response = await axios.put(`${API_BASE}/api/recipes/${recipeID}/like`);
        return response.data;
    } catch (error) {
        console.error('Error incrementing likes:', error);
        throw error;
    }
};