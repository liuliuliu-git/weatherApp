import { request } from '@/utils/request';
import { ResType, WeatherLocation } from "@/apis/shared";

// 单项生活建议类型
export type Suggestion = {
    brief: string; // 简要描述，如“适宜”
    details: string; // 详细建议
};

// 所有生活建议集合类型
export type SuggestionItem = {
    ac: Suggestion, // 空调开启
    air_pollution: Suggestion, // 空气污染扩散条件
    airing: Suggestion, // 晾晒
    allergy: Suggestion, // 过敏
    beer: Suggestion, // 啤酒
    boating: Suggestion, // 划船
    car_washing: Suggestion, // 洗车
    chill: Suggestion, // 风寒
    comfort: Suggestion, // 舒适度
    dating: Suggestion, // 约会
    dressing: Suggestion, // 穿衣
    fishing: Suggestion, // 钓鱼
    flu: Suggestion, // 感冒
    hair_dressing: Suggestion, // 美发
    kiteflying: Suggestion, // 放风筝
    makeup: Suggestion, // 化妆
    mood: Suggestion, // 心情
    morning_sport: Suggestion, // 晨练
    night_life: Suggestion, // 夜生活
    road_condition: Suggestion, // 路况
    shopping: Suggestion, // 购物
    sport: Suggestion, // 运动
    sunscreen: Suggestion, // 防晒
    traffic: Suggestion, // 交通
    travel: Suggestion, // 旅游
    umbrella: Suggestion, // 雨伞
    uv: Suggestion, // 紫外线
};
// 生活建议类型
export type LifeSuggestion = {
    location: WeatherLocation;
    suggestion: SuggestionItem[];
    last_update: string;
};

// 返回的数据类型
export type LifeSuggestionResType = LifeSuggestion[];

// 获取生活建议信息的请求函数
export const getLifeSuggestion = ({ key, location }: { key: string, location: string }) => {
    return request.get<ResType<LifeSuggestionResType>>(`/life/suggestion.json`, {
        params: {
            key,
            location,
            language: 'zh-Hans',
            days: 5
        }
    });
};
