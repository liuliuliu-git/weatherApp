import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from "react-native";
import {useLocationStore} from "@/stores/useLocationStore";
import {useWeatherDaily} from "@/hooks/useWeatherDaily";
import {Location} from "@/apis/shared";
import {Feather} from '@expo/vector-icons';
import {getWeatherIconUri, getWeekday} from "@/utils";
import {useRouter} from "expo-router";
import {useSelectedDateIndexStore} from "@/stores/useSelectedDateIndexStore";

export default function FifteenDaysTab() {
    const {location} = useLocationStore();
    const {weatherDaily} = useWeatherDaily(location as Location, 15, 0);
    const router = useRouter();
    const {selectedDateIndex, setSelectedDateIndex} = useSelectedDateIndexStore();

    const handleItemPress = (index: number) => {
        setSelectedDateIndex(index);
        router.push("/weatherDetail/daily"); // 跳转到 daily 子页面
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <Text style={styles.cardTitle}>15日天气预报</Text>
                    <TouchableOpacity onPress={() => router.push("/search")}>
                        <Text style={styles.areaText}>{location?.name} <Feather name="chevron-right" size={16}
                                                                                color="#aaa"/></Text>
                    </TouchableOpacity>

                </View>
                {weatherDaily?.map((item, index) => {
                    const dateParts = item.date.split('-');
                    const month = dateParts[1];
                    const day = dateParts[2];
                    const rainProb = Math.round(parseFloat(item.precip) * 100);

                    return (
                        <TouchableOpacity
                            key={item.date}
                            style={[styles.dailyItem, selectedDateIndex === index && styles.selectedDailyItem]}
                            onPress={() => handleItemPress(index)}
                        >
                            <View style={styles.dateContainer}>
                                <Text
                                    style={[styles.dateText, selectedDateIndex === index && styles.selectedText]}>{`${month}/${day}`}</Text>
                                <Text
                                    style={[styles.weekdayText, selectedDateIndex === index && styles.selectedText]}>{getWeekday(item.date)}</Text>
                            </View>
                            <View style={styles.weatherIconContainer}>
                                <Image
                                    source={{uri: getWeatherIconUri(Number(item.code_day), "light")}}
                                    style={styles.weatherIcon}
                                />
                                {rainProb > 0 ? (
                                    <Text
                                        style={[styles.rainProbText, selectedDateIndex === index && styles.selectedText]}>{rainProb}%</Text>
                                ) : (
                                    <Text style={[styles.rainProbText, {opacity: 0}]}>0%</Text>
                                )}
                            </View>
                            <View style={styles.tempContainer}>
                                <Text
                                    style={[styles.tempText, selectedDateIndex === index && styles.selectedText]}>{item.low}</Text>
                                <Text
                                    style={[styles.tempText, selectedDateIndex === index && styles.selectedText, {marginLeft: 8}]}>{item.high}°</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: "#f6f6f8", padding: 16},
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 8, // 减小内边距
        marginBottom: 18,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        paddingTop: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    areaText: {
        fontSize: 14,
        color: "#888",
        flexDirection: "row",
        alignItems: "center",
    },
    dailyItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    selectedDailyItem: {
        backgroundColor: "#4a90e2",
        borderRadius: 8, // 给选中项加圆角
        marginHorizontal: -16, // 抵消父容器的 padding
        paddingHorizontal: 16, // 保持内容对齐
    },
    selectedText: {
        color: "#fff", // 选中时文字变白
    },
    dateContainer: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
    },
    dateText: {
        fontSize: 15,
        color: "#333",
        marginRight: 8,
    },
    weekdayText: {
        fontSize: 15,
        color: "#888",
    },
    weatherIconContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    weatherIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
    },
    rainProbText: {
        fontSize: 13,
        color: "#4a90e2",
        marginLeft: 4,
    },
    tempContainer: {
        flex: 1.5,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    tempText: {
        fontSize: 16,
        color: "#333",
    },
});