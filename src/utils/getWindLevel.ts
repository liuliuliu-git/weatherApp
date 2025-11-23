/**
 * 根据风速（km/h）返回对应的中文风级
 * @param windSpeed 风速，单位：km/h
 * @returns 对应的中文风级
 */
export function getWindLevelBySpeed(windSpeed: string): string {
    const speed = Number(windSpeed);
    if (speed < 1) {
        return "无风";
    } else if (speed < 6) {
        return "软风";
    } else if (speed < 12) {
        return "轻风";
    } else if (speed < 20) {
        return "微风";
    } else if (speed < 29) {
        return "和风";
    } else if (speed < 39) {
        return "清劲风";
    } else if (speed < 50) {
        return "强风";
    } else if (speed < 62) {
        return "疾风";
    } else if (speed < 75) {
        return "大风";
    } else if (speed < 89) {
        return "烈风";
    } else if (speed < 103) {
        return "狂风";
    } else if (speed < 118) {
        return "暴风";
    } else if (speed < 134) {
        return "台风，又名飓风";
    } else if (speed < 150) {
        return "台风";
    } else if (speed < 167) {
        return "强台风";
    } else if (speed < 184) {
        return "强台风";
    } else if (speed < 202) {
        return "超强台风";
    } else {
        return "超强台风";
    }
}
