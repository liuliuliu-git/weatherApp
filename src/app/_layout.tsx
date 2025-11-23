import {Stack} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import Toast from "react-native-toast-message";

export default function Layout() {
    return <SafeAreaProvider>
            <StatusBar style="auto"/>
            <Stack>
                {/* 首页 */}
                <Stack.Screen name="index" options={{headerShown: false}}/>
                {/* 天气详情页 */}
                <Stack.Screen name="weatherDetail" options={{
                    title: "天气详情", headerTitleAlign: 'center', // 标题居中
                    headerShadowVisible: false, // 去除底部横线（React Navigation v6+）
                    // 如果 headerShadowVisible 不起作用，可以使用下方 headerStyle.borderBottomWidth
                    headerStyle: {
                        borderBottomWidth: 0, // 某些平台（如 Android）可能更需要这个
                        elevation: 0,         // Android 移除阴影
                        shadowOpacity: 0,     // iOS 移除阴影
                        backgroundColor: '#fff', // 可选：设置背景颜色
                    } as any,
                }}/>
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
                    } as any,
                }}/>
                {/* 设置页 */}
                <Stack.Screen name="settings" options={{
                    title: "设置",
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    animation: 'slide_from_right', // 添加平滑过渡动画
                    headerStyle: {
                        borderBottomWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0,
                        backgroundColor: '#fff',
                    } as any,
                    headerTitleStyle: { // 固定标题样式避免闪烁
                        fontSize: 18,
                        fontWeight: '500',
                        color: '#333'
                    }
                }}/>
                {/* 气象灾害页 */}
                <Stack.Screen name="weatherDisaster" options={{
                    title: "气象灾害", headerTitleAlign: 'center', // 标题居中
                    headerShadowVisible: false, // 去除底部横线（React Navigation v6+）
                    // 如果 headerShadowVisible 不起作用，可以使用下方 headerStyle.borderBottomWidth
                    headerStyle: {
                        borderBottomWidth: 0, // 某些平台（如 Android）可能更需要这个
                        elevation: 0,         // Android 移除阴影
                        shadowOpacity: 0,     // iOS 移除阴影
                        backgroundColor: '#fff', // 可选：设置背景颜色
                    } as any,
                }}/>
                {/*天气详情路由*/}
                {/* 实况天气 */}
                <Stack.Screen name="weatherDetail/live" options={{
                    title: "天气详情", headerTitleAlign: 'center', // 标题居中
                    headerShadowVisible: false, // 去除底部横线（React Navigation v6+）
                    // 如果 headerShadowVisible 不起作用，可以使用下方 headerStyle.borderBottomWidth
                    headerStyle: {
                        borderBottomWidth: 0, // 某些平台（如 Android）可能更需要这个
                        elevation: 0,         // Android 移除阴影
                        shadowOpacity: 0,     // iOS 移除阴影
                        backgroundColor: '#fff', // 可选：设置背景颜色
                    } as any,
                }}/>
                {/* 生活指数 */}
                <Stack.Screen name="weatherDetail/lifeIndex" options={{
                    title: "天气详情", headerTitleAlign: 'center', // 标题居中
                    headerShadowVisible: false, // 去除底部横线（React Navigation v6+）
                    // 如果 headerShadowVisible 不起作用，可以使用下方 headerStyle.borderBottomWidth
                    headerStyle: {
                        borderBottomWidth: 0, // 某些平台（如 Android）可能更需要这个
                        elevation: 0,         // Android 移除阴影
                        shadowOpacity: 0,     // iOS 移除阴影
                        backgroundColor: '#fff', // 可选：设置背景颜色
                    } as any,
                }}/>
                {/* 天气aqi排行 */}
                <Stack.Screen name="weatherDetail/airRankList" options={{
                    title: "天气详情", headerTitleAlign: 'center', // 标题居中
                    headerShadowVisible: false, // 去除底部横线（React Navigation v6+）
                    // 如果 headerShadowVisible 不起作用，可以使用下方 headerStyle.borderBottomWidth
                    headerStyle: {
                        borderBottomWidth: 0, // 某些平台（如 Android）可能更需要这个
                        elevation: 0,         // Android 移除阴影
                        shadowOpacity: 0,     // iOS 移除阴影
                        backgroundColor: '#fff', // 可选：设置背景颜色
                    } as any,
                }}/>
                {/* 每小时 */}
                <Stack.Screen name="weatherDetail/hourly" options={{
                    title: "天气详情", headerTitleAlign: 'center', // 标题居中
                    headerShadowVisible: false, // 去除底部横线（React Navigation v6+）
                    // 如果 headerShadowVisible 不起作用，可以使用下方 headerStyle.borderBottomWidth
                    headerStyle: {
                        borderBottomWidth: 0, // 某些平台（如 Android）可能更需要这个
                        elevation: 0,         // Android 移除阴影
                        shadowOpacity: 0,     // iOS 移除阴影
                        backgroundColor: '#fff', // 可选：设置背景颜色
                    } as any,
                }}/>
                {/* 单日 */}
                <Stack.Screen name="weatherDetail/daily" options={{
                    title: "天气详情", headerTitleAlign: 'center', // 标题居中
                    headerShadowVisible: false, // 去除底部横线（React Navigation v6+）
                    // 如果 headerShadowVisible 不起作用，可以使用下方 headerStyle.borderBottomWidth
                    headerStyle: {
                        borderBottomWidth: 0, // 某些平台（如 Android）可能更需要这个
                        elevation: 0,         // Android 移除阴影
                        shadowOpacity: 0,     // iOS 移除阴影
                        backgroundColor: '#fff', // 可选：设置背景颜色
                    } as any,
                }}/>
                {/* 十五日 */}
                <Stack.Screen name="weatherDetail/fifteenDays" options={{
                    title: "天气详情", headerTitleAlign: 'center', // 标题居中
                    headerShadowVisible: false, // 去除底部横线（React Navigation v6+）
                    // 如果 headerShadowVisible 不起作用，可以使用下方 headerStyle.borderBottomWidth
                    headerStyle: {
                        borderBottomWidth: 0, // 某些平台（如 Android）可能更需要这个
                        elevation: 0,         // Android 移除阴影
                        shadowOpacity: 0,     // iOS 移除阴影
                        backgroundColor: '#fff', // 可选：设置背景颜色
                    } as any,
                }}/>
                {/* 空气质量 */}
                <Stack.Screen name="weatherDetail/airQuality" options={{
                    title: "天气详情", headerTitleAlign: 'center', // 标题居中
                    headerShadowVisible: false, // 去除底部横线（React Navigation v6+）
                    // 如果 headerShadowVisible 不起作用，可以使用下方 headerStyle.borderBottomWidth
                    headerStyle: {
                        borderBottomWidth: 0, // 某些平台（如 Android）可能更需要这个
                        elevation: 0,         // Android 移除阴影
                        shadowOpacity: 0,     // iOS 移除阴影
                        backgroundColor: '#fff', // 可选：设置背景颜色
                    } as any,
                }}/>
            </Stack>
            <Toast/>
        </SafeAreaProvider>
}
