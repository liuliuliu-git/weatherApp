import {request} from '@/utils/request';
import {Location, ResType, WeatherParams} from '@/apis/shared';
//城市搜索
// 请求函数：根据关键字搜索城市
export const searchCity = ({key, location}: WeatherParams) => {
    return request.get<ResType<Location[]>>(`/location/search.json`, {
        params: {
            key,
            q: location,
            language: 'zh-Hans',
        },
    });
};
