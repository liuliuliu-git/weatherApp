//获取当前时间
export const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// 将时间转为角度
export const timeToAngle = (time: string, sunrise: string, sunset: string) => {
    if (!sunrise || !sunset) {
        return 0; // 返回默认值
    }
    
    try {
        const [h, m] = time.split(':').map(Number);
        // 当前时间分钟
        const minutes = h * 60 + m;
        
        // 日出日落时间分钟
        const sunriseParts = sunrise.split(':');
        const sunsetParts = sunset.split(':');
        
        if (sunriseParts.length !== 2 || sunsetParts.length !== 2) {
            return 0;
        }
        
        const sunriseM = parseInt(sunriseParts[0]) * 60 + parseInt(sunriseParts[1]);
        const sunsetM = parseInt(sunsetParts[0]) * 60 + parseInt(sunsetParts[1]);
        
        if (isNaN(sunriseM) || isNaN(sunsetM) || sunsetM <= sunriseM) {
            return 0;
        }
        
        // 白天总共时间
        const total = sunsetM - sunriseM;
        // 当前时间距离日出的分钟数
        const offset = minutes - sunriseM;
        // 当前时间所处与白天的比例
        const percent = Math.max(0, Math.min(1, offset / total));
        return 180 * percent;
    } catch (error) {
        console.error("时间转角度错误:", error);
        return 0;
    }
};
// 格式化时间，只取小时
export const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, '0');
    return `${hours}:00`;
};

