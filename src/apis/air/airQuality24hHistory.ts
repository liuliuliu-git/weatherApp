import {request} from '@/utils/request';
import {ResType, Location, WeatherParams} from "@/apis/shared";
// 定义城市空气质量历史记录数据类型
export type AirQualityHourly = {
    city: {
        aqi: string;
        pm25: string;
        pm10: string;
        so2: string;
        no2: string;
        co: string;
        o3: string;
        last_update: string;
        quality: string;
    };
    stations: null;
};

// 定义历史空气质量数据类型
export type AirQuality24hHistoryItem = {
    location: Location;
    hourly_history: AirQualityHourly[];
};

// 定义过去 24 小时历史空气质量 API 函数
export const getAirQuality24hHistory = ({key, location}: WeatherParams) => {
    return request.get<ResType<AirQuality24hHistoryItem[]>>(`/air/hourly_history.json`, {
        params: {
            key,
            location,
            scope: "city"
        }
    });
};