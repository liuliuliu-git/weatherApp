import {request} from '@/utils/request';
import {ResType} from "@/apis/shared";

export type WeatherLocation = {
    country: string;
    id: string;
    name: string;
    path: string;
    timezone: string;
    timezone_offset: string;
};

export type WeatherNow = {
    code: string; // 天气代码
    temperature: string; // 温度
    text: string; // 天气描述
};

export type WeatherNowData = {
    last_update: string; // 最后更新时间
    location: WeatherLocation; // 地理位置信息
    now: WeatherNow; // 当前天气信息
};

export type weatherNowResType = WeatherNowData[]; // 返回数据是一个数组
export const getWeatherNow = ({ key, location }:{key:String,location:String}) => {
    return request.get<ResType<weatherNowResType>>(`https://api.seniverse.com/v3/weather/now.json`, {
        params: {
            key,
            location
        }
    });
};
