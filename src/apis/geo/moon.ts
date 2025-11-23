import {request} from '@/utils/request';
import {ResType, Location, WeatherParams} from "@/apis/shared";

//单条月出月落月相记录
export type MoonItem = {
    date: string;      // 日期，例如 "2025-04-15"
    rise: string;   // 月出时间，例如 "06:12"
    set: string;    // 月落时间，例如 "18:47"
    fraction: string,//月球被照明部分比例，范围0~1
    phase: string,//月相，范围0~1
    phase_name: string,//月相名称
};
//接口返回的主数据结构
export type SunData = {
    location: Location;  // 城市/地区信息
    moon: MoonItem[];      // 多天的月出月落时间
};
//获取月出月落月相信息
export const getMoonData = (params: WeatherParams) => {
    return request.get<ResType<SunData[]>>('/geo/moon.json', {
        params,
    });
};