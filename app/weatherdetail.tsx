import {View, Text, Image, StyleSheet} from "react-native";
import {useContext, useEffect, useState} from "react";
import {getLifeSuggestion, SuggestionItem} from "@/apis/life";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {ColorScheme, Theme} from "@/types";
import {grayColor} from "@/constants/Colors";
import {ThemeContext} from "@/context/ThemeContext";
import {handleAxiosError} from "@/utils/handleAxiosError";
import {useLocationStore} from "@/stores/useLocationStore";

export default function Search() {
    const [suggestionLife, setSuggestionLife] = useState<SuggestionItem | null>(null);
    const {colorScheme, theme} = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme);
    const {location} = useLocationStore();
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
    return <View style={styles.container}>

    </View>

}

function createStyles(theme: Theme, colorScheme: ColorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#ECF1F7"
        },

    });
}