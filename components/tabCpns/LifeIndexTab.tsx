import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {useLocationStore} from "@/stores/useLocationStore";
import {useLifeIndex} from "@/hooks/useLifeIndex";
import {Location} from "@/apis/shared";
import {Feather, MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';
import Svg, {Polygon} from "react-native-svg";
import {SuggestionItem} from "@/apis/life";

const LIFE_DETAIL_CONFIG = [
    {key: "airing", label: "晾晒", icon: <Feather name="sun" size={28} color="#4a90e2"/>},
    {key: "umbrella", label: "雨伞", icon: <Ionicons name="umbrella-outline" size={28} color="#4a90e2"/>},
    {
        key: "ac",
        label: "空调开启",
        icon: <MaterialCommunityIcons name="air-conditioner" size={28} color="#4a90e2"/>
    },
    {key: "shopping", label: "逛街", icon: <MaterialCommunityIcons name="shopping" size={28} color="#4a90e2"/>},
    {
        key: "road_condition",
        label: "路况",
        icon: <MaterialCommunityIcons name="road-variant" size={28} color="#4a90e2"/>
    },
    {key: "uv", label: "紫外线", icon: <MaterialCommunityIcons name="sunglasses" size={28} color="#4a90e2"/>},
];

export default function LifeIndexTab() {
    const {location} = useLocationStore();
    const [dateIndex, setDateIndex] = useState(0);
    const {lifeIndex} = useLifeIndex(location as Location, 5);
    const lifeIndexLength = Array.isArray(lifeIndex) ? lifeIndex.length : 0;
    const todayLife = lifeIndex?.[dateIndex] as SuggestionItem;
    // 箭头颜色
    const leftArrowColor = dateIndex === 0 ? "#ccc" : "#4a90e2";
    const rightArrowColor = dateIndex === lifeIndexLength - 1 ? "#ccc" : "#4a90e2";


    // 日期格式
    const dateStr = todayLife?.date
        ? (() => {
            const d = new Date(todayLife?.date);
            return `${d.getMonth() + 1}月${d.getDate()}日`;
        })()
        : "--";
    const area = location?.name || "--";

    // 上方穿衣建议
    const dressingBrief = todayLife.dressing?.brief || "--";
    const dressingDetail = todayLife.dressing?.details || "--";

    // 生活详情
    const getLifeDetail = (key: string) => todayLife[key]?.brief || "--";

    return (
        <View style={styles.container}>
            {/* 上方卡片 */}
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    {/* 左箭头 */}
                    <TouchableOpacity
                        disabled={dateIndex === 0}
                        onPress={() => setDateIndex(i => Math.max(0, i - 1))}
                        style={styles.arrowBtn}
                    >
                        <Svg width="18" height="18">
                            <Polygon points="12,3 6,9 12,15" fill={leftArrowColor}/>
                        </Svg>
                    </TouchableOpacity>
                    <Text style={styles.dateText}>{dateStr}</Text>
                    {/* 右箭头 */}
                    <TouchableOpacity
                        disabled={dateIndex === lifeIndexLength - 1}
                        onPress={() => setDateIndex(i => Math.min(lifeIndexLength - 1, i + 1))}
                        style={styles.arrowBtn}
                    >
                        <Svg width="18" height="18">
                            <Polygon points="6,3 12,9 6,15" fill={rightArrowColor}/>
                        </Svg>
                    </TouchableOpacity>
                    <Text style={styles.areaText}>{area} <Feather name="chevron-right" size={16} color="#aaa"/></Text>
                </View>
                {/* 穿衣建议 */}
                <View style={styles.briefRow}>
                    <MaterialCommunityIcons name="tshirt-crew-outline" size={32} color="#4a90e2"
                                            style={{marginRight: 10}}/>
                    <Text style={styles.briefText}>{dressingBrief}</Text>
                </View>
                {/* 详情描述 */}
                <Text style={styles.detailText}>{dressingDetail}</Text>
            </View>
            {/* 下方生活详情 */}
            <Text style={styles.lifeTitle}>生活详情</Text>
            <View style={styles.card}>
                <View style={styles.grid}>
                    {LIFE_DETAIL_CONFIG.map((item, idx) => (
                        <View style={styles.gridItem} key={item.key}>
                            {item.icon}
                            <Text style={styles.gridLabel}>{item.label}</Text>
                            <Text style={styles.gridValue}>{getLifeDetail(item.key)}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16, backgroundColor: "#f6f6f8"},
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 18,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    arrowBtn: {
        padding: 4,
    },
    dateText: {
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 8,
        color: "#333",
    },
    areaText: {
        marginLeft: "auto",
        fontSize: 14,
        color: "#888",
        flexDirection: "row",
        alignItems: "center",
    },
    briefRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        marginTop: 8,
    },
    briefText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    detailText: {
        fontSize: 14,
        color: "#888",
        marginTop: 4,
    },
    lifeTitle: {
        fontSize: 16,
        color: "#222",
        fontWeight: "bold",
        marginBottom: 8,
        marginLeft: 2,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 8,
    },
    gridItem: {
        width: "32%",
        alignItems: "center",
        marginBottom: 18,
    },
    gridLabel: {
        fontSize: 13,
        color: "#888",
        marginTop: 6,
    },
    gridValue: {
        fontSize: 15,
        color: "#222",
        fontWeight: "bold",
        marginTop: 2,
    },
});