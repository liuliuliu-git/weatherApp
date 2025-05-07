import {View, Text, Image, StyleSheet} from "react-native";
import {useContext, useEffect, useState} from "react";
import {getLifeSuggestion, SuggestionItem} from "@/apis/life";
import {ColorScheme, Theme} from "@/types";
import {ThemeContext} from "@/context/ThemeContext";
import {handleAxiosError} from "@/utils";
import {useLocationStore} from "@/stores/useLocationStore";
import TabViewCpn from "@/app/component/TabViewCpn";


export default function WeatherDetail() {

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

            } catch (error) {
                handleAxiosError(error);
            }
        }

        fetchData();
    }, []);
    return <View style={styles.container}>
        <TabViewCpn></TabViewCpn>

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