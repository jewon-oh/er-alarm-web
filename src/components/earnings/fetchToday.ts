import {Page} from "@/types/page";
import {Earnings} from "@/types/earnings";
import {axiosInstance} from "@/constants/axios-instance";
const PAGE_SIZE=10;
export const fetchToday = async (): Promise<Page<Earnings>> => {
    const { data } = await axiosInstance.get<{ data: Page<Earnings> }>(
        `/api/earnings/today`,
        { params: { page: 0, size: PAGE_SIZE } }
    );
    return data.data;
};