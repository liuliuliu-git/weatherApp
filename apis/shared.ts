export type ResType<T> = {
    results: T
}
// 定义地理位置信息类型
export type Location = {
    country: string;
    id: string;
    name: string;
    path: string;
    timezone: string;
    timezone_offset: string;
};


// 请求参数封装类型
export type WeatherParams = {
    key: string;
    location: string;
    start?: number,
    days?: number,
    unit?: number,
    language?: string
}