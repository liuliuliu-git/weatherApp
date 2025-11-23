import { Stack } from 'expo-router';
import screenOptions from '@/options/screenOptions';

export default function WeatherDetailLayout() {
    return (
        <Stack
            screenOptions={{
                ...screenOptions(),
                headerShown: false, // 隐藏 header，因为使用自定义 Tab 导航
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="live"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="hourly"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="daily"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="fifteenDays"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="lifeIndex"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="airQuality"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="airRankList"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}

