import { axiosInstance } from "../axiosInstance";
import Endpoint from '../endpoint.json';

export const addUpdateTemplateService = async (req) => {
    const res = await axiosInstance.post(Endpoint.Template.AddUpdateTemplate, req);
    return await (res).data;
}

export const getTamplateService = async (req) => {
    const res = await axiosInstance.post(Endpoint.Template.GetTamplate, req);
    return await (res).data;
}