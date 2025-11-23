import {request} from '@/utils/request';
import {ResType, Location, WeatherParams} from "@/apis/shared";

//单条日出日落记录
export type SunItem = {
    date: string;      // 日期，例如 "2025-04-15"
    sunrise: string;   // 日出时间，例如 "06:12"
    sunset: string;    // 日落时间，例如 "18:47"
};
//接口返回的主数据结构
export type SunData = {
    location: Location;  // 城市/地区信息
    sun: SunItem[];      // 多天的日出日落时间
};
//获取日出日落信息
export const getSunData = ({key, location, start = 0, days}: WeatherParams) => {
        return request.get<ResType<SunData[]>>('/geo/sun.json', {
            params: {
                key,
                location,
                days,
                start
            }
        });
    }
;