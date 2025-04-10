import {request} from '@/utils/request';
import { ResType,WeatherLocation} from "@/apis/shared";

export type WeatherNow = {
    code: string; // 天气代码
    temperature: string; // 温度
    text: string; // 天气描述
};

export type WeatherNowData = {
    location: WeatherLocation; // 地理位置信息
    now: WeatherNow; // 当前天气信息
    last_update: string; // 最后更新时间
};

export type weatherNowResType = WeatherNowData[]; // 返回数据是一个数组
export const getWeatherNow = ({ key, location }:{key:String,location:String}) => {
    return request.get<ResType<weatherNowResType>>(`/weather/now.json`, {
        params: {
            key,
            location
        }
    });
};
