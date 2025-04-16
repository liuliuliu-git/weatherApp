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
import {useContext, useEffect, useState} from "react";
import {StatusBar} from "expo-status-bar";
import {FontAwesome5, MaterialIcons, Entypo, Feather, Fontisto, Ionicons} from '@expo/vector-icons';
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

export default function Index() {
    const {location} = useLocationStore();
    const {colorScheme, theme} = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme);
    const [now, setNow] = useState<WeatherNow | null>(null);
    const [weatherCode, setWeatherCode] = useState<number>(0);
    const [recentWeather, setRecentWeather] = useState<DailyWeather[] | null>(null);
    const [sunData, setSunData] = useState<SunItem | null>(null);
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
        }
    });
}
