//File Path: src/Spark/Account/client.ts
import axios from "axios";

// const axiosWithCredentials = axios.create({withCredentials: true});
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

export const signup = async (user: any) => {
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
}

export const deleteProfile = async (userId: string) => {
    const response = await axios.delete(`${USERS_API}/${userId}`);
    return response.data;
};

export const updateProfile = async (profile: any) => {
    const response = await axios.put(`${USERS_API}/${profile._id}`, profile);
    return response.data;
};
