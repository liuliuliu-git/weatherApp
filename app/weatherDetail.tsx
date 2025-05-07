import {View, StyleSheet} from "react-native";
import {useContext} from "react";
import {ColorScheme, Theme} from "@/types";
import {ThemeContext} from "@/context/ThemeContext";
import {useLocationStore} from "@/stores/useLocationStore";
import TabViewCpn from "@/components/TabViewCpn";


export default function WeatherDetail() {

    const {colorScheme, theme} = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme);
    const {location} = useLocationStore();
    const keyData = {
        key: process.env.EXPO_PUBLIC_API_KEY || "",
        location: location?.id as string,
    };
    return <View style={styles.container}>
        <TabViewCpn data={keyData}></TabViewCpn>
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