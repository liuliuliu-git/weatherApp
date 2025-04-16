import {request} from '@/utils/request';
import {ResType, Location, WeatherParams} from "@/apis/shared";

//逐日空气质量预报
export type AirDailyItem = {
    aqi: string;          // 空气质量指数(AQI)是描述空气质量状况的定量指数
    pm25: string;         // PM2.5颗粒物（粒径小于等于2.5μm）预报值。单位：μg/m³
    pm10: string;         // PM10颗粒物（粒径小于等于10μm）预报值。单位：μg/m³
    so2: string;          // 二氧化硫预报值。单位：μg/m³
    no2: string;          // 二氧化氮预报值。单位：μg/m³
    co: string;           // 一氧化碳预报值。单位：mg/m³
    o3: string;           // 臭氧预报值。单位：μg/m³
    quality: string;      // 空气质量类别，有"优、良、轻度污染、中度污染、重度污染、严重污染"6类
    date: string;         // 预报日期
};

export type AirQualityDailyData = {
    location: Location;   // 地理位置信息
    daily: AirDailyItem[]; // 逐日空气质量预报数据
    last_update: string;  // 预报发布时间
};

export const getAirQualityDaily = ({key, location, days = 5}: WeatherParams) => {
    return request.get<ResType<AirQualityDailyData[]>>(`/air/daily.json`, {
        params: {
            key,
            location,
            days
        }
    });
};