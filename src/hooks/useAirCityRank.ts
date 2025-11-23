import {useEffect, useState} from "react";
import {AirQualityCityRankItem, getAirQualityCityRank} from "@/apis/air/airQualityCityRank";
import {handleAxiosError} from "@/utils";
import {Location} from "@/apis/shared";

export const useAirCityRank = (location: Location) => {
    const [airCity, setAirCity] = useState<AirQualityCityRankItem[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20); // 每页条数
    const [allData, setAllData] = useState<AirQualityCityRankItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAllData = async () => {
        try {
            const { data } = await getAirQualityCityRank({
                key: process.env.EXPO_PUBLIC_API_KEY || '',
                location: location?.id as string,
            });
            setAllData(data.results);
            setAirCity(data.results.slice(0, pageSize));
            setPage(1); // 初始化第一页
        } catch (error) {
            handleAxiosError(error);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        const nextItems = allData.slice(0, nextPage * pageSize);
        // 判断取出的数目是否多于已加载的数目
        if (nextItems.length > airCity.length) {
            setPage(nextPage);
            setAirCity(nextItems);
        }
    };

    const refresh = async () => {
        setRefreshing(true);
        await fetchAllData();
        setRefreshing(false);
    };

    useEffect(() => {
        if (location?.id) {
            fetchAllData();
        }
    }, [location]);

    return { airCity, loadMore, refresh, refreshing };
};
