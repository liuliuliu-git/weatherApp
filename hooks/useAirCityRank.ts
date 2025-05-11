import {Location} from "@/apis/shared";
import {useEffect, useState} from "react";
import {handleAxiosError} from "@/utils";
import {AirQualityCityRankItem, getAirQualityCityRank} from "@/apis/air/airQualityCityRank";

export const useAirCityRank = (location: Location) => {
    const [airCity, setAirCity] = useState<AirQualityCityRankItem[] | null>(null);
    //获取最长5天内每天的空气质量预报
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getAirQualityCityRank({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                });
                setAirCity(data.results);
            } catch (error) {
                handleAxiosError(error);
            }
        }

        if (location?.id) {
            fetchData();
        }
    }, [location]);
    return {airCity};
}