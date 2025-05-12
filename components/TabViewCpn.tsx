
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import LiveTab from "@/components/tabCpns/LiveTab";
import HourlyTab from "@/components/tabCpns/HourlyTab";
import DailyTab from "@/components/tabCpns/DailyTab";
import FifteenDaysTab from "@/components/tabCpns/FifteenDaysTab";
import LifeIndexTab from "@/components/tabCpns/LifeIndexTab";
import AirQualityTab from "@/components/tabCpns/AirQualityTab";
import {useEffect, useRef, useState} from "react";
import {useSelectedDateIndexStore} from "@/stores/useSelectedDateIndexStore";

// 初始布局配置
const initialLayout = {width: Dimensions.get('window').width};


export default function TabViewCpn() {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key: 'live', title: '实况'},
        {key: 'hourly', title: '逐小时'},
        {key: 'daily', title: '单日'},
        {key: 'fifteenDays', title: '15日'},
        {key: 'lifeIndex', title: '生活指数'},
        {key: 'airQuality', title: '空气质量'},
    ]);
    const { selectedDateIndex } = useSelectedDateIndexStore();

    // ref 来记录上一次 index，避免无限循环
    const prevSelectedDateIndexRef = useRef<number | null>(null);

    useEffect(() => {
        // 如果 selectedDateIndex 有效，并且当前不在 daily 页，才跳转
        if (
            selectedDateIndex !== prevSelectedDateIndexRef.current &&
            index !== 2 // dailyTab 的 index 是 2
        ) {
            setIndex(2); // 切换到 DailyTab
        }
        prevSelectedDateIndexRef.current = selectedDateIndex;
    }, [selectedDateIndex]);
    const renderScene = ({route}: { route: { key: string } }) => {
        switch (route.key) {
            case 'live':
                return <LiveTab />;
            case 'hourly':
                return <HourlyTab />;
            case 'daily':
                return <DailyTab />;
            case 'fifteenDays':
                return <FifteenDaysTab />;
            case 'lifeIndex':
                return <LifeIndexTab />;
            case 'airQuality':
                return <AirQualityTab />;
            default:
                return <View><Text>无内容</Text></View>;
        }
    };


    return (
        <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={props => (
                <TabBar
                    {...props}
                    scrollEnabled={true}  // 允许横向滑动
                    indicatorStyle={styles.indicatorStyle}
                    style={styles.backColor}
                    activeColor="black"
                    inactiveColor="gray"
                    tabStyle={styles.tabStyle} // 标签宽度自动适应内容
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    indicatorStyle: {
        backgroundColor: 'blue',
        height: 2
    },
    backColor: {
        backgroundColor: 'white'
    },
    tabStyle: {
        width: 'auto'
    }
});