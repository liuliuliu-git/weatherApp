import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { formatTime, getWeatherIconUri } from "@/utils";
import { HourlyWeather } from "@/apis/weather/weatherForecast24Hours";

type HourlyWeatherProps = {
    data: HourlyWeather[];
};

export default function HourlyWeatherCpn({ data }: HourlyWeatherProps) {
    const widthPerItem = 60;
    const chartHeight = 120;
    const paddingTop = 20;
    const paddingBottom = 20;

    if (!data || !data.length) return null;

    const temps = data.map(item => Number(item.temperature));
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const tempRange = maxTemp - minTemp || 1;

    const getPoint = (index: number) => {
        const x = index * widthPerItem + widthPerItem / 2;
        const normalizedTemp = (Number(data[index].temperature) - minTemp) / tempRange;
        const y = paddingTop + (1 - normalizedTemp) * (chartHeight - paddingTop - paddingBottom);
        return { x, y };
    };

    const generateBezierPath = () => {
        if (data.length === 0) return '';
        let d = '';
        const start = getPoint(0);
        d += `M ${start.x} ${start.y} `;

        for (let i = 0; i < data.length - 1; i++) {
            const p1 = getPoint(i);
            const p2 = getPoint(i + 1);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            d += `Q ${p1.x} ${p1.y} ${midX} ${midY} `;
        }

        const last = getPoint(data.length - 1);
        d += `Q ${last.x} ${last.y} ${last.x} ${last.y}`;
        return d;
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={widthPerItem}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: widthPerItem / 2 }}
            style={styles.container}
        >
            <View style={{ width: data.length * widthPerItem }}>
                <Svg
                    height={chartHeight}
                    width={data.length * widthPerItem}
                    style={{ marginBottom: 10 }}
                    viewBox={`0 0 ${data.length * widthPerItem} ${chartHeight}`}
                >
                    {/* 渐变定义 */}
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0%" stopColor="#4fc3f7" />
                            <Stop offset="100%" stopColor="#81d4fa" />
                        </LinearGradient>
                    </Defs>

                    {/* 折线路径（渐变填充） */}
                    <Path
                        d={generateBezierPath()}
                        fill="none"
                        stroke="url(#grad)"
                        strokeWidth={2}
                    />

                    {/* 圆点 */}
                    {data.map((item, index) => {
                        const { x, y } = getPoint(index);
                        return <Circle key={index} cx={x} cy={y} r={3} fill="#4fc3f7" />;
                    })}
                </Svg>

                {/* 底部小时内容 */}
                <View style={styles.row}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.item}>
                            <Text style={styles.time}>{formatTime(item.time)}</Text>
                            <Image
                                source={{ uri: getWeatherIconUri(Number(item.code), "light") }}
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
