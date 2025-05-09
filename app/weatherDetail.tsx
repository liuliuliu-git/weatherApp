import {View, StyleSheet} from "react-native";
import {useContext, useEffect} from "react";
import {ThemeContext} from "@/context/ThemeContext";
import TabViewCpn from "@/components/TabViewCpn";

import {Theme,ColorScheme} from "@/types/theme";



export default function WeatherDetail() {
    const {colorScheme, theme} = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme);
    return <View style={styles.container}>
        <TabViewCpn />
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