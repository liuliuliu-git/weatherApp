// 根据日期获取星期几或特殊显示文本（昨天、今天、明天）
export const getWeekday = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 设置为当天的0点0分0秒

    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    // 计算日期差值（毫秒）
    const diffTime = date.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // 转换为天数

    if (diffDays === -1) {
        return '昨天';
    } else if (diffDays === 0) {
        return '今天';
    } else if (diffDays === 1) {
        return '明天';
    } else {
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return weekdays[date.getDay()];
    }
};
