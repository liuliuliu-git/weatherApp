import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import {useLocationStore} from "@/stores/useLocationStore";
import {useAirQuality} from "@/hooks/useAirQuality";
import {useAirForecast24Hours} from "@/hooks/useAirForecast24Hours";
import {useAirForecastDaily} from "@/hooks/useAirForecastDaily";
import {useAirCityRank} from "@/hooks/useAirCityRank";
import {Location} from "@/apis/shared";
import AQIProgressBar from "@/components/AQIProgressBar";
import {Feather} from '@expo/vector-icons';
import {BarChart} from "react-native-chart-kit";
import {getAqiLevelInfo} from "@/utils";
import {useRouter} from "expo-router";
import {useMemo} from "react";

export default function AirQualityTab() {
    const {location} = useLocationStore();
    const {airQuality} = useAirQuality(location as Location);
    const {airForecastHourly} = useAirForecast24Hours(location as Location, 1);
    const {airForecastDaily} = useAirForecastDaily(location as Location, 5);
    const {airCity} = useAirCityRank(location as Location);
    const router = useRouter();

    // 日期
    const dateStr = useMemo(() => {
        if (!airQuality) return "--";
        const d = new Date();
        return `${d.getMonth() + 1}月${d.getDate()}日`;
    }, [airQuality]);
    const area = location?.name || "--";

    // AQI数据
    const aqi = airQuality?.aqi ? Number(airQuality.aqi) : 0;
    const aqiLevel = airQuality?.quality || "--";

    // 24小时预报数据
    const hourlyLabels = airForecastHourly?.map((item, index) => {
        const hour = new Date(item.time).getHours();
        return index % 6 === 0 ? `${hour}时` : "";
    }) || [];
    const hourlyAqi = airForecastHourly?.map(item => Number(item.aqi)) || [];

    // 5日预报数据
    const dailyLabels = airForecastDaily?.map(item => {
        const d = new Date(item.date);
        return `${d.getMonth() + 1}.${d.getDate()}`;
    }) || [];
    const dailyAqi = airForecastDaily?.map(item => Number(item.aqi)) || [];

    // 城市排行前五
    const cityRank = airCity
        ?.filter(item => item.location?.country === 'CN')
        .slice(0, 5)
        .map(item => {
            const path = item.location?.path || "";
            const parts = path.split(",");
            return {
                ...item,
                cityDescribtion: `${parts[2] || ""}${parts[0] || ""}`
            };
        }) || [];


    return (
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 32}}>
            {/* 顶部卡片 */}
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <Text style={styles.dateText}>{dateStr}</Text>
                    <TouchableOpacity onPress={() => router.push("/search")}>
                        <Text style={styles.areaText}>{area} <Feather name="chevron-right" size={16}
                                                                      color="#aaa"/></Text>
                    </TouchableOpacity>
                </View>
                <AQIProgressBar aqi={aqi}/>
                <View style={styles.aqiRow}>
                    <View style={{alignItems: "center"}}>
                        <Text style={styles.aqiValue}>{aqi}</Text>
                        <Text style={styles.aqiLabel}>AQI</Text>
                    </View>
                    <View style={{marginLeft: 16}}>
                        <Text style={[styles.aqiLevel, {color: getAqiLevelInfo(aqiLevel)?.color}]}>{aqiLevel}</Text>
                    </View>
                </View>

            </View>

            {/* 城市排行 */}
            <View style={styles.rankHeaderRow}>
                <Text style={styles.rankTitle}>全国排行</Text>
                <TouchableOpacity onPress={()=>router.push('/weatherDetail/AirRankList')}>
                    <Text style={styles.rankMore}>更多 <Feather name="chevron-right" size={14} color="#888"/></Text>
                </TouchableOpacity>
            </View>
            <View style={styles.rankCard}>
                <View style={styles.rankTableHeader}>
                    <Text style={[styles.rankHeaderCell, {flex: 1}]}>排名</Text>
                    <Text style={[styles.rankHeaderCell, {flex: 3}]}>城市</Text>
                    <Text style={[styles.rankHeaderCell, {flex: 1}]}>等级</Text>
                    <Text style={[styles.rankHeaderCell, {flex: 1}]}>指数</Text>
                </View>
                {cityRank.map((item, idx) => (
                    <View style={styles.rankTableRow} key={item.location.name + idx}>
                        <Text style={[styles.rankCell, {
                            flex: 1,
                            color: "#888"
                        }]}>{String(idx + 1).padStart(2, "0")}</Text>
                        <Text style={[styles.rankCell, {flex: 3}]} numberOfLines={1}>
                            {item.location.name}（{item.cityDescribtion}）
                        </Text>
                        <Text style={[styles.rankCell, {
                            flex: 1,
                            color: getAqiLevelInfo(Number(item.aqi))?.color
                        }]}>{getAqiLevelInfo(Number(item.aqi))?.label}</Text>
                        <Text style={[styles.rankCell, {flex: 1}]}>{item.aqi}</Text>
                    </View>
                ))}
            </View>

            {/* 24小时预报 */}
            <Text style={styles.sectionTitle}>24小时预报</Text>
            <View style={styles.chartCard}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <BarChart
                        data={{
                            labels: hourlyLabels,
                            datasets: [
                                {
                                    data: hourlyAqi,
                                    colors: hourlyAqi.map((aqi) => () => getAqiLevelInfo(aqi)?.color || "#ccc")
                                }
                            ]
                        }}
                        width={hourlyAqi.length * 40} // 每根柱子约 40 像素宽，可根据实际调整
                        height={180}
                        fromZero
                        chartConfig={{
                            backgroundColor: "#fff",
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                            labelColor: () => "#888",
                            propsForBackgroundLines: {stroke: "#eee"},
                            barPercentage: 0.6,
                        }}
                        style={{borderRadius: 12, marginLeft: -20}}
                        showValuesOnTopOfBars={false}
                        yAxisLabel="" // 添加 y 轴标签
                        yAxisSuffix=""   // 添加 y 轴后缀
                    />
                </ScrollView>
            </View>
            {/* 5日预报 */}
            <Text style={styles.sectionTitle}>5日预报</Text>
            <View style={styles.chartCard}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <BarChart
                        data={{
                            labels: dailyLabels,
                            datasets: [{
                                data: dailyAqi,
                                colors: dailyAqi.map((aqi) => () => getAqiLevelInfo(aqi)?.color || "#ccc")
                            }]
                        }}
                        width={dailyAqi.length * 70}
                        height={180}
                        yAxisLabel=""
                        yAxisSuffix=""
                        fromZero
                        chartConfig={{
                            backgroundColor: "#fff",
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                            labelColor: () => "#888",
                            propsForBackgroundLines: {stroke: "#eee"},
                            barPercentage: 0.6,
                        }}
                        style={{borderRadius: 12, marginLeft: -20}}
                        showValuesOnTopOfBars={false}

                    />
                </ScrollView>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: "#f6f6f8", padding: 16},
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
        justifyContent: "space-between",
    },
    dateText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    areaText: {
        marginLeft: "auto",
        fontSize: 14,
        color: "#888",
        flexDirection: "row",
        alignItems: "center",
    },
    aqiRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 8,
    },
    aqiValue: {
        fontSize: 28,
        fontWeight: "bold",
    },
    aqiLabel: {
        fontSize: 13,
        color: "#888",
    },
    aqiLevel: {
        fontSize: 16,
        color: "#4a90e2",
        fontWeight: "bold",
    },
    aqiDesc: {
        fontSize: 13,
        color: "#888",
        marginTop: 2,
        maxWidth: 160,
    },
    pm25Btn: {
        marginLeft: "auto",
        backgroundColor: "#f6f6f8",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        flexDirection: "row",
        alignItems: "center",
    },
    pm25BtnText: {
        color: "#888",
        fontSize: 13,
        marginRight: 2,
    },
    pollutantGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 10,
    },
    pollutantItem: {
        width: "30%",
        alignItems: "center",
        marginBottom: 10,
    },
    pollutantLabel: {
        fontSize: 13,
        color: "#888",
    },
    pollutantValue: {
        fontSize: 16,
        color: "#222",
        fontWeight: "bold",
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 16,
        color: "#222",
        fontWeight: "bold",
        marginBottom: 8,
        marginLeft: 2,
    },
    chartCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 8,
        marginBottom: 18,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    // 城市排行
    rankHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        marginTop: 2,
        paddingHorizontal: 2,
        justifyContent: "space-between",
    },
    rankTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222",
    },
    rankMore: {
        marginLeft: "auto",
        fontSize: 14,
        color: "#888",
        flexDirection: "row",
        alignItems: "center",
    },
    rankCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        marginBottom: 18,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    rankTableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        paddingBottom: 6,
        marginBottom: 4,
    },
    rankHeaderCell: {
        fontSize: 13,
        color: "#888",
        fontWeight: "bold",
    },
    rankTableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
    },
    rankCell: {
        fontSize: 15,
        color: "#222",
        overflow: "hidden",
    },
});