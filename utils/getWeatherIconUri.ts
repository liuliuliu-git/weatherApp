/**
 * 获取天气图标资源
 * @param code 天气代码（number 类型）
 * @param theme 主题：'light' | 'dark'
 * @returns 返回图片资源
 */
export const getWeatherIconUri = (code: number, theme: 'light' | 'dark' ='light') => {
    const validCode = Number.isInteger(code) && code >= 0 && code <= 99 ? code : 99;
    let colorTheme
    if(theme === 'light') {
        colorTheme ='white'
    }else{
        colorTheme ='black'
    }
    const IP = '192.168.31.64';
    const PORT = 3000;
    return `http://${IP}:${PORT}/images/${colorTheme}/${validCode}.png`;
};
