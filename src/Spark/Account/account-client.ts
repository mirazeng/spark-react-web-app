import axios from "axios";

const axiosWithCredentials = axios.create({withCredentials: true});

export const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;

export const signin = async (credentials: any) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
    return response.data;
};

export const profile = async () => {
    const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
    return response.data;
};

export const signup = async (user: {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    description: string;
    role: string;
}) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
    return response.data;
};

export const signout = async () => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
    return response.data;
};

export const getUserProfile = async (uid: string) => {
    const response = await axiosWithCredentials.get(`${USERS_API}/profile/${uid}`);
    return response.data;
};

export const deleteProfile = async (userId: string) => {
    const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
    return response.data;
};

export const updateProfile = async (profile: any) => {
    const response = await axiosWithCredentials.put(`${USERS_API}/${profile._id}`, profile);
    return response.data;
};

export const followUser = async (userId: string) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/follow/${userId}`);
    return response.data;
};

export const unfollowUser = async (userId: string) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/unfollow/${userId}`);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await axiosWithCredentials.get(`${USERS_API}`);
    return response.data;
};

export const getUserBookmarks = async (username: string) => {
    const response = await axiosWithCredentials.get(`${USERS_API}/${username}/remote-bookmarks`);
    return response.data;
};

export const getUserFollowing = async (username: string) => {
    const response = await axiosWithCredentials.get(`${USERS_API}/${username}/following`);
    return response.data;
};

export const getUserFollowers = async (username: string) => {
    const response = await axiosWithCredentials.get(`${USERS_API}/${username}/followers`);
    return response.data;
};


