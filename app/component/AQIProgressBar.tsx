// AQIProgressBar.tsx
import React, {useEffect, useRef} from 'react';
import Svg, {Rect, Defs, LinearGradient, Stop, Line} from 'react-native-svg';
import {View, Text, StyleSheet, Animated} from 'react-native';


const AQI_LEVELS = [
    {label: '优', max: 50, color: '#78b30f'},
    {label: '良', max: 100, color: '#D1D50F'},
    {label: '轻度污染', max: 150, color: '#E69C19'},
    {label: '中度污染', max: 200, color: '#CC1119'},
    {label: '重度污染', max: 300, color: '#710078'},
    {label: '严重污染', max: 500, color: '#4A0D1F'},
];
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedLine = Animated.createAnimatedComponent(Line);

const WIDTH = 300;
const HEIGHT = 10;

const AQIProgressBar = ({aqi}: { aqi: number }) => {

    const getAQILevel = () =>
        AQI_LEVELS.find((level) => aqi <= level.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
    const level = getAQILevel();
    const aqiLineX = useRef(new Animated.Value(0)).current;
    // 限制文字移动范围，防止越界
    const clampedX = aqiLineX.interpolate({
        inputRange: [-5, WIDTH],
        outputRange: [0, WIDTH - 15], // 防止右边超出，30 是文字宽度预估
        extrapolate: 'clamp',
    });
    useEffect(() => {
        const toValue = (aqi / 500) * WIDTH;
        Animated.timing(aqiLineX, {
            toValue,
            delay:700,
            duration: 2000, // 动画持续时间
            useNativeDriver: true,
        }).start();
    }, [aqi]);


    return (
        <View style={styles.container}>

            {/* AQI 数值（上方） */}
            <Animated.View
                style={[
                    styles.textAbove,
                    {
                        transform: [{translateX: clampedX}],
                    },
                ]}
            >
                <Text style={styles.aqiText}>{aqi}</Text>
            </Animated.View>
            {/* AQI 等级（下方） */}
            <Animated.View
                style={[
                    styles.textBelow,
                    {
                        transform: [{translateX: clampedX}],
                    },
                ]}
            >
                <Text style={styles.levelText}>{level.label}</Text>
            </Animated.View>
            <Svg width={WIDTH} height={50}>
                <Defs>
                    <LinearGradient id="aqiGradient" x1="0" y1="0" x2={WIDTH} y2="0" gradientUnits="userSpaceOnUse">
                        <Stop offset="0%" stopColor="#00E400"/>
                        <Stop offset="10%" stopColor="#FFFF00"/>
                        <Stop offset="30%" stopColor="#FF7E00"/>
                        <Stop offset="45%" stopColor="#FF0000"/>
                        <Stop offset="65%" stopColor="#8F3F97"/>
                        <Stop offset="100%" stopColor="#7E0023"/>
                    </LinearGradient>
                </Defs>
                {/* 背景条 */}
                <Rect
                    x="0"
                    y="15"
                    width={WIDTH}
                    height={HEIGHT}
                    rx={5}
                    fill="url(#aqiGradient)"
                />
                <AnimatedRect
                    x={aqiLineX}
                    y={10}
                    width={2}
                    height={20}
                    opacity={0.8}
                    fill="url(#aqiGradient)"
                />
            </Svg>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 16,
    },
    aqiText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    levelText: {
        fontSize: 12,
        color: '#888',
    },
    textAbove: {
        position: 'absolute',
        top: -10,
        left: -7,
        alignItems: 'center',
    },

    textBelow: {
        position: 'absolute',
        top: 30, // 底部偏移刚好在竖条底部下方
        left: -6,
        alignItems: 'center',
    },

});

export default AQIProgressBar;
