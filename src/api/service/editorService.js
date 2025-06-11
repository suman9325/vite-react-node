import { axiosInstance } from "../axiosInstance";
import Endpoint from '../endpoint.json';

export const getAllFieldsService = async () => {
    const res = await axiosInstance.get(Endpoint.Editor.GetAllFields);
    return await (res).data;
}