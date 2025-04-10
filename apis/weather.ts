import {request} from '@/utils/request';
import {ResType, WeatherLocation} from "@/apis/shared";
// 具体天气类型
export type WeatherNow = {
    code: string; // 天气代码
    temperature: string; // 温度
    text: string; // 天气描述
};
//当前天气响应返回类型
export type WeatherNowData = {
    location: WeatherLocation; // 地理位置信息
    now: WeatherNow; // 当前天气信息
    last_update: string; // 最后更新时间
};
// 返回的数据类型
export type weatherNowResType = WeatherNowData[];
export const getWeatherNow = ({key, location}: { key: String, location: String }) => {
    return request.get<ResType<weatherNowResType>>(`/weather/now.json`, {
        params: {
            key,
            location
        }
    });
};
