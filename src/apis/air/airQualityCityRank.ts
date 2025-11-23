import {request} from '@/utils/request';
import {ResType, Location, WeatherParams} from "@/apis/shared";

// 定义空气质量实况城市排行数据类型
export type AirQualityCityRankItem = {
    location: Location;
    aqi: string;
};

// 定义空气质量实况城市排行 API 函数
export const getAirQualityCityRank = ({key}: WeatherParams) => {
    return request.get<ResType<AirQualityCityRankItem[]>>(`/air/ranking.json`, {
        params: {
            key,
        }
    });
};