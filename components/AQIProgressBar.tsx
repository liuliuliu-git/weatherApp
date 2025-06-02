// AQIProgressBar.tsx
import Svg, {Rect, Defs, LinearGradient, Stop} from 'react-native-svg';
import {View, StyleSheet, Animated} from 'react-native';
import {useEffect, useRef} from "react";
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const WIDTH = 300;
const HEIGHT = 10;

const AQIProgressBar = ({aqi}: { aqi: number }) => {
    const aqiLineX = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const toValue = (aqi / 500) * WIDTH;
        Animated.timing(aqiLineX, {
            toValue,
            delay: 200,
            duration: 2000, // 动画持续时间
            useNativeDriver: true,
        }).start();
    }, [aqi]);


    return (
        <View style={styles.container}>
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
