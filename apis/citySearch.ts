
import {request} from '@/utils/request';
import {ResType, WeatherParams} from '@/apis/shared';
//城市搜索
// 城市搜索返回项类型
export type LocationSearchItem = {
    id: string;               // 城市 ID（用于天气接口请求）
    name: string;             // 城市名称
    country: string;          // 国家代码
    path: string;             // 城市全路径（如：北京,北京,中国）
    timezone: string;         // 时区
    timezone_offset: string;  // 时区偏移
};

// 请求函数：根据关键字搜索城市
export const searchCity = ({key, location}: WeatherParams) => {
    return request.get<ResType<LocationSearchItem[]>>(`/location/search.json`, {
        params: {
            key,
            q: location,
            language: 'zh-Hans',
        },
    });
};
