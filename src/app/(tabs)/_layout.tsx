import { Tabs } from 'expo-router';
import { getTabBarIcon } from '@/options/tabOptions';
import tabOptions from '@/options/tabOptions';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                ...tabOptions(),
                tabBarIcon: ({ focused, color, size }) =>
                    getTabBarIcon(route.name, focused, color, size),
            })}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: '首页',
                    tabBarLabel: '首页',
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: '搜索',
                    tabBarLabel: '搜索',
                }}
            />
            <Tabs.Screen
                name="weatherDetail"
                options={{
                    title: '天气详情',
                    tabBarLabel: '详情',
                }}
            />
            {/* weatherDetail 的子路由不会显示为 Tab，它们由 weatherDetail/_layout.tsx 中的 Stack 管理 */}
        </Tabs>
    );
}

