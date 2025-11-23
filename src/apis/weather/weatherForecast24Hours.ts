import {request} from '@/utils/request';
import {ResType, Location, WeatherParams} from "@/apis/shared";
//24小时逐小时天气预报

export type HourlyWeather = {
    time: string;             // 时间，14:00:00+08:00代表北京时间14点，+8意为UTC+8
    text: string;             // 天气现象文字
    code: string;             // 天气现象代码
    temperature: string;      // 温度，单位为c摄氏度或f华氏度
    humidity: string;         // 相对湿度，0~100，单位为百分比
    wind_direction: string;   // 风向
    wind_speed: string;       // 风速，单位为km/h公里每小时或mph英里每小时
};

export type WeatherForecast24HoursData = {
    location: Location;       // 地理位置信息
    hourly: HourlyWeather[];  // 逐小时天气预报数组
};

export const getWeatherForecast24Hours = ({key, location, start = 0, hours = 24}: WeatherParams & { hours?: number }) => {
    return request.get<ResType<WeatherForecast24HoursData[]>>(`/weather/hourly.json`, {
        params: {
            key,
            location,
            start,
            hours
        }
    });
};

