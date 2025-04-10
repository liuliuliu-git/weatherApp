export type ResType<T> = {
    results: T
}
// 定义地理位置信息类型
export type WeatherLocation = {
    country: string;
    id: string;
    name: string;
    path: string;
    timezone: string;
    timezone_offset: string;
};