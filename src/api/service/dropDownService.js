import { axiosInstance } from "../axiosInstance";
import Endpoint from '../endpoint.json';

export const getAllCountryService = async () => {
    const res = await axiosInstance.get(Endpoint.Dropdown.GetAllCountry);
    return await (res).data;
}

export const getAllStateByCountryService = async (req) => {
    const res = await axiosInstance.post(Endpoint.Dropdown.GetAllStateByCountry, req);
    return await (res).data;
}

export const addUpdateCountryStateService = async (req) => {
    const res = await axiosInstance.post(Endpoint.Dropdown.AddUpdateCountryState, req);
    return await (res).data;
}

export const getCountryStateService = async (req) => {
    const res = await axiosInstance.post(Endpoint.Dropdown.GetCountryState, req);
    return await (res).data;
}

export const getAllLocationsService = async () => {
    const res = await axiosInstance.get(Endpoint.Dropdown.GetAllLocations);
    return await (res).data;
}

export const deleteLocationService = async (req) => {
    const res = await axiosInstance.post(Endpoint.Dropdown.DeleteLocation, req);
    return await (res).data;
}