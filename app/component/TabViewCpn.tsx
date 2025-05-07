import * as React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

// 定义每个路由对应的组件
const LiveRoute = () => <View style={styles.scene}><Text>实况内容</Text></View>;
const HourlyRoute = () => <View style={styles.scene}><Text>逐小时内容</Text></View>;
const DailyRoute = () => <View style={styles.scene}><Text>单日内容</Text></View>;
const FifteenDaysRoute = () => <View style={styles.scene}><Text>15日内容</Text></View>;
const WindHumidityRoute = () => <View style={styles.scene}><Text>风力风向、湿度内容</Text></View>;
const LifeIndexRoute = () => <View style={styles.scene}><Text>生活指数内容</Text></View>;
const AirQualityRoute = () => <View style={styles.scene}><Text>空气质量内容</Text></View>;
const SunriseSunsetRoute = () => <View style={styles.scene}><Text>日出日落内容</Text></View>;

// 初始布局配置
const initialLayout = {width: Dimensions.get('window').width};

export default function TabViewCpn() {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: 'live', title: '实况'},
        {key: 'hourly', title: '逐小时'},
        {key: 'daily', title: '单日'},
        {key: 'fifteenDays', title: '15日'},
        {key: 'windHumidity', title: '天气指数'},
        {key: 'lifeIndex', title: '生活指数'},
        {key: 'airQuality', title: '空气质量'},
        {key: 'sunriseSunset', title: '日出日落'},
    ]);

    // 场景映射
    const renderScene = SceneMap({
        live: LiveRoute,
        hourly: HourlyRoute,
        daily: DailyRoute,
        fifteenDays: FifteenDaysRoute,
        windHumidity: WindHumidityRoute,
        lifeIndex: LifeIndexRoute,
        airQuality: AirQualityRoute,
        sunriseSunset: SunriseSunsetRoute,
    });

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
                    indicatorStyle={{ backgroundColor: 'blue', height: 2 }}
                    style={{ backgroundColor: 'white' }}
                    activeColor="black"
                    inactiveColor="gray"
                    tabStyle={{ width: 'auto' }} // 标签宽度自动适应内容
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
    },
});