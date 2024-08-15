import axios from "axios";

const axiosNoCredentials = axios.create();
const axiosWithCredentials = axios.create({withCredentials: true});

export const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
export const RECIPES_API = `${REMOTE_SERVER}/api/recipes`;
export const REMOTE_RECIPES_API = `${REMOTE_SERVER}/api/remote-recipes`;
export const MEALDB_API = "https://www.themealdb.com/api/json/v1/1";

export const getAllRecipes = async () => {
    const response = await axiosNoCredentials.get(RECIPES_API);
    return response.data;
};

export const getRecipeById = async (recipeId: string) => {
    const response = await axiosNoCredentials.get(`${RECIPES_API}/${recipeId}`);
    return response.data;
};

export const searchRecipes = async (query: string) => {
    const response = await axiosNoCredentials.get(`${RECIPES_API}?query=${query}`);
    return response.data;
};

export const searchRecipesByName = async (name: string) => {
    const response = await axiosNoCredentials.get(`${RECIPES_API}?name=${name}`);
    return response.data;
};

export const searchRecipesByCreator = async (creator: string) => {
    const response = await axiosNoCredentials.get(`${RECIPES_API}?creator=${creator}`);
    return response.data;
};

export const searchRecipesByIngredient = async (ingredient: string) => {
    const response = await axiosNoCredentials.get(`${RECIPES_API}?ingredient=${ingredient}`);
    return response.data;
};

export const incrementLikes = async (recipeId: string) => {
    const response = await axiosWithCredentials
        .put(`${RECIPES_API}/${recipeId}/like`);
    return response.data;
};

export const searchRemoteRecipes = async (query: string) => {
    const response = await axiosNoCredentials.get(`${MEALDB_API}/search.php?s=${query}`);
    return response.data;
};

export const getRemoteRecipeDetails = async (idMeal: string) => {
    const response = await axiosNoCredentials
        .get(`${MEALDB_API}/lookup.php?i=${idMeal}`);
    return response.data;
};


export const addRemoteRecipeBookmark = async (idMeal: string) => {
    const response = await axiosWithCredentials
        .post(`${REMOTE_RECIPES_API}/${idMeal}/bookmark`);
    return response.data;
};

export const removeRemoteRecipeBookmark = async (idMeal: string) => {
    const response = await axiosWithCredentials
        .delete(`${REMOTE_RECIPES_API}/${idMeal}/bookmark`);
    return response.data;
};

export const isRemoteRecipeBookmarked = async (idMeal: string) => {
    const response = await axiosWithCredentials
        .get(`${REMOTE_RECIPES_API}/${idMeal}/is-bookmarked`);
    return response.data;
};

export const addRemoteRecipeComment = async (idMeal: string, comment: string) => {
    const response = await axiosWithCredentials
        .post(`${REMOTE_RECIPES_API}/${idMeal}/comments`, {comment});
    return response.data;
};

export const getRemoteRecipeComments = async (idMeal: string) => {
    const response = await axiosWithCredentials
        .get(`${REMOTE_RECIPES_API}/${idMeal}/comments`);
    return response.data;
};