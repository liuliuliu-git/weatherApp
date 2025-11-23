import { request } from '@/utils/request';
import { ResType, Location, WeatherParams } from "@/apis/shared";

// 单小时空气质量预报项
export type AirHourlyItem = {
    aqi: string;          // 空气质量指数(AQI)
    pm25: string;         // PM2.5颗粒物，单位：μg/m³
    pm10: string;         // PM10颗粒物，单位：μg/m³
    so2: string;          // 二氧化硫，单位：μg/m³
    no2: string;          // 二氧化氮，单位：μg/m³
    co: string;           // 一氧化碳，单位：mg/m³
    o3: string;           // 臭氧，单位：μg/m³
    quality: string;      // 空气质量类别："优、良、轻度污染、中度污染、重度污染、严重污染"
    time: string;         // 预报小时，格式：ISO 8601
};

// 逐小时空气质量数据
export type AirQualityHourlyData = {
    location: Location;     // 地理位置信息
    hourly: AirHourlyItem[];// 每小时的空气质量数据
    last_update: string;    // 数据发布时间
};

// 获取逐小时空气质量预报
export const getAirQualityHourly = ({ key, location, days = 1 }: WeatherParams) => {
    return request.get<ResType<AirQualityHourlyData[]>>(`/air/hourly.json`, {
        params: {
            key,
            location,
            days
        }
    });
};
