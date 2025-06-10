import {axiosInstance} from "@/constants/axios-instance";
import {Page} from "@/types/page";
import {Earnings} from "@/types/earnings";

export const fetchEarnings = async (
    symbol: string="",
    pageIndex: number,
    pageSize: number,
    fcmToken: string="",
    date: string=""
): Promise<Page<Earnings>> => {
    const config = {
        params: { page: pageIndex, size: pageSize ,date:""},
        headers: {}
    };

    // fcmToken이 있으면 headers 추가
    if (fcmToken) {
        config.headers = {
            "FcmToken": fcmToken,
        };
    }
    // date 가 있으면 params 에 추가
    if (date) {
        config.params = {
            ...config.params,
            date:date,
        };
    }
    const url = symbol
        ? `/api/earnings/${symbol}`
        : `/api/earnings`;
    console.log(url);
    const res = await axiosInstance
        .get(url, config)
    return res.data.data;
}