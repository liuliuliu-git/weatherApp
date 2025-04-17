import {request} from '@/utils/request';
import {ResType, Location, WeatherParams} from "@/apis/shared";
//空气质量实况


export type AirStation = {
    aqi: string; // 空气质量指数
    pm25: string; // PM2.5颗粒物（粒径小于等于2.5μm）1小时平均值。单位：μg/m³
    pm10: string; // PM10颗粒物（粒径小于等于10μm）1小时平均值。单位：μg/m³
    so2: string; // 二氧化硫1小时平均值。单位：μg/m³
    no2: string; // 二氧化氮1小时平均值。单位：μg/m³
    co: string; // 一氧化碳1小时平均值。单位：mg/m³
    o3: string; // 臭氧1小时平均值。单位：μg/m³
    quality: string; // 空气质量类别，有"优、良、轻度污染、中度污染、重度污染、严重污染"6类
    primary_pollutant?: string; // 首要污染物
    station?: string; // 监测站名称
    latitude?: string; // 监测站纬度
    longitude?: string; // 监测站经度
    last_update: string; // 数据发布时间
};
export type AirQualityData = {
    location: Location; // 地理位置信息
    air: {
        city: AirStation; // 城市综合空气质量数据
        stations: AirStation[]; // 该城市所有监测站数组
    };
    last_update: string; // 最后更新时间
};

export const getAirQuality = ({key, location}: WeatherParams) => {
    return request.get<ResType<AirQualityData[]>>(`/air/now.json`, {
        params: {
            key,
            location
        }
    });
};
