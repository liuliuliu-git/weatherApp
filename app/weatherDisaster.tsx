import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useLocationStore} from '@/stores/useLocationStore';
import {Alarm, getWeatherAlarm} from '@/apis/weather/weatherAlarm';
import { handleAxiosError} from '@/utils';
export default function WeatherDisaster() {
    const {location} = useLocationStore();
    const [weatherAlarms, setWeatherAlarms] = useState<Alarm[] | null>(null);

    const fetchWeatherAlarms = async (locationId: string) => {
        try {
            const {data} = await getWeatherAlarm({
                key: process.env.EXPO_PUBLIC_API_KEY || "",
                location: locationId
            });
            setWeatherAlarms(data.results[0].alarms);
        } catch (error) {
            handleAxiosError(error);
        }
    };

    useEffect(() => {
        if (location?.id) {
            fetchWeatherAlarms(location.id);
        }
    }, [location]);

    return (
        <View style={styles.container}>
            {weatherAlarms && weatherAlarms.map((alarm, index) => (
                <View key={alarm.alarm_id || index} style={styles.alarmItem}>
                    <Text style={styles.title}>{alarm.title}</Text>
                    <Text style={styles.description}>{alarm.description}</Text>
                    <Text style={styles.pubDate}>发布时间: {alarm.pub_date}</Text>
                </View>
            ))}
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