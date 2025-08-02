export type ResType<T> = {
    results: T
}
// 定义地理位置信息类型
export type Location = {
    id: string;               // 城市 ID（用于天气接口请求）
    name: string;             // 城市名称
    country: string;          // 国家代码
    path: string;             // 城市全路径（如：北京,北京,中国）
    timezone: string;         // 时区
    timezone_offset: string;  // 时区偏移
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

