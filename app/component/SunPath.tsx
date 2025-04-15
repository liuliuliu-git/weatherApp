import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Circle, Path, G} from 'react-native-svg';
import {FontAwesome5} from '@expo/vector-icons';

type SunPathProps = {
    sunrise: string;   // e.g. "06:00"
    sunset: string;    // e.g. "18:00"
}

export default function SunPath({sunrise, sunset}: SunPathProps) {

    const [currentTime, setCurrentTime] = useState(getCurrentTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentTime());
            console.log(currentTime)
        }, 60000); // 每分钟更新一次
        return () => clearInterval(interval);
    }, []);

    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    if (!sunrise || !sunset) {
        return (
            <View style={styles.container}>
                <Text>正在加载日出日落时间...</Text>
            </View>
        );
    }


    const radius = 100;
    const cx = radius + 10;
    const cy = radius + 10;

    // 将时间转为角度
    const timeToAngle = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        const minutes = h * 60 + m;
        const sunriseM = parseInt(sunrise.split(':')[0]) * 60 + parseInt(sunrise.split(':')[1]);
        const sunsetM = parseInt(sunset.split(':')[0]) * 60 + parseInt(sunset.split(':')[1]);
        const total = sunsetM - sunriseM;
        const offset = minutes - sunriseM;
        const percent = Math.max(0, Math.min(1, offset / total));
        return 180 * percent;
    };

    const angle = timeToAngle(currentTime);
    const rad = (angle * Math.PI) / 180;
    const x = cx - radius * Math.cos(rad);
    const y = cy - radius * Math.sin(rad);

    return (
        <View style={styles.container}>
            <Svg width={2 * (radius + 10)} height={radius + 30}>
                <G>
                    {/* 半圆轨迹 */}
                    <Path
                        d={`M${cx - radius},${cy} A${radius},${radius} 0 0,1 ${cx + radius},${cy}`}
                        stroke="#FDB813"
                        strokeWidth={4}
                        fill="none"
                    />

                    {/* 当前太阳位置 */}
                    <Circle cx={x} cy={y} r={8} fill="#FDB813"/>
                </G>
            </Svg>

            {/* 时间标签 */}
            <View style={styles.labels}>
                <Text>{sunrise}</Text>
                <FontAwesome5 name="sun" size={20} color="#FDB813"/>
                <Text>{sunset}</Text>
            </View>

            <Text style={styles.time}>当前时间：{currentTime}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 30,
    },
    labels: {
        width: 220,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    time: {
        marginTop: 8,
        fontSize: 14,
        color: '#555',
    },
});
