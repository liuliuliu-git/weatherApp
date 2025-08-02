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

const getRoutePath = (key: TabKey): `/weatherDetail/${TabKey}` => {
    return `/weatherDetail/${key}` as const;
};
export default function WeatherDetailTabs() {
    const router = useRouter();
    const segments = useSegments();
    const current = segments[1] || "live";

    // 自动重定向到 live
    useEffect(() => {
        // 只在正好是 /weatherDetail 时重定向
        // @ts-ignore
        if (segments.length === 1 && segments[0] === "weatherDetail") {
            router.replace(getRoutePath("live"));
        }
    }, [segments]);

    return (

        <View style={styles.tabBar}>
            {tabs.map(tab => (
                <TouchableOpacity
                    key={tab.key}
                    style={[styles.tab, current === tab.key && styles.activeTab]}
                    onPress={() => router.replace(`/weatherDetail/${tab.key as TabKey}`)}
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