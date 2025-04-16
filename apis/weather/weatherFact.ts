import {request} from '@/utils/request';
import {ResType, Location, WeatherParams} from "@/apis/shared";
// 具体天气类型
export type WeatherNow = {
    code: string; // 天气代码
    temperature: string; // 温度
    text: string; // 天气描述
    feels_like:string, //体感温度，单位为c摄氏度或f华氏度，暂不支持国外城市。
    pressure: string, //气压，单位为mb百帕或in英寸
    humidity:string, //相对湿度，0~100，单位为百分比
    visibility: string, //能见度，单位为km公里或mi英里
    wind_direction:string, //风向文字
    wind_direction_degree: string, //风向角度，范围0~360，0为正北，90为正东，180为正南，270为正西
    wind_speed: string, //风速，单位为km/h公里每小时或mph英里每小时
    wind_scale: string, //风力等级
};
//当前天气响应返回类型
export type WeatherNowData = {
    location: Location; // 地理位置信息
    now: WeatherNow; // 当前天气信息
    last_update: string; // 最后更新时间
};
export const getWeatherNow = ({key, location}: WeatherParams) => {
    return request.get<ResType<WeatherNowData[]>>(`/weather/now.json`, {
        params: {
            key,
            location,
            // start:-1,
            // days:15
        }
    });
};
