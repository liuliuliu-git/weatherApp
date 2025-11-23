import {Location} from "@/apis/shared";
import {useEffect, useState} from "react";
import {Alarm, getWeatherAlarm} from "@/apis/weather/weatherAlarm";
import {handleAxiosError} from "@/utils";
// 气象预警
export const useAlarmData = (location: Location | null) => {
    const [weatherAlarm, setWeatherAlarm] = useState<Alarm | null>(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getWeatherAlarm({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                });
                setWeatherAlarm(data.results[0].alarms[0]);
            } catch (error) {
                handleAxiosError(error);
            }
        }

        if (location?.id) {
            fetchData();
        }
    }, [location]);
    return {weatherAlarm};
}