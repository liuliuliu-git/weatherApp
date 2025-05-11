import {request} from '@/utils/request';
import {ResType, Location, WeatherParams} from "@/apis/shared";
//未来15天逐日天气预报和昨日天气
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
    location: Location; // 地理位置信息
    daily: DailyWeather[]; // 每日天气列表
    last_update: string; // 最后更新时间
};
// 获取每日天气信息的请求函数
export const getWeatherDaily = ({key, location, days = 17, start = -1}: WeatherParams
    ) => {
        return request.get<ResType<WeatherDailyData[]>>(`/weather/daily.json`, {
            params: {
                key,
                location,
                days,
                start
            }
        });
    }
;