import { alarmColors } from '@/constants/Colors';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * 根据预警类型获取对应的图标名称和图标库
 * @param alarmType 预警类型（如"雷电"、"暴雨"等）
 * @returns 返回图标信息对象 { iconName, iconType }
 */
export const getAlarmIconInfo = (alarmType: string): { iconName: string; iconType: string } => {
    // 根据不同的预警类型返回对应的图标
    switch (alarmType) {
        case '雷电':
            return { iconName: 'thunderstorm', iconType: 'ionicons' };
        case '暴雨':
        case '大雨':
        case '特大暴雨':
        case '大暴雨':
            return { iconName: 'weather-pouring', iconType: 'material-community' };
        case '台风':
            return { iconName: 'weather-hurricane', iconType: 'material-community' };
        case '高温':
            return { iconName: 'whatshot', iconType: 'material' };
        case '寒潮':
        case '霜冻':
        case '低温':
            return { iconName: 'snowflake', iconType: 'material-community' };
        case '大雾':
        case '雾霾':
            return { iconName: 'weather-fog', iconType: 'material-community' };
        case '沙尘暴':
            return { iconName: 'weather-windy', iconType: 'material-community' };
        case '大风':
        case '飓风':
            return { iconName: 'wind', iconType: 'feather' };
        case '冰雹':
            return { iconName: 'weather-hail', iconType: 'material-community' };
        case '暴雪':
        case '大雪':
            return { iconName: 'weather-snowy-heavy', iconType: 'material-community' };
        default:
            return { iconName: 'warning', iconType: 'material' };
    }
};

const getStyleByLevel = (level: string, colorType: 'background' | 'icon'): StyleProp<ViewStyle> => {
    switch (level) {
        case '红色':
            return { backgroundColor: alarmColors.red[colorType] };
        case '橙色':
            return { backgroundColor: alarmColors.orange[colorType] };
        case '黄色':
            return { backgroundColor: alarmColors.yellow[colorType] };
        case '蓝色':
            return { backgroundColor: alarmColors.blue[colorType] };
        default:
            return { backgroundColor: alarmColors.default[colorType] };
    }
};

/**
 * 根据预警等级获取对应的容器样式
 * @param level 预警等级（如"红色"、"橙色"等）
 * @returns 返回对应的样式对象
 */
export const getAlarmLevelStyle = (level: string): StyleProp<ViewStyle> => {
    return getStyleByLevel(level, 'background');
};

/**
 * 根据预警等级获取对应的图标容器样式
 * @param level 预警等级（如"红色"、"橙色"等）
 * @returns 返回对应的样式对象
 */
export const getAlarmLevelIconStyle = (level: string): StyleProp<ViewStyle> => {
    return getStyleByLevel(level, 'icon');
};

/**
 * 获取预警等级的描述
 * @param level 预警等级
 * @returns 返回预警等级的中文描述
 */
export const getAlarmLevelDescription = (level: string): string => {
    switch (level) {
        case '红色':
            return '特别严重';
        case '橙色':
            return '严重';
        case '黄色':
            return '较严重';
        case '蓝色':
            return '有一定影响';
        default:
            return '未知级别';
    }
};