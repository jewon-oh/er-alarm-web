import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_ORIGIN_URL,
        'Access-Control-Allow-Credentials': 'true'
    }
});
