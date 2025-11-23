import React from 'react';
import { Ionicons } from '@expo/vector-icons';

/**
 * 底部 Tab 导航配置
 * @param route 路由信息
 * @param focused 是否激活
 * @param color 颜色
 * @param size 图标大小
 */
export function getTabBarIcon(route: string, focused: boolean, color: string, size: number) {
    let iconName: keyof typeof Ionicons.glyphMap;
    let IconComponent: typeof Ionicons = Ionicons;

    switch (route) {
        case 'index':
            iconName = 'home';
            break;
        case 'search':
            iconName = 'search';
            break;
        case 'weatherDetail':
            iconName = 'list';
            break;
        default:
            iconName = 'help-circle';
    }

    return <IconComponent name={iconName} size={size} color={color} />;
}

/**
 * Tab 导航选项配置
 */
export default function tabOptions() {
    return {
        tabBarActiveTintColor: '#1f99b0',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#eee',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
        },
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500' as '500',
        },
        headerShown: false, // Tab 页面通常不显示 header，由各自页面控制
    };
}

