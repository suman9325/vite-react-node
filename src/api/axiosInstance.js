import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_FILE_BASE_URL}/api`,
});
