
export const AQI_LEVELS = [
    { label: '优', max: 50, color: '#78b30f' },
    { label: '良', max: 100, color: '#D1D50F' },
    { label: '轻度污染', max: 150, color: '#E69C19' },
    { label: '中度污染', max: 200, color: '#CC1119' },
    { label: '重度污染', max: 300, color: '#710078' },
    { label: '严重污染', max: 500, color: '#4A0D1F' },
];

/**
 * 根据 AQI 值或 label 获取 AQI 等级信息
 * @param input AQI 数值或 label（如 '良'）
 * @returns 匹配的 AQI 等级对象或 null
 */
export const getAqiLevelInfo = (input: number | string) => {
    if (typeof input === 'number') {
        if (input > AQI_LEVELS[AQI_LEVELS.length - 1].max) {
            return AQI_LEVELS[AQI_LEVELS.length - 1];
        }
        return AQI_LEVELS.find(level => input <= level.max) || null;
    } else if (typeof input === 'string') {
        return AQI_LEVELS.find(level => level.label === input) || null;
    }
    return null;
};
