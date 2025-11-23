import {Location} from "@/apis/shared";
import {useEffect, useState} from "react";
import {handleAxiosError} from "@/utils";
import {AirHourlyItem, getAirQualityHourly} from "@/apis/air/airForecast24Hours";

export const useAirForecast24Hours = (location: Location | null, days: number) => {
    const [airForecastHourly, setAirForecastHourly] = useState<AirHourlyItem[] | null>(null);
    //获取最长5天内每小时空气质量预报
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getAirQualityHourly({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                    days
                });
                setAirForecastHourly(data.results[0].hourly);
            } catch (error) {
                handleAxiosError(error);
            }
        }

        if (location?.id) {
            fetchData();
        }
    }, [location]);
    return {airForecastHourly};
}