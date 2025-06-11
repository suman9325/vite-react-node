import { axiosInstance } from "../axiosInstance";
import Endpoint from '../endpoint.json';

export const addUpdateUserService = async (req) => {
    const res = await axiosInstance.post(Endpoint.User.AddUpdateUser, req);
    return await (res).data;
}

export const getUserService = async (req) => {
    const res = await axiosInstance.post(Endpoint.User.GetUser, req);
    return await (res).data;
}

export const getActiveInactiveUserService = async (req) => {
    const res = await axiosInstance.post(Endpoint.User.GetActiveInactiveUser, req);
    return await (res).data;
}

export const toggleActiveInactiveUserService = async (req) => {
    const res = await axiosInstance.post(Endpoint.User.ToggleActiveInactiveUser, req);
    return await (res).data;
}

export const updateActiveInactiveUserService = async (req) => {
    const res = await axiosInstance.post(Endpoint.User.UpdateActiveInactiveUser, req);
    return await (res).data;
}

export const searchUserService = async (req) => {
    const res = await axiosInstance.post(Endpoint.User.SearchUser, req);
    return await (res).data;
}

export const getPayslipListService = async (req) => {
    const res = await axiosInstance.post(Endpoint.User.GetPayslipList, req);
    return await (res).data;
}

export const getInterestService = async (req) => {
    const res = await axiosInstance.post(Endpoint.User.GetInterest, req);
    return await (res).data;
}