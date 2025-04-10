import {Stack} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ThemeProvider} from "@/context/ThemeContext";
import {StatusBar} from "expo-status-bar";

export default function RootLayout() {
    return <ThemeProvider>
        <SafeAreaProvider>
            <StatusBar style="auto"/>
            <Stack>
                {/* 首页 */}
                <Stack.Screen name="index" options={{headerShown: false}}/>
                {/* 天气详情页 */}
                <Stack.Screen name="weatherDetail" options={{title: "天气详情"}}/>
                {/* 搜索页 */}
                <Stack.Screen name="search" options={{
                    title: "搜索城市", headerTitleAlign: 'center', // 标题居中
                    headerShadowVisible: false, // 去除底部横线（React Navigation v6+）
                    // 如果 headerShadowVisible 不起作用，可以使用下方 headerStyle.borderBottomWidth
                    headerStyle: {
                        borderBottomWidth: 0, // 某些平台（如 Android）可能更需要这个
                        elevation: 0,         // Android 移除阴影
                        shadowOpacity: 0,     // iOS 移除阴影
                        backgroundColor: '#fff', // 可选：设置背景颜色
                    },
                }}/>
                {/* 设置页 */}
                <Stack.Screen name="settings" options={{
                    title: "设置", headerTitleAlign: 'center', // 标题居中
                    headerShadowVisible: false, // 去除底部横线（React Navigation v6+）
                    // 如果 headerShadowVisible 不起作用，可以使用下方 headerStyle.borderBottomWidth
                    headerStyle: {
                        borderBottomWidth: 0, // 某些平台（如 Android）可能更需要这个
                        elevation: 0,         // Android 移除阴影
                        shadowOpacity: 0,     // iOS 移除阴影
                        backgroundColor: '#fff', // 可选：设置背景颜色
                    },
                }}/>
                {/* 404 页面 */}
                <Stack.Screen name="+not-found"/>
            </Stack>
        </SafeAreaProvider>
    </ThemeProvider>


}
