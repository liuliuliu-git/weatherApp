import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from "react-native";
import {useLocationStore} from "@/stores/useLocationStore";
import {useWeatherFact} from "@/hooks/useWeatherFact";
import {useAirQuality} from "@/hooks/useAirQuality";
import {useWeatherDaily} from "@/hooks/useWeatherDaily";
import {Location} from "@/apis/shared";
import {MaterialCommunityIcons, Ionicons, FontAwesome5, Feather} from '@expo/vector-icons';
import {getWeekday} from "@/utils/getWeekday";
import {getWindLevelBySpeed} from "@/utils/getWindLevel";
import Svg, {Polygon} from 'react-native-svg';
import {getAqiLevelInfo} from "@/utils";
import {useRouter} from "expo-router";

export default function LiveTab() {
    const {location} = useLocationStore();
    const {now} = useWeatherFact(location as Location);
    const router = useRouter();
    const {airQuality} = useAirQuality(location as Location);
    const {weatherDaily} = useWeatherDaily(location as Location, 1, 0);

    const date = new Date();
    const weekday = getWeekday(date.toISOString());
    const level = getAqiLevelInfo(airQuality?.quality as string)

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            bounces={true}
        >
            {now ? (
                <View style={styles.contentContainer}>
                    {/* 上半部分天气信息卡片 */}
                    <View style={styles.weatherCard}>
                        <View style={styles.header}>
                            <Text style={styles.dateText}>{date.getMonth() + 1}月{date.getDate()}日 {weekday}</Text>
                            <TouchableOpacity onPress={() => {
                                router.push('/search')
                            }}>
                                <Text style={styles.locationText}>{location?.name} <Feather name="chevron-right" size={16} color="#aaa"/></Text>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.mainInfo}>
                            <Text style={styles.temperature}>{now.temperature}°C</Text>
                            <View style={styles.tempIcons}>
                                <Svg height="12" width="12" style={styles.tempIcon}>
                                    <Polygon points="6,0 12,12 0,12" fill="#ff5733"/>
                                </Svg>
                                <Text style={styles.tempRange}>{weatherDaily ? weatherDaily[0].high : '--'}°</Text>
                                <Svg height="12" width="12" style={styles.tempIcon}>
                                    <Polygon points="6,12 12,0 0,0" fill="#4a90e2"/>
                                </Svg>
                                <Text style={styles.tempRange}>{weatherDaily ? weatherDaily[0].low : '--'}°</Text>
                            </View>
                            <Text style={styles.weatherText}>{now.text}</Text>
                        </View>
                        <View style={styles.extraInfo}>
                            <Text
                                style={styles.aqiText}>空气质量：
                                <Text style={{color: level?.color || '#4caf50'}}>
                                    {airQuality ? airQuality.quality : '--'}
                                </Text>
                            </Text>
                            <Text style={styles.windText}>{getWindLevelBySpeed(now.wind_speed)}</Text>
                        </View>
                    </View>

                    {/* 下半部分实况详情 */}
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailsTitle}>实况详情</Text>
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailItem}>
                                <Ionicons name="thermometer-outline" size={24} color="#4a90e2"/>
                                <Text style={styles.detailLabel}>体感</Text>
                                <Text style={styles.detailValue}>{now.feels_like}°C</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <MaterialCommunityIcons name="water-percent" size={24} color="#4a90e2"/>
                                <Text style={styles.detailLabel}>湿度</Text>
                                <Text style={styles.detailValue}>{now.humidity}%</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <FontAwesome5 name="tachometer-alt" size={22} color="#4a90e2"/>
                                <Text style={styles.detailLabel}>气压</Text>
                                <Text style={styles.detailValue}>{now.pressure}百帕</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="eye-outline" size={24} color="#4a90e2"/>
                                <Text style={styles.detailLabel}>能见度</Text>
                                <Text style={styles.detailValue}>{now.visibility}km</Text>
                            </View>
                        </View>
                    </View>
                </View>
            ) : (
                <Text>加载中...</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6f6f8",
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 32,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    weatherCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    dateText: {
        fontSize: 16,
        color: "#666",
    },
    locationText: {
        fontSize: 14,
        color: "#666",
    },
    mainInfo: {
        alignItems: "center",
        marginBottom: 16,
    },
    temperature: {
        fontSize: 64,
        fontWeight: "bold",
        color: "#333",
    },
    tempIcons: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    tempIcon: {
        marginHorizontal: 4,
    },
    tempRange: {
        fontSize: 16,
        color: "#888",
        marginHorizontal: 4,
    },
    weatherText: {
        fontSize: 20,
        color: "#888",
        marginTop: 8,
    },
    extraInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    aqiText: {
        fontSize: 14,
        color: '#888'
    },
    windText: {
        fontSize: 14,
        color: "#666",
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
        alignItems: "center",
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
        fontSize: 18,
        color: "#222",
        fontWeight: "bold",
    },
});