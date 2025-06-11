import { axiosInstance } from "../axiosInstance";
import Endpoint from '../endpoint.json';

export const registerUserService = async (req) => {
    const res = await axiosInstance.post(Endpoint.Auth.Registration, req);
    return res;
}