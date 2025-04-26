import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { formatTime, getWeatherIconUri } from '@/utils';
import { HourlyWeather } from '@/apis/weather/weatherForecast24Hours';

type HourlyWeatherProps = {
    data: HourlyWeather[];
};

export default function HourlyWeatherCpn({ data }: HourlyWeatherProps) {
    const widthPerItem = 60;
    const chartHeight = 100;
    const padding = 20;

    if (!data || !data.length) return null;

    const temps = data.map(item => Number(item.temperature));
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);

    const getPoint = (i: number) => {
        const x = i * widthPerItem + widthPerItem / 2;
        const y = chartHeight - ((Number(data[i].temperature) - minTemp) / (maxTemp - minTemp + 1)) * (chartHeight - padding);
        return { x, y };
    };

    const catmullRom2bezier = (points: { x: number; y: number }[]) => {
        if (points.length < 2) return '';

        let d = `M ${points[0].x} ${points[0].y} `;

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i - 1] || points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;

            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y} `;
        }

        return d;
    };

    const points = data.map((_, i) => getPoint(i));
    const bezierPath = catmullRom2bezier(points);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            snapToInterval={widthPerItem}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 10 }}
        >
            <View style={{ width: data.length * widthPerItem }}>
                <Svg
                    height={chartHeight + 30}
                    width={data.length * widthPerItem}
                    style={{ marginBottom: 10 }}
                >
                    <Path
                        d={bezierPath}
                        fill="none"
                        stroke="#4fc3f7"
                        strokeWidth={2}
                    />
                    {points.map((p, index) => (
                        <Circle key={index} cx={p.x} cy={p.y} r={3} fill="#4fc3f7" />
                    ))}
                </Svg>

                <View style={styles.row}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.item}>
                            <Text style={styles.time}>{formatTime(item.time)}</Text>
                            <Image
                                source={{ uri: getWeatherIconUri(Number(item.code), 'light') }}
                                style={styles.weatherIcon}
                            />
                            <Text style={styles.temp}>{item.temperature}°</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    row: {
        flexDirection: 'row',
    },
    item: {
        width: 60,
        alignItems: 'center',
    },
    time: {
        fontSize: 14,
        color: '#fff',
    },
    weatherIcon: {
        width: 30,
        height: 30,
        marginVertical: 5,
    },
    temp: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 5,
    },
});
