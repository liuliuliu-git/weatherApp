import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import Toast from "react-native-toast-message";
import screenOptions from "@/options/screenOptions";
import {SafeAreaProvider} from "react-native-safe-area-context";

// 通用的 headerStyle 配置
const commonHeaderStyle = {
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: '#fff',
} as const;

export default function Layout() {
    return <SafeAreaProvider>
            <StatusBar style="auto"/>
            <Stack screenOptions={screenOptions()}>
                {/* Tab 导航组 */}
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                {/* 气象灾害页（不在 Tab 中，保持 Stack 导航） */}
                <Stack.Screen name="weatherDisaster" options={{
                    title: "气象灾害",
                    headerShadowVisible: false,
                    headerStyle: commonHeaderStyle,
                }}/>
            </Stack>
            <Toast/>
        </SafeAreaProvider>
}
