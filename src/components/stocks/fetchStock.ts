import {Stock} from "@/types/stock";
import {axiosInstance} from "@/constants/axios-instance";

export const fetchStock = async (symbol: string)
    : Promise<Stock> => {
    const res = await axiosInstance
        .get(`/api/stocks/${symbol}`)
    return res.data.data;
}