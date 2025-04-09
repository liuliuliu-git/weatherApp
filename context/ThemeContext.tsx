import React, { createContext, useState, ReactNode } from 'react';
import { Appearance } from 'react-native';
import { Colors } from '@/constants/Colors';

// 定义 ThemeContext 的上下文类型
interface ThemeContextType {
    colorScheme: 'light' | 'dark'; // 当前颜色方案
    setColorScheme: (scheme: 'light' | 'dark') => void; // 设置颜色方案的函数
    theme: typeof Colors['dark'] | typeof Colors['light']; // 当前主题配置
}

// 创建上下文，并提供默认值
export const ThemeContext = createContext<ThemeContextType>({
    colorScheme: 'light', // 默认颜色方案为浅色模式
    setColorScheme: () => {}, // 默认为空函数
    theme: Colors.light, // 默认使用浅色主题
});

// 定义 ThemeProvider 的 props 类型
interface ThemeProviderProps {
    children: ReactNode; // 子组件的类型
}

// ThemeProvider 组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // 状态：当前设备的颜色方案（深色或浅色）
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
        Appearance.getColorScheme() || 'light'
    );

    // 根据颜色方案选择对应的主题
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <ThemeContext.Provider
            value={{
                colorScheme, // 当前颜色方案
                setColorScheme, // 更新颜色方案的函数
                theme, // 当前主题配置
            }}>
            {children}
        </ThemeContext.Provider>
    );
};