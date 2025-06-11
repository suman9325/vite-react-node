import { axiosInstance } from "../axiosInstance";
import Endpoint from '../endpoint.json'

export const getAllUsersService = async () => {
    const res = await axiosInstance.post(Endpoint.User.GetUser);
    return await (res).data;
}

export const getFilteredUsersService = async (req) => {
    const res = await axiosInstance.post(Endpoint.Table.GetFilteredUsers, req);
    return await (res).data;
}