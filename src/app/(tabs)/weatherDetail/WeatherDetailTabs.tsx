import {useEffect} from "react";
import {View, TouchableOpacity, Text, StyleSheet} from "react-native";
import {useRouter, useSegments} from "expo-router";

const tabs = [
    {key: "live", title: "实况"},
    {key: "hourly", title: "逐小时"},
    {key: "daily", title: "单日"},
    {key: "fifteenDays", title: "15日"},
    {key: "lifeIndex", title: "生活指数"},
    {key: "airQuality", title: "空气质量"},
];
type TabKey = "live" | "hourly" | "daily" | "fifteenDays" | "lifeIndex" | "airQuality";

export default function WeatherDetailTabs() {
    const router = useRouter();
    const segments = useSegments();
    // 获取当前路由名称，从 segments 中提取
    // 如果当前在 index 页面，则显示 live 为激活状态
    let currentRoute = segments[segments.length - 1] || "live";
    if (currentRoute === "index" || currentRoute === "weatherDetail") {
        currentRoute = "live";
    }
    const current = currentRoute as TabKey;

    const handleTabPress = (key: TabKey) => {
        // 使用相对路径导航
        router.push(`./${key}`);
    };

    return (
        <View style={styles.tabBar}>
            {tabs.map(tab => (
                <TouchableOpacity
                    key={tab.key}
                    style={[styles.tab, current === tab.key && styles.activeTab]}
                    onPress={() => handleTabPress(tab.key as TabKey)}
                >
                    <Text style={current === tab.key ? styles.activeText : styles.text}>
                        {tab.title}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#4a90e2",
    },
    text: {
        color: "#888",
        fontSize: 15,
    },
    activeText: {
        color: "#4a90e2",
        fontWeight: "bold",
        fontSize: 15,
    },
});

