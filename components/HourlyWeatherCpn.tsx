import {
    ScrollView,
    View,
    StyleSheet,
    NativeSyntheticEvent,
    NativeScrollEvent,
    useWindowDimensions,
    ScrollView as ScrollViewType,
} from 'react-native';
import Svg, {Path, Circle, Text as SvgText} from 'react-native-svg';
import {formatTime} from '@/utils';
import {HourlyWeather} from '@/apis/weather/weatherForecast24Hours';
import {useRef, useState} from "react";

type HourlyWeatherProps = {
    data: HourlyWeather[];
};

export default function HourlyWeatherCpn({data}: HourlyWeatherProps) {
    const [scrollX, setScrollX] = useState(0);
    const scrollViewRef = useRef<ScrollViewType>(null);

    const widthPerItem = 60;
    const chartHeight = 100;
    const padding = 20;
    const {width: screenWidth} = useWindowDimensions();

    if (!data || !data.length) return null;

    const temps = data.map(item => Number(item.temperature));
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);

    const getPoint = (i: number) => {
        const x = i * widthPerItem + widthPerItem / 2;
        const y =
            chartHeight -
            ((Number(data[i].temperature) - minTemp) / (maxTemp - minTemp + 1)) *
            (chartHeight - padding);
        return {x, y};
    };

    const points = data.map((_, i) => getPoint(i));

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

    const bezierPath = catmullRom2bezier(points);
    const totalWidth = data.length * widthPerItem;
    const visibleWidth = screenWidth;

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        setScrollX(e.nativeEvent.contentOffset.x);
    };

    const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / widthPerItem);
        const clampedIndex = Math.min(Math.max(index, 0), data.length - 1);
        const targetX = clampedIndex * widthPerItem;
        scrollViewRef.current?.scrollTo({x: targetX, animated: true});
        setScrollX(targetX);
    };

    const progress = Math.min(scrollX / (totalWidth - visibleWidth), 1);
    const ballX = progress * (totalWidth - widthPerItem);
    const indexFloat = ballX / widthPerItem;
    const index = Math.floor(indexFloat);
    const nextIndex = index + 1;
    const ratio = indexFloat - index;

    const getSafe = <T, >(arr: T[], i: number): T => arr[Math.max(0, Math.min(i, arr.length - 1))];

    const p1 = getSafe(points, index);
    const p2 = getSafe(points, nextIndex);
    const d1 = getSafe(data, index);
    const d2 = getSafe(data, nextIndex);

    const y = p1.y + (p2.y - p1.y) * ratio;
    const temperature = Number(d1.temperature) + (Number(d2.temperature) - Number(d1.temperature)) * ratio;

    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={widthPerItem}
            snapToAlignment="start"
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScrollEnd}
            contentContainerStyle={{
                paddingHorizontal: 10,
                width: totalWidth + 20,
            }}
        >
            <View style={{width: totalWidth}}>
                <Svg height={chartHeight + 60} width={totalWidth} style={{marginBottom: 10}}>
                    <Path d={bezierPath} fill="none" stroke="#4fc3f7" strokeWidth={2}/>
                    <SvgText
                        x={ballX + widthPerItem / 2}
                        y={y - 14}
                        fontSize="13"
                        fill="#fff"
                        fontWeight="bold"
                        textAnchor="middle"
                    >
                        {formatTime(d1.time)}
                    </SvgText>

                    <Circle cx={ballX + widthPerItem / 2} cy={y} r={10} fill="#4fc3f7"/>
                    <SvgText
                        x={ballX + widthPerItem / 2}
                        y={y + 24}
                        fontSize="12"
                        fill="#fff"
                        textAnchor="middle"
                    >
                        {d1.text}
                    </SvgText>
                    <SvgText
                        x={ballX + widthPerItem / 2}
                        y={y + 4}
                        fontSize="10"
                        fill="#fff"
                        fontWeight="bold"
                        textAnchor="middle"
                    >
                        {temperature.toFixed(0)}
                    </SvgText>
                </Svg>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
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
        borderRadius: 10,
    },
});
