import {Stack} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ThemeProvider} from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
export default function RootLayout() {
    return<ThemeProvider>
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <Stack>
                {/* 首页 */}
                <Stack.Screen name="index" options={{headerShown: false}}/>
                {/* 天气详情页 */}
                <Stack.Screen name="weather" options={{ title: "天气详情" }} />
                {/* 搜索页 */}
                <Stack.Screen name="search" options={{ title: "搜索城市" }} />
                {/* 设置页 */}
                <Stack.Screen name="settings" options={{ title: "设置" }} />
                {/* 404 页面 */}
                <Stack.Screen name="+not-found"/>
            </Stack>
        </SafeAreaProvider>
    </ThemeProvider>


}
