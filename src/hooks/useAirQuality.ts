import {Location} from "@/apis/shared";
import {useEffect, useState} from "react";
import {AirStation, getAirQuality} from "@/apis/air/airQualityFact";
import {handleAxiosError} from "@/utils";
//获取空气质量实况
export const useAirQuality = (location: Location | null) => {
    const [airQuality, setAirQuality] = useState<AirStation | null>(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getAirQuality({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                });
                setAirQuality(data.results[0].air.city);
            } catch (error) {
                handleAxiosError(error);
            }
        }

        if (location?.id) {
            fetchData();
        }
    }, [location])
    return {airQuality};
}