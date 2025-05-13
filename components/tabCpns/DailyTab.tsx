import {View, Text, StyleSheet, TouchableOpacity, Image} from "react-native";
import {useLocationStore} from "@/stores/useLocationStore";
import {useWeatherDaily} from "@/hooks/useWeatherDaily";
import {useSunData} from "@/hooks/useSunData";
import {Location} from "@/apis/shared";
import {MaterialCommunityIcons, Ionicons, Feather} from '@expo/vector-icons';
import Svg, {Polygon} from "react-native-svg";
import {getWeatherIconUri} from "@/utils";
import {useSelectedDateIndexStore} from "@/stores/useSelectedDateIndexStore";
import {useRouter} from "expo-router";
import {useMemo, useState} from "react";


const DAY_NIGHT = ["白天", "夜间"];

export default function DailyTab() {
    const {location} = useLocationStore();
    const {weatherDaily} = useWeatherDaily(location as Location, 15, 0);
    const {sunData} = useSunData(location as Location, 15);
    const {selectedDateIndex, setSelectedDateIndex} = useSelectedDateIndexStore();
    const router = useRouter();
    // 当前选中的日期索引
    const dateIndex = selectedDateIndex;
    // 白天/夜间切换
    const [dayType, setDayType] = useState<0 | 1>(0);

    // 当前天气数据
    const todayWeather = useMemo(() => weatherDaily ? weatherDaily[dateIndex] : null, [weatherDaily, dateIndex]);
    const todaySun = useMemo(() => sunData ? sunData[dateIndex] : null, [sunData, dateIndex]);
    // 白天/夜间数据
    const weatherText = todayWeather ? (dayType === 0 ? todayWeather.text_day : todayWeather.text_night) : "--";
    const tempLow = todayWeather ? todayWeather.low : "--";
    const tempHigh = todayWeather ? todayWeather.high : "--";
    const pop = todayWeather ? todayWeather.precip : "--";
    const rainfall = todayWeather ? todayWeather.rainfall : "--";
    const humidity = todayWeather ? todayWeather.humidity : "--";
    const windDir = todayWeather ? todayWeather.wind_direction : "--";
    const windScale = todayWeather ? todayWeather.wind_scale : "--";

    // 日期格式
    const dateStr = todayWeather ? (() => {
        const d = new Date(todayWeather.date);
        return `${d.getMonth() + 1}月${d.getDate()}日`;
    })() : "--";    // 地区
    const area = location?.name || "--";
    // 日出日落
    const sunrise = todaySun?.sunrise || "--:--";
    const sunset = todaySun?.sunset || "--:--";

    // 天气图标
    const weatherIcon = (
            <View style={{backgroundColor: "#4a90e2"}}>
                <Image
                    source={{uri: getWeatherIconUri(Number(dayType === 0 ? todayWeather?.code_day : todayWeather?.code_night), "light")}}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                    }}
                />
            </View>

        )
    ;

    // 箭头颜色
    const leftArrowColor = dateIndex === 0 ? "#ccc" : "#4a90e2";
    const rightArrowColor = weatherDaily && dateIndex === weatherDaily.length - 1 ? "#ccc" : "#4a90e2";

    return (
        <View style={styles.container}>
            {/* 上方卡片 */}
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        {/* 左箭头 */}
                        <TouchableOpacity
                            disabled={!weatherDaily || dateIndex === 0}
                            onPress={() => setSelectedDateIndex(Math.max(0, dateIndex - 1))}
                            style={styles.arrowBtn}
                        >
                            <Svg width="18" height="18">
                                <Polygon points="12,3 6,9 12,15" fill={leftArrowColor}/>
                            </Svg>
                        </TouchableOpacity>
                        <Text style={styles.dateText}>{dateStr}</Text>
                        {/* 右箭头 */}
                        <TouchableOpacity
                            disabled={!weatherDaily || dateIndex === weatherDaily.length - 1}
                            onPress={() => setSelectedDateIndex(weatherDaily ? Math.min(weatherDaily.length - 1, dateIndex + 1) : dateIndex)}
                            style={styles.arrowBtn}
                        >
                            <Svg width="18" height="18">
                                <Polygon points="6,3 12,9 6,15" fill={rightArrowColor}/>
                            </Svg>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => router.push("/search")}>
                        <Text style={styles.areaText}>{area} <Feather name="chevron-right" size={16}
                                                                      color="#aaa"/></Text>
                    </TouchableOpacity>
                </View>
                {/* 白天/夜间切换 */}
                <View style={styles.dayNightRow}>
                    {DAY_NIGHT.map((label, idx) => (
                        <TouchableOpacity
                            key={label}
                            style={[styles.dayNightBtn, dayType === idx && styles.dayNightBtnActive]}
                            onPress={() => setDayType(idx as 0 | 1)}
                        >
                            <Text
                                style={[styles.dayNightText, dayType === idx && styles.dayNightTextActive]}>{label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {/* 温度区间和天气 */}
                <View style={styles.tempRow}>
                    <View>
                        <Text style={styles.tempText}>{tempLow}~{tempHigh}<Text style={styles.celsius}>℃</Text></Text>
                    </View>
                    <View style={styles.weatherIconBox}>
                        {weatherIcon}
                        <Text style={styles.weatherDesc}>{weatherText}</Text>
                    </View>
                </View>
                {/* 日出日落 */}
                <View style={styles.sunRow}>
                    <View style={styles.sunItem}>
                        <MaterialCommunityIcons name="weather-sunset-up" size={20} color="#f5a623"/>
                        <Text style={styles.sunText}>日出 {sunrise}</Text>
                    </View>
                    <View style={styles.sunItem}>
                        <MaterialCommunityIcons name="weather-sunset-down" size={20} color="#f5a623"/>
                        <Text style={styles.sunText}>日落 {sunset}</Text>
                    </View>
                </View>
            </View>
            {/* 下方卡片 */}
            <View style={styles.card}>
                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <Ionicons name="water-outline" size={28} color="#4a90e2"/>
                        <Text style={styles.gridLabel}>降水概率</Text>
                        <Text style={styles.gridValue}>{pop}%</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <MaterialCommunityIcons name="weather-pouring" size={28} color="#4a90e2"/>
                        <Text style={styles.gridLabel}>降雨量</Text>
                        <Text style={styles.gridValue}>{rainfall}mm</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <MaterialCommunityIcons name="water-percent" size={28} color="#4a90e2"/>
                        <Text style={styles.gridLabel}>相对湿度</Text>
                        <Text style={styles.gridValue}>{humidity}%</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <MaterialCommunityIcons name="weather-windy" size={28} color="#4a90e2"/>
                        <Text style={styles.gridLabel}>{windDir} </Text>
                        <Text style={styles.gridValue}>{windScale}级</Text>
                    </View>
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
        justifyContent: "space-between",
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
    dayNightRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 10,
    },
    dayNightBtn: {
        paddingVertical: 4,
        paddingHorizontal: 18,
        borderRadius: 12,
        backgroundColor: "#f2f6fa",
        marginRight: 10,
    },
    dayNightBtnActive: {
        backgroundColor: "#4a90e2",
    },
    dayNightText: {
        color: "#4a90e2",
        fontSize: 14,
    },
    dayNightTextActive: {
        color: "#fff",
        fontWeight: "bold",
    },
    tempRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    tempText: {
        fontSize: 38,
        fontWeight: "bold",
        color: "#222",
    },
    celsius: {
        fontSize: 18,
        color: "#888",
    },
    weatherIconBox: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 18,
    },
    weatherDesc: {
        fontSize: 16,
        color: "#4a90e2",
        marginLeft: 6,
    },
    sunRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
        backgroundColor: "#f7f7fa",
        borderRadius: 8,
        padding: 8,
    },
    sunItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    sunText: {
        fontSize: 13,
        color: "#888",
        marginLeft: 4,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 8,
    },
    gridItem: {
        width: "24%",
        alignItems: "center",
        marginBottom: 12,
    },
    gridLabel: {
        fontSize: 13,
        color: "#888",
        marginTop: 6,
    },
    gridValue: {
        fontSize: 16,
        color: "#222",
        fontWeight: "bold",
        marginTop: 2,
    },
});