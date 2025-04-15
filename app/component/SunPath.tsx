import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Circle, Path, G} from 'react-native-svg';

type SunPathProps = {
    sunrise: string;   // e.g. "06:00"
    sunset: string;    // e.g. "18:00"
};

export default function SunPath({sunrise, sunset}: SunPathProps) {
    const [currentTime, setCurrentTime] = useState(getCurrentTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentTime());
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

    // 椭圆的水平半径和垂直半径
    const radius = 33;
    const ry = radius; // 垂直半径
    const rx = ry * Math.sqrt(8); // 水平半径
    const cx = rx + 10;
    const cy = ry + 10;
    const rad = (angle * Math.PI) / 180;
    const x = cx - rx * Math.cos(rad);
    const y = cy - ry * Math.sin(rad);
    const startX = cx - rx;
    const endX = cx + rx;

    // 控制点：决定“鼓”的程度
    const controlY = cy - ry * 1.5;
    const d = ` M${startX},${cy}
          C${cx - rx / 2},${controlY} ${cx + rx / 2},${controlY} ${endX},${cy}`;

    return (
        <View style={styles.container}>
            <Svg width={2 * (rx + 10)} height={ry + 25} style={styles.svg}>
                <G>
                    {/*橄榄球轨迹 */}
                    <Path
                        d={d}
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
                <View>
                    <Text>日出</Text>
                    <Text>{sunrise}</Text>
                </View>
                <View>
                    <Text>日落</Text>
                    <Text>{sunset}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "space-evenly",
        marginHorizontal: 20,
        borderRadius: 12,
    },
    svg: {
        marginTop: 10
    },
    labels: {
        width: 220,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});