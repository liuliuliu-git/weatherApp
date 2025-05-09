import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    SectionList
} from "react-native";

import {ThemeContext} from "@/context/ThemeContext";
import {useContext, useMemo} from "react";
import {StatusBar} from "expo-status-bar";
import {
    FontAwesome5,
    MaterialIcons,
    Entypo,
    Feather,
    Ionicons,
    MaterialCommunityIcons, FontAwesome6
} from '@expo/vector-icons';
import {useRouter} from "expo-router";
import {Inter_500Medium, useFonts} from "@expo-google-fonts/inter";
import {ColorScheme, Theme} from "@/types";
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocationStore} from "@/stores/useLocationStore";
import {grayColor, alarmColors} from "@/constants/Colors";
import AQIProgressBar from "@/components/AQIProgressBar";
import {
    HourlyWeather,
} from "@/apis/weather/weatherForecast24Hours";
import {
    getAlarmIconInfo,
    getAlarmLevelStyle,
    getAlarmLevelIconStyle,
    getWeatherIconUri,
    getWeekday,
    handleAxiosError
} from '@/utils';
import SunPathWebView from "@/components/SunPathWebView";
import HourlyWeatherCpn from "@/components/HourlyWeatherCpn";
import {useWeatherFact} from "@/hooks/useWeatherFact";
import {Location} from "@/apis/shared";
import {useWeatherDaily} from "@/hooks/useWeatherDaily";
import {useSunData} from "@/hooks/useSunData";
import {useLifeIndex} from "@/hooks/useLifeIndex";
import {useAirQuality} from "@/hooks/useAirQuality";
import {useWeatherForecast24Hours} from "@/hooks/useWeatherForecast24Hours";
import {useAlarmData} from "@/hooks/useAlarmData";

export default function Index() {
    const {location} = useLocationStore();
    const {colorScheme, theme} = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme);
    //地点天气
    const {now} = useWeatherFact(location as Location);
    //逐日天气预报以及昨日天气
    const {weatherDaily} = useWeatherDaily(location as Location,7,-1);
    // 日出日落
    const {sunData} = useSunData(location as Location);
    //当日生活指数
    const {lifeIndex} = useLifeIndex(location as Location);
    //空气质量实况
    const {airQuality} = useAirQuality(location as Location);
    //24小时内天气预报
    const {weatherForecastHourly} = useWeatherForecast24Hours(location as Location);
    // 气象预警
    const {weatherAlarm} = useAlarmData(location as Location);
    const router = useRouter();
    const [loaded, error] = useFonts({
        Inter_500Medium,
    })
    const aqi = useMemo(() => {
        const parsed = parseInt(airQuality?.aqi as string);
        return isNaN(parsed) ? 0 : parsed;
    }, [airQuality]);
    if (!loaded && !error) {
        return null
    }

    // 创建一个渲染不同区块的函数
    const renderSections = () => {
        const sections = [
            {
                type: 'current',
                data: [null] // 只需一个占位元素
            },
            {
                type: 'hourlyWeather',
                data: [null]
            },
            {
                type: 'forecast',
                data: weatherDaily || []
            },
            {
                type: 'more',
                data: [null]
            },
            {
                type: 'sun',
                data: [null]
            },
            {
                type: 'airQuality',
                data: [null]
            },
            {
                type: 'suggestions',
                data: [null]
            }
        ];
        return sections;
    };

    // 根据section类型渲染不同的区块
    const renderSection = ({section}: { section: { type: string, data: any[] } }) => {
        switch (section.type) {
            case 'current':
                return (
                    <View style={[styles.weatherMain, styles.weatherMainContainer]}>
                        <View style={styles.weatherMainHead}>
                            <Text style={styles.tempText}>{now?.temperature}</Text>
                            <View style={styles.weatherMainHeadRight}>
                                <Text style={styles.celsiusText}>°C</Text>
                                <View style={styles.feelsLikeContainer}>
                                    <Text style={styles.weatherMainHeadRightText}>体感</Text>
                                    <Text style={styles.weatherMainHeadRightText}> {now?.feels_like}°C</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.weatherTextContainer}>
                            <Text style={styles.currentWeatherText}>{now?.text}</Text>
                            {/*最低温度到最高温度*/}
                            <View style={styles.tempRangeContainer}>
                                <Text style={styles.tempRangeText}>{weatherDaily?.[0]?.low}</Text>
                                <Text style={styles.tempRangeText}> ~ </Text>
                                <Text style={styles.tempRangeText}>{weatherDaily?.[0]?.high}°C</Text>
                            </View>
                        </View>

                        {/* 气象灾害预警信息 */}
                        {weatherAlarm && (
                            <TouchableOpacity
                                style={[styles.weatherAlarmContainer, getAlarmLevelStyle(weatherAlarm.level)]}
                                onPress={() => router.push('/weatherDisaster')}
                            >
                                <View
                                    style={[styles.weatherAlarmIconContainer, getAlarmLevelIconStyle(weatherAlarm.level)]}>
                                    {renderAlarmIcon(weatherAlarm.type)}
                                </View>
                                <Text style={styles.weatherAlarmText} numberOfLines={1} ellipsizeMode="tail">
                                    {weatherAlarm.type}{weatherAlarm.level}预警
                                </Text>
                                <Feather name="chevron-right" size={16} color="#fff" style={{marginTop: 3}}/>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            case 'hourlyWeather':
                return <HourlyWeatherCpn data={weatherForecastHourly as HourlyWeather[]}></HourlyWeatherCpn>
            case 'more':
                return (
                    <View style={styles.moreWeatherContainer}>
                        <Text style={styles.moreWeather}
                              onPress={() => router.push("/weatherDetail")}>查看更多天气 {">"}</Text>
                    </View>
                );
            case 'sun':
                return <SunPathWebView sunrise={sunData?.sunrise as string} sunset={sunData?.sunset as string}/>

            case 'airQuality':
                return (
                    <View style={styles.airQualityContainer}>
                        <View style={styles.airQualityCard}>
                            <View style={styles.airQualityHeader}>
                                <View style={styles.airQualityValue}>
                                    <Text style={styles.airQualityNumber}>空气质量指数</Text>
                                </View>
                                <TouchableOpacity style={styles.airQualityMore}>
                                    <Text style={styles.airQualityMoreText}>查看详情</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.airQualityProgressContainer}>
                                <AQIProgressBar aqi={aqi}/>
                                <View style={styles.airQualityRange}>
                                    <Text style={styles.airQualityRangeText}>优</Text>
                                    <Text style={styles.airQualityRangeText}>严重</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            case 'suggestions':
                return (
                    <View style={styles.suggestionContainer}>
                        <View style={styles.suggestionGrid}>
                            {/* 晾晒 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.blueIconContainer]}>
                                        <Ionicons name="shirt-outline" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>晾晒</Text>
                                    <Text style={styles.suggestionDesc}>{lifeIndex?.airing?.brief}</Text>
                                </View>
                            </View>

                            {/* 过敏 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.purpleIconContainer]}>
                                        <MaterialIcons name="healing" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>过敏</Text>
                                    <Text style={styles.suggestionDesc}>{lifeIndex?.allergy?.brief}</Text>
                                </View>
                            </View>

                            {/* 旅游 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.tealIconContainer]}>
                                        <MaterialCommunityIcons name="kite" size={24} color="#ffffff"/>
                                    </View>
                                    <Text style={styles.suggestionText}>放风筝</Text>
                                    <Text style={styles.suggestionDesc}>{lifeIndex?.kiteflying?.brief}</Text>
                                </View>
                            </View>

                            {/* 运动 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.greenIconContainer]}>
                                        <Ionicons name="fitness-outline" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>运动</Text>
                                    <Text style={styles.suggestionDesc}>{lifeIndex?.sport?.brief}</Text>
                                </View>
                            </View>

                            {/* 钓鱼 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.orangeIconContainer]}>
                                        <FontAwesome6 name="fish-fins" size={22} color="white" />
                                    </View>
                                    <Text style={styles.suggestionText}>钓鱼</Text>
                                    <Text style={styles.suggestionDesc}>{lifeIndex?.fishing?.brief}</Text>
                                </View>
                            </View>

                            {/* 洗车 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.blueGrayIconContainer]}>
                                        <Ionicons name="car-outline" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>洗车</Text>
                                    <Text style={styles.suggestionDesc}>{lifeIndex?.car_washing?.brief}</Text>
                                </View>
                            </View>
                            {/* 雨伞 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.indigoIconContainer]}>
                                        <Ionicons name="umbrella-outline" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>雨伞</Text>
                                    <Text style={styles.suggestionDesc}>{lifeIndex?.umbrella?.brief}</Text>
                                </View>
                            </View>

                            {/* 感冒 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.redIconContainer]}>
                                        <Ionicons name="medical-outline" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>感冒</Text>

                                    <Text style={styles.suggestionDesc}>{lifeIndex?.flu?.brief}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    const renderItem = ({item, section}: { item: any, section: { type: string } }) => {
        if (section.type === 'forecast') {
            // 提取日期和月份
            const dateParts = item.date.split('-');
            const month = dateParts[1];
            const day = dateParts[2];

            // 降雨概率计算
            const rainProb = Math.round(parseFloat(item.precip) * 100);

            return (
                <View style={styles.dailyWeatherItem}>
                    {/* 日期和星期 */}
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{`${month}/${day}`}</Text>
                        <Text style={styles.weekdayText}>
                            {getWeekday(item.date)}
                        </Text>
                    </View>

                    {/* 天气图标和降雨概率固定宽度容器 */}
                    <View style={styles.weatherIconContainer}>
                        <Image
                            source={{uri: getWeatherIconUri(Number(item.code_day), "light")}}
                            style={styles.weatherIcon}
                        />
                        {rainProb > 0 ? (
                            <Text style={styles.rainProbability}>{rainProb}%</Text>
                        ) : (
                            <Text style={[styles.rainProbability, {opacity: 0}]}>0%</Text>
                        )}
                    </View>

                    {/* 温度 */}
                    <View style={styles.tempContainer}>
                        <View style={styles.tempMinContainer}>
                            <Text style={styles.tempMin}>{item.low}</Text>
                        </View>
                        <View style={styles.tempMaxContainer}>
                            <Text style={styles.tempMax}>{item.high}</Text>
                        </View>
                    </View>
                </View>
            );
        }
        return null;
    };

    // 渲染预警图标
    const renderAlarmIcon = (alarmType: string) => {
        const iconInfo = getAlarmIconInfo(alarmType);

        switch (iconInfo.iconType) {
            case 'ionicons':
                return <Ionicons name={iconInfo.iconName as any} size={18} color="#fff"/>;
            case 'material':
                return <MaterialIcons name={iconInfo.iconName as any} size={18} color="#fff"/>;
            case 'material-community':
                return <MaterialCommunityIcons name={iconInfo.iconName as any} size={18} color="#fff"/>;
            case 'feather':
                return <Feather name={iconInfo.iconName as any} size={18} color="#fff"/>;
            default:
                return <MaterialIcons name="warning" size={18} color="#fff"/>;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground blurRadius={50} style={styles.image} source={require("../assets/images/img.png")}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerMain}>
                        <TouchableOpacity onPress={() => {
                            router.push("/search")
                        }} style={{marginTop: 5}}>
                            <FontAwesome5 name="search-location" size={24} color={theme.text}/>
                        </TouchableOpacity>
                        <Text style={styles.cityText}>{location?.name}
                            <Entypo name="location" size={24} color={theme.text} style={styles.locationIcon}/>
                        </Text>
                        <TouchableOpacity onPress={() => {
                            router.push("/settings");
                        }} style={{marginTop: 5}}>
                            <Feather name="more-vertical" size={28} color={theme.text}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerLine}>
                    </View>
                </View>

                <SectionList
                    sections={renderSections()}
                    keyExtractor={(item, index) => {
                        if (item === null) return `null-${index}`;
                        if (typeof item === 'object' && 'date' in item) return item.date;
                        return `item-${index}`;
                    }}
                    renderItem={renderItem}
                    renderSectionHeader={renderSection}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                />

                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
            </ImageBackground>
        </SafeAreaView>
    );
}

function createStyles(theme: Theme, colorScheme: ColorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        image: {
            flex: 1,
            resizeMode: 'cover',
            alignItems: 'center',
            paddingTop: 10,
        },
        headerContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: 30,
            paddingVertical: 16

        },
        headerMain: {
            flexDirection: 'row',
            marginBottom: 10,
            justifyContent: 'space-between',
            width: '100%',
        },
        headerLine: {
            flexDirection: 'row',
            height: 1,
            backgroundColor: theme.icon,
            width: '100%',
        },
        locationIcon: {
            marginTop: 6,
            paddingLeft: 8,
        },
        cityText: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.text,
            fontFamily: "Inter_500Medium"
        },
        weatherMain: {
            alignItems: "center",
            marginBottom: 30,
        },
        weatherMainContainer: {
            marginTop: 20
        },
        tempText: {
            fontSize: 90,
            color: theme.text,
            fontWeight: "bold",
            fontFamily: "Inter_500Medium"
        },
        weatherText: {
            fontSize: 24,
            color: theme.text,
            fontFamily: "Inter_500Medium"
        },
        dailyWeatherItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 14,
            marginHorizontal: 20,
        },
        dateContainer: {
            width: '25%',
            alignItems: 'flex-start',
        },
        dateText: {
            fontSize: 18,
            color: '#FFFFFF',
            fontWeight: 'bold',
            marginBottom: 2,
            fontFamily: "Inter_500Medium"
        },
        weekdayText: {
            fontSize: 14,
            color: '#B3E5FC',
            fontFamily: "Inter_500Medium"
        },
        weatherIconContainer: {
            width: '50%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
        },
        weatherIcon: {
            width: 40,
            height: 40,
            borderRadius: 12,
        },
        rainProbability: {
            fontSize: 12,
            width: 30,
            textAlign: 'left',
            color: '#64B5F6',
            marginLeft: 5,
        },
        tempContainer: {
            width: '25%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingRight: 5,
        },
        tempMinContainer: {
            width: 40,
            alignItems: 'center',
        },
        tempMaxContainer: {
            width: 40,
            alignItems: 'center',
            marginLeft: 5,
        },
        tempMin: {
            fontSize: 18,
            color: '#FFFFFF',
            fontFamily: "monospace",
            textAlign: "center"
        },
        tempMax: {
            fontSize: 18,
            color: '#FFFFFF',
            fontFamily: "monospace",
            textAlign: "center"
        },
        weatherMainHead: {
            flexDirection: "row",
            alignItems: "center",
        },
        weatherMainHeadRight: {
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: 100,
            marginLeft: 5,

        },
        weatherMainHeadRightText: {
            fontSize: 12,
            color: grayColor,
            fontFamily: "Inter_500Medium"
        },
        celsiusText: {
            color: theme.text,
            fontSize: 28
        },
        feelsLikeContainer: {
            flexDirection: 'column',
            alignItems: 'center'
        },
        weatherTextContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5
        },
        currentWeatherText: {
            color: theme.text,
            fontSize: 18,
            fontFamily: "Inter_500Medium"
        },
        tempRangeContainer: {
            marginLeft: 20,
            flexDirection: 'row',
        },
        tempRangeText: {
            color: theme.text,
            fontSize: 20
        },
        suggestionContainer: {
            width: '100%',
            paddingHorizontal: 15,
            marginVertical: 30
        },
        suggestionGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        suggestionItemWrapper: {
            width: '48%',
            borderRadius: 18,
            overflow: 'hidden',
            marginBottom: 12,
            backgroundColor: "#ece7e7",
            shadowColor: "#000",
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1,
        },
        flatCard: {
            paddingTop: 10,
            paddingLeft: 65,
            paddingRight: 10,
            paddingBottom: 10,
            height: 70,
            justifyContent: 'center',
            borderRadius: 8,
            borderWidth: 0,
        },
        suggestionIconContainer: {
            width: 36,
            height: 36,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: 10,
            top: 15,
            borderRadius: 8,
        },
        blueIconContainer: {
            backgroundColor: '#1E88E5',
        },
        purpleIconContainer: {
            backgroundColor: '#8E24AA',
        },
        tealIconContainer: {
            backgroundColor: '#00BCD4',
        },
        greenIconContainer: {
            backgroundColor: '#4CAF50',
        },
        orangeIconContainer: {
            backgroundColor: '#FF9800',
        },
        redIconContainer: {
            backgroundColor: '#F44336',
        },
        blueGrayIconContainer: {
            backgroundColor: '#607D8B',
        },
        indigoIconContainer: {
            backgroundColor: '#3F51B5',
        },
        suggestionText: {
            color: '#333333',
            fontSize: 15,
            fontWeight: '500',
            fontFamily: "Inter_500Medium",
            marginBottom: 3
        },
        suggestionDesc: {
            color: '#999999',
            fontSize: 12
        },
        airQualityContainer: {
            paddingHorizontal: 15,
            marginTop: 30
        },
        airQualityCard: {
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 15,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2
        },
        airQualityHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10
        },
        airQualityValue: {
            flexDirection: 'row',
            alignItems: 'flex-end'
        },
        airQualityNumber: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333333',
            marginRight: 5
        },
        airQualityLevel: {
            fontSize: 18,
            marginBottom: 8
        },

        airQualityMore: {
            backgroundColor: '#F5F5F5',
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 20
        },
        airQualityMoreText: {
            fontSize: 12,
            color: '#757575'
        },
        airQualityProgressContainer: {
            marginBottom: 20
        },
        airQualityRange: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5
        },
        airQualityRangeText: {
            fontSize: 12,
            color: '#757575'
        },
        forecastList: {
            marginHorizontal: 15,
            paddingVertical: 0,
            marginBottom: 15,
        },
        moreWeatherContainer: {
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,

        },
        moreWeather: {
            fontSize: 16,
            color: "#5e4b4b",
            fontWeight: "500",
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 20,
            overflow: "hidden",
        },
        // 气象灾害预警样式
        weatherAlarmContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginTop: 15,
            width: '50%',
            maxWidth: 350,
        },
        weatherAlarmIconContainer: {
            borderRadius: 12,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
        },
        weatherAlarmText: {
            color: '#fff',
            fontSize: 14,
            flex: 1,
            marginRight: 8,
            fontWeight: '500',
        },
        // 不同预警等级的容器样式
        redAlarmContainer: {
            backgroundColor: alarmColors.red.background,
        },
        orangeAlarmContainer: {
            backgroundColor: alarmColors.orange.background,
        },
        yellowAlarmContainer: {
            backgroundColor: alarmColors.yellow.background,
        },
        blueAlarmContainer: {
            backgroundColor: alarmColors.blue.background,
        },
        defaultAlarmContainer: {
            backgroundColor: alarmColors.default.background,
        },

        // 不同预警等级的图标容器样式
        redAlarmIconContainer: {
            backgroundColor: alarmColors.red.icon,
        },
        orangeAlarmIconContainer: {
            backgroundColor: alarmColors.orange.icon,
        },
        yellowAlarmIconContainer: {
            backgroundColor: alarmColors.yellow.icon,
        },
        blueAlarmIconContainer: {
            backgroundColor: alarmColors.blue.icon,
        },
        defaultAlarmIconContainer: {
            backgroundColor: alarmColors.default.icon,
        },
    });
}
