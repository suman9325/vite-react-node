import { axiosInstance } from "../axiosInstance";
import Endpoint from '../endpoint.json'

export const uploadFileService = async (formData) => {
    const res = await axiosInstance.post(Endpoint.FileUpload.UploadFile, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return await (res).data;
}

export const getAllFilesService = async () => {
    const res = await axiosInstance.post(Endpoint.FileUpload.GetAllFiles);
    return await (res).data
}