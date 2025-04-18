import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Button,
    Alert,
    FlatList,
    ScrollView,
    Dimensions
} from "react-native";

import {ThemeContext} from "@/context/ThemeContext";
import {useContext, useEffect, useMemo, useState} from "react";
import {StatusBar} from "expo-status-bar";
import {
    FontAwesome5,
    MaterialIcons,
    Entypo,
    Feather,
    Fontisto,
    Ionicons,
    MaterialCommunityIcons
} from '@expo/vector-icons';
import {getWeatherNow, WeatherNow} from "@/apis/weather/weatherFact";
import {useRouter} from "expo-router";
import {getWeatherIconUri} from "@/utils/getWeatherIconUri";
import {DailyWeather, getWeatherDaily} from "@/apis/weather/weatherDailyForecast";
import {Inter_500Medium, useFonts} from "@expo-google-fonts/inter";
import {ColorScheme, Theme} from "@/types";
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocationStore} from "@/stores/useLocationStore";
import {handleAxiosError} from "@/utils/handleAxiosError";
import SunPath from "@/app/component/SunPath";
import {getSunData, SunItem} from "@/apis/geo/sun";
import {grayColor} from "@/constants/Colors";
import {getLifeSuggestion, SuggestionItem} from "@/apis/life";
import {AirStation, getAirQuality} from "@/apis/air/airQualityFact";
import AQIProgressBar from "./component/AQIProgressBar";
import {getWeekday} from "@/utils/getWeekday";

export default function Index() {
    const {location} = useLocationStore();
    const {colorScheme, theme} = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme);
    const [now, setNow] = useState<WeatherNow | null>(null);
    const [recentWeather, setRecentWeather] = useState<DailyWeather[] | null>(null);
    const [sunData, setSunData] = useState<SunItem | null>(null);
    const [suggestionLife, setSuggestionLife] = useState<SuggestionItem | null>(null);
    const [airQualityFact, setAirQualityFact] = useState<AirStation | null>(null);
    const router = useRouter();
    // const params = {
    //     key: process.env.EXPO_PUBLIC_API_KEY,
    //     location: "泉州"
    // }
    const [loaded, error] = useFonts({
        Inter_500Medium,
    })
    //地点天气
    useEffect(() => {
        async function fetchData() {
            try {
                // console.log(location)
                const {data} = await getWeatherNow({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                });
                if (data.results && data.results.length > 0) {
                    setNow(data.results[0].now); // 更新状态为当前天气数据
                }

            } catch (error) {
                handleAxiosError(error);
            }
        }

        fetchData();
    }, []);
    //逐日天气预报以及昨日天气
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getWeatherDaily({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                    days: 7,
                    start: -1
                });
                setRecentWeather(data.results[0].daily);
            } catch (error) {
                handleAxiosError(error);
            }
        }

        fetchData();
    }, []);
    // 日出日落
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getSunData({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                });
                setSunData(data.results[0].sun[0]);
            } catch (error) {
                handleAxiosError(error);
            }
        }

        fetchData();
    }, []);
    //当日生活指数
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getLifeSuggestion({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                });
                setSuggestionLife(data.results[0].suggestion[0]);
            } catch (error) {
                handleAxiosError(error);
            }
        }

        fetchData();
    }, []);
    //获取空气质量实况
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getAirQuality({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                });
                setAirQualityFact(data.results[0].air.city);
            } catch (error) {
                handleAxiosError(error);
            }
        }

        fetchData();
    }, [])
    const aqi = useMemo(() => {
        const parsed = parseInt(airQualityFact?.aqi as string);
        return isNaN(parsed) ? 0 : parsed;
    }, [airQualityFact]);
    if (!loaded && !error) {
        return null
    }
    const renderItem = ({item}: { item: DailyWeather }) => {
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* 当前天气 */}
                    <Button title={"press on me "} onPress={() => router.push("/weatherdetail")}/>
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
                                <Text style={styles.tempRangeText}>{recentWeather?.[0]?.low}</Text>
                                <Text style={styles.tempRangeText}> ~ </Text>
                                <Text style={styles.tempRangeText}>{recentWeather?.[0]?.high}°C</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <FlatList
                            horizontal={false}
                            data={recentWeather}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}
                            keyExtractor={(item) => item.date}
                            style={styles.forecastList}
                        />
                    </View>
                    <View>
                        <View style={styles.lifeItem}></View>
                    </View>
                    {/*日出日落*/}
                    <SunPath sunrise={sunData?.sunrise as string} sunset={sunData?.sunset as string}/>
                    {/*空气质量实况*/}
                    <View style={styles.airQualityContainer}>
                        <View style={styles.airQualityCard}>
                            <View style={styles.airQualityHeader}>
                                <View style={styles.airQualityValue}>
                                    <Text style={styles.airQualityNumber}>空气质量指数 {airQualityFact?.quality}</Text>
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

                    {/*生活建议*/}
                    <View style={styles.suggestionContainer}>
                        <View style={styles.suggestionGrid}>
                            {/* 晾晒 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.blueIconContainer]}>
                                        <Ionicons name="shirt-outline" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>晾晒</Text>
                                    <Text style={styles.suggestionDesc}>{suggestionLife?.airing?.brief}</Text>
                                </View>
                            </View>

                            {/* 过敏 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.purpleIconContainer]}>
                                        <MaterialIcons name="healing" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>过敏</Text>
                                    <Text style={styles.suggestionDesc}>{suggestionLife?.allergy?.brief}</Text>
                                </View>
                            </View>

                            {/* 旅游 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.tealIconContainer]}>
                                        <MaterialCommunityIcons name="kite" size={24} color="#ffffff"/>
                                    </View>
                                    <Text style={styles.suggestionText}>放风筝</Text>
                                    <Text style={styles.suggestionDesc}>{suggestionLife?.kiteflying?.brief}</Text>
                                </View>
                            </View>

                            {/* 运动 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.greenIconContainer]}>
                                        <Ionicons name="fitness-outline" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>运动</Text>
                                    <Text style={styles.suggestionDesc}>{suggestionLife?.sport?.brief}</Text>
                                </View>
                            </View>

                            {/* 钓鱼 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.orangeIconContainer]}>
                                        <MaterialIcons name="beach-access" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>钓鱼</Text>
                                    <Text style={styles.suggestionDesc}>{suggestionLife?.fishing?.brief}</Text>
                                </View>
                            </View>

                            {/* 洗车 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.blueGrayIconContainer]}>
                                        <Ionicons name="car-outline" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>洗车</Text>
                                    <Text style={styles.suggestionDesc}>{suggestionLife?.car_washing?.brief}</Text>
                                </View>
                            </View>
                            {/* 雨伞 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.indigoIconContainer]}>
                                        <Ionicons name="umbrella-outline" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>雨伞</Text>
                                    <Text style={styles.suggestionDesc}>{suggestionLife?.umbrella?.brief}</Text>
                                </View>
                            </View>

                            {/* 感冒 */}
                            <View style={styles.suggestionItemWrapper}>
                                <View style={styles.flatCard}>
                                    <View style={[styles.suggestionIconContainer, styles.redIconContainer]}>
                                        <Ionicons name="medical-outline" size={22} color="#FFFFFF"/>
                                    </View>
                                    <Text style={styles.suggestionText}>感冒</Text>

                                    <Text style={styles.suggestionDesc}>{suggestionLife?.flu?.brief}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
                </ScrollView>

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
            paddingHorizontal: 5,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.2)',
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
        lifeItem: {
            flexDirection: "column",
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
    });
}
