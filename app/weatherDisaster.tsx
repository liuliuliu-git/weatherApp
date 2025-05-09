import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useLocationStore} from '@/stores/useLocationStore';
import {useAlarmData} from "@/hooks/useAlarmData";
import {Location} from "@/apis/shared";
export default function WeatherDisaster() {
    const {location} = useLocationStore();
    // 气象预警
    const {weatherAlarm} = useAlarmData(location as Location);
    return (
        <View style={styles.container}>
            {weatherAlarm &&
                <View key={weatherAlarm.alarm_id} style={styles.alarmItem}>
                    <Text style={styles.title}>{weatherAlarm.title}</Text>
                    <Text style={styles.description}>{weatherAlarm.description}</Text>
                    <Text style={styles.pubDate}>发布时间: {weatherAlarm.pub_date}</Text>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
        flexDirection: 'column',
    },
    alarmItem: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    pubDate: {
        fontSize: 14,
        color: '#666',
    }

});