import {request} from '@/utils/request';
import {ResType, Location, WeatherParams} from "@/apis/shared";
//气象灾害预警

// 定义天气预警信息类型
export type Alarm = {
    alarm_id: string;         // 预警唯一ID，可用于去重
    title: string;            // 预警标题
    type: string;             // 预警类型，如"雷电"
    level: string;            // 预警等级，如"黄色"
    region_id: string;        // 国家行政区划编码
    status: string;           // 状态，V3版本默认为空
    description: string;      // 预警描述
    pub_date: string;         // 发布时间
};

// 天气预警数据返回类型
export type WeatherAlarmData = {
    location: Location;       // 地理位置信息
    alarms: Alarm[];          // 灾害预警数组，可能为空
};

// 获取天气灾害预警信息
export const getWeatherAlarm = ({key, location}: WeatherParams) => {
    return request.get<ResType<WeatherAlarmData[]>>(`/weather/alarm.json`, {
        params: {
            key,
            location,
        }
    });
};