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

export default function Index() {
    const {location} = useLocationStore();
    const {colorScheme, theme} = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme);
    const [now, setNow] = useState<WeatherNow | null>(null);
    const [weatherCode, setWeatherCode] = useState<number>(0);
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
                    setWeatherCode(parseInt(data.results[0].now.code));
                }

            } catch (error) {
                handleAxiosError(error);
            }
        }

        fetchData();
    }, []);
    //未来3天逐日天气预报
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getWeatherDaily({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
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
        const parsed = parseInt(airQualityFact?.aqi);
        return isNaN(parsed) ? 0 : parsed;
    }, [airQualityFact]);
    if (!loaded && !error) {
        return null
    }
    const renderItem = ({item}: { item: DailyWeather }) => (
        <View style={styles.dailyWeatherItem}>
            <Text style={styles.dateText}>{item.date.replace(/^[0-9]{4}-/, '').replace(/-/, '/')}</Text>
            <View style={styles.dailyWeatherRow}>
                {/* 晨间天气 */}
                <View style={styles.eachItem}>
                    <Text>晨间天气</Text>
                    <Image
                        source={{uri: getWeatherIconUri(Number(item.code_day), "light")}}
                        style={styles.dailyWeatherImg}
                    />
                    <Text style={styles.weatherText}>{item.text_day}</Text>
                </View>
                {/* 晚间天气 */}
                <View style={styles.eachItem}>
                    <Text>晚间天气</Text>
                    <Image
                        source={{uri: getWeatherIconUri(Number(item.code_night), "dark")}}
                        style={styles.dailyWeatherImg}
                    />
                    <Text style={styles.weatherText}>{item.text_night}</Text>
                </View>

            </View>
            <View style={styles.dailyWeatherRow}>
                {/* 最高温 */}
                <View style={styles.eachItem}>
                    <Text>最高温</Text>
                    <FontAwesome5 name="temperature-high" size={24} color={theme.text}/>
                    <Text style={styles.weatherText}>{item.high}°C</Text>
                </View>
                {/* 最低温度 */}
                <View style={styles.eachItem}>
                    <Text>最低温</Text>
                    <FontAwesome5 name="temperature-low" size={24} color={theme.text}/>
                    <Text style={styles.weatherText}>{item.low}°C</Text>
                </View>
            </View>

        </View>
    );

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

                    {/* 天气详情 */}
                    <View style={styles.detailsContainer}>
                        {/*降水概率数据要×100*/}
                        <View style={styles.detailItem}>
                            <Ionicons name="rainy-outline" size={24} color={theme.text}/>
                            <Text
                                style={styles.detailText}>{parseInt(recentWeather?.[0]?.precip as string) * 100}%</Text>
                        </View>
                        {/*风速*/}
                        <View style={styles.detailItem}>
                            <Fontisto name="wind" size={24} color={theme.text}/>
                            <Text style={styles.detailText}>{recentWeather?.[0]?.wind_speed}m/s</Text>
                        </View>
                        {/*风力等级*/}
                        <View style={styles.detailItem}>
                            <MaterialIcons name="wind-power" size={24} color={theme.text}/>
                            <Text style={styles.detailText}>{recentWeather?.[0]?.wind_scale}级</Text>
                        </View>
                    </View>

                    {/*三日内天气*/}
                    <FlatList horizontal data={recentWeather} renderItem={renderItem}
                              showsHorizontalScrollIndicator={false}
                              keyExtractor={(item) => item.date}></FlatList>
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

                            {/*<View style={styles.airQualityDetails}>*/}
                            {/*    <View style={styles.pollutantRow}>*/}
                            {/*        <View style={styles.airQualityDetailItem}>*/}
                            {/*            <Text style={styles.airQualityDetailTitle}>*/}
                            {/*                PM<Text style={styles.subscript}>2.5</Text>*/}
                            {/*            </Text>*/}
                            {/*            <Text style={styles.airQualityDetailValue}>{airQualityFact?.pm25}</Text>*/}
                            {/*            <View style={styles.pollutantBarContainer}>*/}
                            {/*                <View style={[styles.pollutantBar, styles.pm25Bar]}></View>*/}
                            {/*            </View>*/}
                            {/*        </View>*/}
                            {/*        */}
                            {/*        <View style={styles.airQualityDetailItem}>*/}
                            {/*            <Text style={styles.airQualityDetailTitle}>*/}
                            {/*                PM<Text style={styles.subscript}>10</Text>*/}
                            {/*            </Text>*/}
                            {/*            <Text style={styles.airQualityDetailValue}>{airQualityFact?.pm10}</Text>*/}
                            {/*            <View style={styles.pollutantBarContainer}>*/}
                            {/*                <View style={[styles.pollutantBar, styles.pm10Bar]}></View>*/}
                            {/*            </View>*/}
                            {/*        </View>*/}
                            {/*    */}
                            {/*        <View style={styles.airQualityDetailItem}>*/}
                            {/*            <Text style={styles.airQualityDetailTitle}>CO</Text>*/}
                            {/*            <Text style={styles.airQualityDetailValue}>{airQualityFact?.co}</Text>*/}
                            {/*            <View style={styles.pollutantBarContainer}>*/}
                            {/*                <View style={[styles.pollutantBar, styles.coBar]}></View>*/}
                            {/*            </View>*/}
                            {/*        </View>*/}
                            {/*        */}
                            {/*        <View style={styles.airQualityDetailItem}>*/}
                            {/*            <Text style={styles.airQualityDetailTitle}>*/}
                            {/*                SO<Text style={styles.subscript}>2</Text>*/}
                            {/*            </Text>*/}
                            {/*            <Text style={styles.airQualityDetailValue}>2</Text>*/}
                            {/*            <View style={styles.pollutantBarContainer}>*/}
                            {/*                <View style={[styles.pollutantBar, styles.so2Bar]}></View>*/}
                            {/*            </View>*/}
                            {/*        </View>*/}
                            {/*    </View>*/}
                            {/*</View>*/}
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
        detailsContainer: {
            flexDirection: "row",
            width: '100%',
            justifyContent: 'space-evenly',
            marginBottom: 10,
            gap: 25
        },
        detailsContainerWithBg: {
            flexDirection: "row",
            width: '100%',
            justifyContent: 'space-evenly',
            marginBottom: 10,
            gap: 25,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            paddingVertical: 15,
            borderRadius: 15,
            marginHorizontal: 20
        },
        detailItem: {
            flexDirection: "row",
            alignItems: "center",
        },
        detailIcon: {
            marginRight: 8
        },
        detailText: {
            marginLeft: 15,
            fontSize: 16,
            color: theme.text,
            marginBottom: 6,
            fontFamily: "Inter_500Medium"
        },
        actionButton: {
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            padding: 12,
            borderRadius: 12,
        },
        dailyWeatherItem: {
            flexDirection: "column",
            marginHorizontal: 10,
            marginVertical: 10,
            padding: 10,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
        },
        dateText: {
            fontSize: 16,
            color: theme.text,
            marginBottom: 6,
            fontFamily: "Inter_500Medium"
        },
        dailyWeatherImgContainer: {
            flexDirection: "row",
            gap: 30
        },
        dailyWeatherImg: {
            width: 30,
            height: 30,
            borderRadius: 12,
        },
        eachItem: {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 20,
        },
        dailyWeatherRow: {
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 10,
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
        airQualityProgress: {
            height: 8,
            flexDirection: 'row',
            borderRadius: 4,
            overflow: 'hidden'
        },
        progressSegment: {
            height: '100%',
            flex: 1
        },
        progressGood: {
            backgroundColor: '#7EB815'  // 绿色
        },
        progressModerate: {
            backgroundColor: '#D1D50F'  // 黄色
        },
        progressLightPolluted: {
            backgroundColor: '#E69C19'  // 橙色
        },
        progressModeratelyPolluted: {
            backgroundColor: '#CC1119'  // 红色
        },
        progressSeverelyPolluted: {
            backgroundColor: '#710078'  // 紫色
        },
        progressExtremelyPolluted: {
            backgroundColor: '#4A0D1F'  // 褐红色
        },
        airQualityDetails: {
            marginTop: 15,
            marginHorizontal: 5
        },
        pollutantRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5
        },
        airQualityDetailItem: {
            width: '22%'
        },
        airQualityDetailTitle: {
            fontSize: 14,
            color: '#888888',
            marginBottom: 4,
            textAlign: 'center'
        },
        airQualityDetailValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333333',
            marginBottom: 5,
            textAlign: 'center'
        },
        pollutantBarContainer: {
            height: 4,
            backgroundColor: '#EEEEEE',
            borderRadius: 2,
            overflow: 'hidden',
            marginTop: 2
        },
        pollutantBar: {
            height: '100%',
            borderRadius: 2,
            backgroundColor: '#7EB815'
        },
        pm25Bar: {
            width: '40%'  // 固定宽度来匹配图片
        },
        pm10Bar: {
            width: '60%'  // 固定宽度来匹配图片
        },
        coBar: {
            backgroundColor: '#EEEEEE',
            width: '0%'
        },
        so2Bar: {
            width: '15%'  // 固定宽度来匹配图片
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
        subscript: {
            fontSize: 10,
            lineHeight: 12,
            textAlignVertical: 'bottom',
            includeFontPadding: false,
            marginBottom: 2
        },
    });
}
