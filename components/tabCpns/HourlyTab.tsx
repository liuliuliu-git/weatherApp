import React, {useState, useCallback, useMemo} from "react";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions} from "react-native";
import {useLocationStore} from "@/stores/useLocationStore";
import {Location} from "@/apis/shared";
import {useWeatherForecast24Hours} from "@/hooks/useWeatherForecast24Hours";
import {useAirForecast24Hours} from "@/hooks/useAirForecast24Hours";
import {MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';
import {getWindLevelBySpeed} from "@/utils/getWindLevel";
import {HourlyWeather} from "@/apis/weather/weatherForecast24Hours";
import {AirHourlyItem} from "@/apis/air/airForecast24Hours";
import Svg, {Path, Circle} from 'react-native-svg';

const POINT_SPACING = 60; // 点之间的间距
const CHART_HEIGHT = 120;
const POINT_RADIUS = 4;
const TIME_HEIGHT = 50; // 增加时间区域高度
const PADDING_HORIZONTAL = 30; // 增加水平内边距
const HIGHLIGHT_WIDTH = 48; // 高亮区域宽度

export default function HourlyTab() {
    const {location} = useLocationStore();
    const {weatherForecastHourly} = useWeatherForecast24Hours(location as Location);
    const {airForecastHourly} = useAirForecast24Hours(location as Location, 1);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const formatTime = useCallback((timeStr: string) => {
        const date = new Date(timeStr);
        const hours = date.getHours();
        
        // 只在0点显示日期
        if (hours === 0) {
            return `${date.getDate()}日${hours}时`;
        }
        return `${hours}时`;
    }, []);

    const getDisplayDate = useCallback((timeStr: string) => {
        const date = new Date(timeStr);
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    }, []);

    const chartWidth = useMemo(() => {
        if (!weatherForecastHourly) return 0;
        // 增加左右边距，确保第一个和最后一个时间项完全显示
        return (weatherForecastHourly.length - 1) * POINT_SPACING + (PADDING_HORIZONTAL * 2);
    }, [weatherForecastHourly]);

    const renderHourlyChart = useCallback(() => {
        if (!weatherForecastHourly) return null;

        const temperatures = weatherForecastHourly.map(item => Number(item.temperature));
        const maxTemp = Math.max(...temperatures);
        const minTemp = Math.min(...temperatures);
        const tempRange = maxTemp - minTemp;

        // 调整点的位置，确保完全显示
        const points = weatherForecastHourly.map((item, index) => {
            const x = index * POINT_SPACING + PADDING_HORIZONTAL;
            // 调整y轴范围，确保温度球完全显示
            const y = CHART_HEIGHT - ((Number(item.temperature) - minTemp) / tempRange) * (CHART_HEIGHT - 60) - 30;
            return {x, y};
        });

        const pathD = points.reduce((path, point, index) => {
            if (index === 0) {
                return `M ${point.x} ${point.y}`;
            }
            const prevPoint = points[index - 1];
            const controlPoint1X = (prevPoint.x + point.x) / 2;
            const controlPoint2X = (prevPoint.x + point.x) / 2;
            return `${path} C ${controlPoint1X},${prevPoint.y} ${controlPoint2X},${point.y} ${point.x},${point.y}`;
        }, '');

        // 使用选中项的日期
        const displayDate = getDisplayDate(weatherForecastHourly[selectedIndex].time);

        return (
            <View style={styles.chartWrapper}>
                <View style={styles.chartHeader}>
                    <Text style={styles.dateText}>{displayDate}</Text>
                    <Text style={styles.locationText}>{location?.name} {'>'}</Text>
                </View>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={[styles.chartContainer, { width: chartWidth }]}>
                        <View style={styles.svgContainer}>
                            <Svg width={chartWidth} height={CHART_HEIGHT} style={styles.svg}>
                                <Path
                                    d={pathD}
                                    stroke="#2196f3"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                {points.map((point, index) => (
                                    <Circle
                                        key={index}
                                        cx={point.x}
                                        cy={point.y}
                                        r={selectedIndex === index ? POINT_RADIUS + 2 : POINT_RADIUS}
                                        fill={selectedIndex === index ? "#1976d2" : "#2196f3"}
                                    />
                                ))}
                            </Svg>
                        </View>
                        <View style={styles.timelineContainer}>
                            {weatherForecastHourly.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.timeItem,
                                        { left: index * POINT_SPACING },
                                        selectedIndex === index && styles.selectedTimeItem,
                                    ]}
                                    onPress={() => setSelectedIndex(index)}
                                >
                                    <Text style={[
                                        styles.temperature,
                                        selectedIndex === index && styles.selectedTemperature
                                    ]}>
                                        {item.temperature}°
                                    </Text>
                                    <Text style={[
                                        styles.hourText,
                                        selectedIndex === index && styles.selectedHourText
                                    ]}>
                                        {formatTime(item.time)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }, [weatherForecastHourly, selectedIndex, location, chartWidth, formatTime, getDisplayDate]);

    const renderDetailCard = useCallback(() => {
        if (!weatherForecastHourly || !airForecastHourly) return null;

        const weatherData = weatherForecastHourly[selectedIndex];
        const airData = airForecastHourly[selectedIndex];

        return (
            <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>当前时段详情</Text>
                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <Ionicons name="thermometer-outline" size={24} color="#2196f3"/>
                        <Text style={styles.detailLabel}>温度</Text>
                        <Text style={styles.detailValue}>{weatherData.temperature}°C</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="water-percent" size={24} color="#03a9f4"/>
                        <Text style={styles.detailLabel}>湿度</Text>
                        <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="weather-windy" size={24} color="#ff9800"/>
                        <Text style={styles.detailLabel}>风级</Text>
                        <Text style={styles.detailValue}>
                            {getWindLevelBySpeed(weatherData.wind_speed)}
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="compass" size={24} color="#4caf50"/>
                        <Text style={styles.detailLabel}>风向</Text>
                        <Text style={styles.detailValue}>{weatherData.wind_direction}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="#9c27b0"/>
                        <Text style={styles.detailLabel}>天气</Text>
                        <Text style={styles.detailValue}>{weatherData.text}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="air-filter" size={24} color="#795548"/>
                        <Text style={styles.detailLabel}>空气质量</Text>
                        <Text style={styles.detailValue}>{airData.quality}</Text>
                    </View>
                </View>
            </View>
        );
    }, [weatherForecastHourly, airForecastHourly, selectedIndex]);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
                {renderHourlyChart()}
                {renderDetailCard()}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eaeaed",
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    chartCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    chartWrapper: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
    },
    locationText: {
        fontSize: 14,
        color: '#2196f3',
    },
    scrollContent: {
        flexGrow: 1,
    },
    chartContainer: {
        height: CHART_HEIGHT + TIME_HEIGHT,
        paddingHorizontal:0,
    },
    svgContainer: {
        height: CHART_HEIGHT,
        position: 'relative',
    },
    svg: {
        overflow: 'visible', // 确保温度球不会被裁剪
    },
    timelineContainer: {
        position: 'relative',
        height: TIME_HEIGHT,
        marginTop: 8,
    },
    timeItem: {
        position: 'absolute',
        width: HIGHLIGHT_WIDTH, // 使用固定的高亮区域宽度
        alignItems: 'center',
        paddingVertical: 4,
        transform: [{translateX: -HIGHLIGHT_WIDTH / 2 + POINT_SPACING / 2}], // 调整居中位置
    },
    selectedTimeItem: {
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderRadius: 8,
    },
    temperature: {
        fontSize: 14,
        color: '#333',
        marginBottom: 2,
    },
    selectedTemperature: {
        color: '#1976d2',
        fontWeight: 'bold',
    },
    hourText: {
        fontSize: 12,
        color: '#666',
    },
    selectedHourText: {
        color: '#2196f3',
        fontWeight: 'bold',
    },
    detailsContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    detailsTitle: {
        fontSize: 16,
        color: "#333",
        fontWeight: "bold",
        marginBottom: 12,
        marginLeft: 4,
    },
    detailsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    detailItem: {
        width: "50%",
        padding: 16,
        alignItems: "center",
        borderColor: "#f0f0f0",
        borderWidth: 0.5,
    },
    detailLabel: {
        fontSize: 14,
        color: "#888",
        marginTop: 4,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        color: "#222",
        fontWeight: "bold",
    },
});