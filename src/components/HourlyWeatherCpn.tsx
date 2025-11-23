import {
    ScrollView,
    View,
    StyleSheet,
    NativeSyntheticEvent,
    NativeScrollEvent,
    useWindowDimensions,
    ScrollView as ScrollViewType,
} from "react-native";
import Svg, {Path, Circle, Text as SvgText} from "react-native-svg";
import {formatTime} from "@/utils";
import {HourlyWeather} from "@/apis/weather/weatherForecast24Hours";
import {useMemo, useRef, useState} from "react";
import {throttle} from "lodash";

type HourlyWeatherProps = {
    data: HourlyWeather[];
};

/**
 * 小时级天气预报组件，用于展示每小时的天气趋势图表及交互信息
 * @param {HourlyWeatherProps} props - 组件属性
 * @param {HourlyWeather[]} props.data - 小时级天气数据数组
 * @returns {JSX.Element | null} 渲染的小时级天气趋势图表组件，若无数据则返回null
 */
export default function HourlyWeatherCpn({data}: HourlyWeatherProps) {
    if (!Array.isArray(data) || data.length === 0) return null;
    const [scrollX, setScrollX] = useState(0);
    const scrollViewRef = useRef<ScrollViewType>(null);

    const widthPerItem = 60;
    const chartHeight = 100;
    const padding = 20;
    const {width: screenWidth} = useWindowDimensions();

    const temps = useMemo(
        () => data?.map((item) => Number(item.temperature)),
        [data]
    );
    const maxTemp = useMemo(() => Math.max(...temps), [temps]);
    const minTemp = useMemo(() => Math.min(...temps), [temps]);

    /**
     * 计算指定索引时间点的坐标位置（用于绘制趋势曲线）
     * @param {number} i - 时间点索引（对应data数组的下标）
     * @returns {{x: number, y: number}} 该时间点的坐标对象（x为水平位置，y为垂直温度位置）
     */
    const getPoint = (i: number): { x: number; y: number } => {
        const x = i * widthPerItem + widthPerItem / 2;
        const y =
            chartHeight -
            ((Number(data[i].temperature) - minTemp) / (maxTemp - minTemp + 1)) *
            (chartHeight - padding);
        return {x, y};
    };

    const points = useMemo(
        () => data?.map((_, i) => getPoint(i)),
        [data, maxTemp, minTemp]
    );

    /**
     * 将Catmull-Rom样条曲线转换为贝塞尔曲线路径字符串（用于SVG绘制）
     * @param {{x: number, y: number}[]} points - 原始关键点数组（至少需要2个点）
     * @returns {string} SVG路径字符串（格式符合Path元素的d属性要求）
     */
    const catmullRom2bezier = (points: { x: number; y: number }[]): string => {
        if (points.length < 2) return "";
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

    const bezierPath = useMemo(() => catmullRom2bezier(points), [points]);
    const totalWidth = useMemo(() => data.length * widthPerItem, [data]);
    const visibleWidth = screenWidth;

    const throttledScrollHandler = useRef(
        throttle((x: number) => setScrollX(x), 16)
    ).current;

    /**
     * 处理水平滚动事件（节流更新滚动位置）
     * @param {NativeSyntheticEvent<NativeScrollEvent>} e - 滚动事件对象
     */
    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        throttledScrollHandler(e.nativeEvent.contentOffset.x);
    };
    /**
     * 处理水平滚动结束事件
     * @param {NativeSyntheticEvent<NativeScrollEvent>} e - 滚动事件对象
     */
    const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / widthPerItem);
        const clampedIndex = Math.min(Math.max(index, 0), data.length - 1);
        const targetX = clampedIndex * widthPerItem;
        scrollViewRef.current?.scrollTo({x: targetX, animated: true});
        setScrollX(targetX);
    };

    /**
     * 计算当前滚动位置对应的交互球（指示当前关注时间点）的位置及显示信息（使用useMemo优化性能）
     * @returns {{x: number, y: number, temp: string, time: string, text: string}} 交互球的位置及显示信息对象
     * @property {number} x - 交互球中心点x坐标
     * @property {number} y - 交互球中心点y坐标
     * @property {string} temp - 插值后的温度值（四舍五入为整数）
     * @property {string} time - 当前时间点格式化后的时间文本
     * @property {string} text - 当前时间点的天气状况描述
     */
        // 使用useMemo缓存计算结果，优化性能：根据滚动位置计算交互球的位置及显示信息
    const ball = useMemo(() => {
            // 计算滚动进度（0-1之间）：当前滚动距离 / (总宽度 - 可见宽度)，确保不超过1
            const progress = Math.min(scrollX / (totalWidth - visibleWidth), 1);
            // 计算交互球的X坐标：进度 * (总宽度 - 单条目宽度)，确定水平位置
            const ballX = progress * (totalWidth - widthPerItem);
            // 计算浮点索引：交互球X坐标 / 单条目宽度，用于插值计算相邻条目
            const indexFloat = ballX / widthPerItem;
            // 向下取整得到当前主索引
            const index = Math.floor(indexFloat);
            // 相邻次索引（主索引+1）
            const nextIndex = index + 1;
            // 插值比例：浮点索引与主索引的差值（0-1之间），表示当前位置在两个条目间的比例
            const ratio = indexFloat - index;

            // 安全取值函数：确保数组索引在有效范围内（防止越界）
            const getSafe = <T, >(arr: T[], i: number): T =>
                arr[Math.max(0, Math.min(i, arr.length - 1))];

            // 获取主索引和次索引对应的曲线点坐标（用于计算Y轴位置）
            const p1 = getSafe(points, index);
            const p2 = getSafe(points, nextIndex);
            // 获取主索引和次索引对应的天气数据（用于计算温度和显示信息）
            const d1 = getSafe(data, index);
            const d2 = getSafe(data, nextIndex);

            // 线性插值计算Y坐标：主索引点Y值 + 次索引点Y值差值 * 比例
            const y = p1.y + (p2.y - p1.y) * ratio;
            // 线性插值计算温度：主索引温度 + 次索引温度差值 * 比例
            const temperature =
                Number(d1.temperature) +
                (Number(d2.temperature) - Number(d1.temperature)) * ratio;

            return {
                x: ballX + widthPerItem / 2, // 交互球中心点X坐标（加上半条目宽度居中）
                y, // 交互球中心点Y坐标（温度插值结果）
                temp: temperature.toFixed(0), // 温度值四舍五入为整数
                time: formatTime(d1.time), // 格式化主索引时间（显示当前关注时间）
                text: d1.text, // 主索引天气状况描述（显示当前天气）
            };
        }, [scrollX, totalWidth, visibleWidth, data, points]);
    if (!data || !data.length) return null;
    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            decelerationRate="fast"
            snapToInterval={widthPerItem}
            snapToAlignment="start"
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScrollEnd}
            contentContainerStyle={{paddingHorizontal: 10, width: totalWidth + 20}}
        >
            <View style={{width: totalWidth}}>
                <Svg
                    height={chartHeight + 60}
                    width={totalWidth}
                    style={{marginBottom: 10}}
                >
                    <Path d={bezierPath} fill="none" stroke="#4fc3f7" strokeWidth={2}/>
                    <SvgText
                        x={ball.x}
                        y={ball.y - 14}
                        fontSize="13"
                        fill="#fff"
                        fontWeight="bold"
                        textAnchor="middle"
                    >
                        {ball.time}
                    </SvgText>
                    <Circle cx={ball.x} cy={ball.y} r={10} fill="#4fc3f7"/>
                    <SvgText
                        x={ball.x}
                        y={ball.y + 24}
                        fontSize="12"
                        fill="#fff"
                        textAnchor="middle"
                    >
                        {ball.text}
                    </SvgText>
                    <SvgText
                        x={ball.x}
                        y={ball.y + 4}
                        fontSize="10"
                        fill="#fff"
                        fontWeight="bold"
                        textAnchor="middle"
                    >
                        {ball.temp}
                    </SvgText>
                </Svg>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {},
    row: {
        flexDirection: "row",
    },
    item: {
        width: 60,
        alignItems: "center",
    },
    time: {
        fontSize: 14,
        color: "#fff",
    },
    weatherIcon: {
        width: 30,
        height: 30,
        marginVertical: 5,
        borderRadius: 10,
    },
});
