import {Location} from "@/apis/shared";
import {useEffect, useState} from "react";
import {getWeatherForecast24Hours, HourlyWeather} from "@/apis/weather/weatherForecast24Hours";
import {handleAxiosError} from "@/utils";

export const useWeatherForecast24Hours = (location: Location | null) => {
    const [weatherForecastHourly, setWeatherForecastHourly] = useState<HourlyWeather[] | null>(null);
    //获取24小时内天气预报
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getWeatherForecast24Hours({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                });
                setWeatherForecastHourly(data.results[0].hourly);
            } catch (error) {
                handleAxiosError(error);
            }
        }

        if (location?.id) {
            fetchData();
        }
    }, [location]);
    return {weatherForecastHourly};
}