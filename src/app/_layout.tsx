import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import Toast from "react-native-toast-message";
import screenOptions from "@/options/screenOptions";

// 通用的 headerStyle 配置
const commonHeaderStyle = {
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: '#fff',
} as const;

export default function Layout() {
    return <>
            <StatusBar style="auto"/>
            <Stack screenOptions={screenOptions()}>
                {/* 首页 */}
                <Stack.Screen name="index" options={{headerShown: false}}/>
                {/* 天气详情页 */}
                <Stack.Screen name="weatherDetail" options={{
                    title: "天气详情",
                    headerShadowVisible: false,
                    headerStyle: commonHeaderStyle,
                }}/>
                {/* 搜索页 */}
                <Stack.Screen name="search" options={{
                    title: "搜索城市",
                    headerShadowVisible: false,
                    headerStyle: commonHeaderStyle,
                }}/>
                {/* 设置页 */}
                <Stack.Screen name="settings" options={{
                    title: "设置",
                    headerShadowVisible: false,
                    headerStyle: commonHeaderStyle,
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '500',
                        color: '#333'
                    }
                }}/>
                {/* 气象灾害页 */}
                <Stack.Screen name="weatherDisaster" options={{
                    title: "气象灾害",
                    headerShadowVisible: false,
                    headerStyle: commonHeaderStyle,
                }}/>
                {/*天气详情路由*/}
                {/* 实况天气 */}
                <Stack.Screen name="weatherDetail/live" options={{
                    title: "天气详情",
                    headerShadowVisible: false,
                    headerStyle: commonHeaderStyle,
                }}/>
                {/* 生活指数 */}
                <Stack.Screen name="weatherDetail/lifeIndex" options={{
                    title: "天气详情",
                    headerShadowVisible: false,
                    headerStyle: commonHeaderStyle,
                }}/>
                {/* 天气aqi排行 */}
                <Stack.Screen name="weatherDetail/airRankList" options={{
                    title: "天气详情",
                    headerShadowVisible: false,
                    headerStyle: commonHeaderStyle,
                }}/>
                {/* 每小时 */}
                <Stack.Screen name="weatherDetail/hourly" options={{
                    title: "天气详情",
                    headerShadowVisible: false,
                    headerStyle: commonHeaderStyle,
                }}/>
                {/* 单日 */}
                <Stack.Screen name="weatherDetail/daily" options={{
                    title: "天气详情",
                    headerShadowVisible: false,
                    headerStyle: commonHeaderStyle,
                }}/>
                {/* 十五日 */}
                <Stack.Screen name="weatherDetail/fifteenDays" options={{
                    title: "天气详情",
                    headerShadowVisible: false,
                    headerStyle: commonHeaderStyle,
                }}/>
                {/* 空气质量 */}
                <Stack.Screen name="weatherDetail/airQuality" options={{
                    title: "天气详情",
                    headerShadowVisible: false,
                    headerStyle: commonHeaderStyle,
                }}/>
            </Stack>
            <Toast/>
        </>
}
