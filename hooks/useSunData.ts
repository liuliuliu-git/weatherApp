import {Location} from "@/apis/shared";
import {useEffect, useState} from "react";
import {getSunData, SunItem} from "@/apis/geo/sun";
import {handleAxiosError} from "@/utils";
// 日出日落
export const useSunData = (location: Location | null, days: number) => {
    const [sunData, setSunData] = useState<SunItem[] | null>(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getSunData({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                    days,
                });
                setSunData(data.results[0].sun);
            } catch (error) {
                handleAxiosError(error);
            }
        }


        if (location?.id) {
            fetchData();
        }
    }, [location]);
    return {sunData};
}