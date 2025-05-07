import * as React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import LiveTab from "@/app/component/tabCpns/LiveTab";
import HourlyTab from "@/app/component/tabCpns/HourlyTab";
import DailyTab from "@/app/component/tabCpns/DailyTab";
import FifteenDaysTab from "@/app/component/tabCpns/FifteenDaysTab";
import LifeIndexTab from "@/app/component/tabCpns/LifeIndexTab";
import AirQualityTab from "@/app/component/tabCpns/AirQualityTab";

// 初始布局配置
const initialLayout = {width: Dimensions.get('window').width};

export interface TabViewCpnProps {
    data?: { key: string; location: string }
}

export default function TabViewCpn({data}: TabViewCpnProps) {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: 'live', title: '实况'},
        {key: 'hourly', title: '逐小时'},
        {key: 'daily', title: '单日'},
        {key: 'fifteenDays', title: '15日'},
        {key: 'lifeIndex', title: '生活指数'},
        {key: 'airQuality', title: '空气质量'},
    ]);

    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case 'live':
                return <LiveTab data={data} />;
            case 'hourly':
                return <HourlyTab data={data} />;
            case 'daily':
                return <DailyTab data={data} />;
            case 'fifteenDays':
                return <FifteenDaysTab data={data} />;
            case 'lifeIndex':
                return <LifeIndexTab data={data} />;
            case 'airQuality':
                return <AirQualityTab data={data} />;
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