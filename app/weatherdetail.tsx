import {View, Text, Image} from "react-native";
import {useEffect, useState} from "react";
import {getLifeSuggestion} from "@/apis/life";

export default function Search() {
    const [data, setData] = useState([]);
    // 生活指数
    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getLifeSuggestion({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: '泉州',
                });
                console.log("res.data.results =", data.results[0]);
                // setTodayWeather(data.results[0].daily[0]);
                // setRecentWeather(data.results[0].daily);

            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }
        fetchData();
    }, []);
    return <View>
        <Text>这是详情页</Text>
    </View>

}
