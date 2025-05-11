import {Location} from "@/apis/shared";
import {useEffect, useState} from "react";
import {handleAxiosError} from "@/utils";
import {AirDailyItem, getAirQualityDaily} from "@/apis/air/airQualityDailyForecast";

export const useAirForecastDaily = (location: Location, days: number) => {
    const [airForecastDaily, setAirForecastDaily] = useState<AirDailyItem[] | null>(null);
    //获取最长5天内每天的空气质量预报
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getAirQualityDaily({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                    days
                });
                setAirForecastDaily(data.results[0].daily);
            } catch (error) {
                handleAxiosError(error);
            }
        }

        if (location?.id) {
            fetchData();
        }
    }, [location]);
    return {airForecastDaily};
}