import {useEffect, useState} from "react";
import {DailyWeather, getWeatherDaily} from "@/apis/weather/weatherDailyForecast";
import {handleAxiosError} from "@/utils";
import {Location} from "@/apis/shared";
//逐日天气预报以及昨日天气
export const useWeatherDaily = (location: Location | null, days: number, start: number) => {
    const [weatherDaily, setWeatherDaily] = useState<DailyWeather[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getWeatherDaily({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                    days,
                    start
                });
                setWeatherDaily(data.results[0].daily);
            } catch (error) {
                handleAxiosError(error);
            }
        }

        if (location?.id) {
            fetchData();
        }
    }, [location]);

    return {weatherDaily};
}