import axios from "axios";

const axiosWithCredentials = axios.create();

export const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
export const RECIPES_API = `${REMOTE_SERVER}/api/recipes`;

export const getAllRecipes = async () => {
    const response = await axiosWithCredentials.get(RECIPES_API);
    return response.data;
};

export const getRecipeById = async (recipeId: string) => {
    const response = await axiosWithCredentials.get(`${RECIPES_API}/${recipeId}`);
    return response.data;
};

export const searchRecipes = async (query: string) => {
    const response = await axiosWithCredentials.get(`${RECIPES_API}?query=${query}`);
    return response.data;
};

export const searchRecipesByName = async (name: string) => {
    const response = await axiosWithCredentials.get(`${RECIPES_API}?name=${name}`);
    return response.data;
};

export const searchRecipesByCreator = async (creator: string) => {
    const response = await axiosWithCredentials.get(`${RECIPES_API}?creator=${creator}`);
    return response.data;
};

export const searchRecipesByIngredient = async (ingredient: string) => {
    const response = await axiosWithCredentials.get(`${RECIPES_API}?ingredient=${ingredient}`);
    return response.data;
};

