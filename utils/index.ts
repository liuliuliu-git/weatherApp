import {request} from "@/utils/request";
import {
    getAlarmIconInfo,
    getAlarmLevelStyle,
    getAlarmLevelIconStyle,
    getAlarmLevelDescription
} from '@/utils/getAlarmUtils';
import {formatTime, getCurrentTime, timeToAngle} from '@/utils/getCurrentTime';
import {getWeatherIconUri} from '@/utils/getWeatherIconUri';
import {getWeekday} from '@/utils/getWeekday';
import {handleAxiosError} from '@/utils/handleAxiosError';

export {
    request,
    getAlarmIconInfo,
    getAlarmLevelStyle,
    getAlarmLevelIconStyle,
    getAlarmLevelDescription,
    getWeatherIconUri,
    getWeekday,
    handleAxiosError,
    getCurrentTime,
    timeToAngle,
    formatTime
}