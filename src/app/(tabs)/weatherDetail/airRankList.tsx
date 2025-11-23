import {View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl} from "react-native";
import {useAirCityRank} from "@/hooks/useAirCityRank";
import {useLocationStore} from "@/stores/useLocationStore";
import {getAqiLevelInfo} from "@/utils";
import React, {useState, useMemo, useCallback} from "react";
import {AirQualityCityRankItem} from "@/apis/air/airQualityCityRank";
import {Location} from "@/apis/shared";

export default function AirRankList() {
    const {location} = useLocationStore();
    const { airCity, loadMore, refresh, refreshing } = useAirCityRank(location as Location);
    // tab: 0-从优到差，1-从差到优
    const [tab, setTab] = useState(0);

    // 排序后的数据
    const cnList = useMemo(() => airCity?.filter(item => item.location?.country === 'CN') ?? [], [airCity]);
    const sortedList = useMemo(() => {
        return [...cnList].sort((a, b) => tab === 0 ? Number(a.aqi) - Number(b.aqi) : Number(b.aqi) - Number(a.aqi));
    }, [cnList, tab]);

    const RowItem = React.memo(({item, index}: { item: AirQualityCityRankItem, index: number }) => {
        const path = item.location?.path || "";
        const parts = path.split(",");
        const cityDescribtion = `${parts[2] || ""}${parts[0] || ""}`;
        const levelInfo = getAqiLevelInfo(Number(item.aqi));

        return (
            <View style={styles.tableRow}>
                <Text style={[styles.tableCell, {flex: 1, color: "#888"}]}>
                    {String(index + 1).padStart(2, "0")}
                </Text>
                <Text style={[styles.tableCell, {flex: 2}]} numberOfLines={1}>
                    {item.location.name}（{cityDescribtion}）
                </Text>
                <Text style={[styles.tableCell, {flex: 2, color: levelInfo?.color}, {
                    textAlign: 'center'
                }]}>
                    {levelInfo?.label}
                </Text>
                <Text style={[styles.tableCell, {flex: 1}]}>
                    {item.aqi}
                </Text>
            </View>
        );
    });
    const renderItem = useCallback(({item, index}: { item: AirQualityCityRankItem, index: number }) => {
        return <RowItem item={item} index={index}/>;
    }, [tab]);


    return (
        <View style={styles.container}>
            {/* Tab切换 */}
            <View style={styles.tabRow}>
                <TouchableOpacity style={[styles.tabBtn, tab === 0 && styles.tabBtnActive]} onPress={() => setTab(0)}>
                    <Text style={[styles.tabText, tab === 0 && styles.tabTextActive]}>从优到差</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabBtn, tab === 1 && styles.tabBtnActive]} onPress={() => setTab(1)}>
                    <Text style={[styles.tabText, tab === 1 && styles.tabTextActive]}>从差到优</Text>
                </TouchableOpacity>
            </View>

            {/* 排行表格 */}
            <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, {flex: 1}]}>排名</Text>
                <Text style={[styles.tableHeaderCell, {flex: 2}]}>城市</Text>
                <Text style={[styles.tableHeaderCell, {flex: 2}]}>等级</Text>
                <Text style={[styles.tableHeaderCell, {flex: 1}]}>指数</Text>
            </View>
            <FlatList
                data={sortedList}
                keyExtractor={item => item.location.id.toString()}
                renderItem={renderItem}
                initialNumToRender={20}
                windowSize={10}
                maxToRenderPerBatch={10}
                getItemLayout={(data, index) => ({
                    length: 56,
                    offset: 56 * index,
                    index,
                })}
                onEndReached={loadMore}
                onEndReachedThreshold={0.2}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                }
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: "#f6f6f8"},
    tabRow: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    tabBtnActive: {
        borderBottomWidth: 2,
        borderBottomColor: "#4a90e2",
    },
    tabText: {
        fontSize: 15,
        color: "#888",
    },
    tabTextActive: {
        color: "#4a90e2",
        fontWeight: "bold",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f6f6f8",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    tableHeaderCell: {
        fontSize: 12,
        color: "#888",
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    tableCell: {
        fontSize: 14,
        color: "#222",
        overflow: "hidden",
    },
});