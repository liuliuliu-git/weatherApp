import {View, Text, StyleSheet} from "react-native";
import {useLocationStore} from "@/stores/useLocationStore";
import {useWeatherFact} from "@/hooks/useWeatherFact";
import {Location} from "@/apis/shared";

export default function LiveTab() {
    const {location} = useLocationStore();
    const {now} = useWeatherFact(location as Location);

    return (
        <View style={styles.container}>
            {now ? (
                <>
                    <Text style={styles.temperature}>{now.temperature}°C</Text>
                    <Text style={styles.weatherText}>{now.text}</Text>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailText}>体感温度: {now.feels_like}°C</Text>
                        <Text style={styles.detailText}>湿度: {now.humidity}%</Text>
                        <Text style={styles.detailText}>风向: {now.wind_direction}</Text>
                        <Text style={styles.detailText}>风速: {now.wind_speed}km/h</Text>
                    </View>
                </>
            ) : (
                <Text>加载中...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
        padding: 16,
    },
    temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    weatherText: {
        fontSize: 24,
        color: '#666',
        marginBottom: 24,
    },
    detailsContainer: {
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
    },
    detailText: {
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
    },
});