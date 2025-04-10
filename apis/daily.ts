import { request } from '@/utils/request';
import { ResType,WeatherLocation} from "@/apis/shared";

// 每日天气信息类型
export type DailyWeather = {
    date: string; // 日期
    text_day: string; // 白天天气描述
    code_day: string; // 白天天气代码
    text_night: string; // 夜晚天气描述
    code_night: string; // 夜晚天气代码
    high: string; // 最高温度
    low: string; // 最低温度
    rainfall: string; // 降雨量
    precip: string; // 降水概率
    wind_direction: string; // 风向
    wind_direction_degree: string; // 风向角度
    wind_speed: string; // 风速
    wind_scale: string; // 风力等级
    humidity: string; // 湿度
};

// 每日天气数据返回类型
export type WeatherDailyData = {
    location: WeatherLocation; // 地理位置信息
    daily: DailyWeather[]; // 每日天气列表
    last_update: string; // 最后更新时间
};

// 返回数据类型
export type WeatherDailyResType = WeatherDailyData[];

// 获取每日天气信息的请求函数
export const getWeatherDaily = ({ key, location }: { key: string, location: string }) => {
    return request.get<ResType<WeatherDailyResType>>(`/weather/daily.json`, {
        params: {
            key,
            location,
            language: 'zh-Hans',
            unit: 'c',
            start: 0,
            days: 3
        }
    });
};