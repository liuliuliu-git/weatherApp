import {View, Text, StyleSheet} from "react-native";
import {useContext} from "react";
import {ThemeContext} from "@/context/ThemeContext";
import {ColorScheme, Theme} from "@/types";
import StrokeAnimation from "@/components/StrokeAnimation";

export default function Search() {
    const {colorScheme, theme} = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme);
    return <View style={styles.container}>
        {/*<StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>*/}
        <Text>这是设置页</Text>
        <StrokeAnimation></StrokeAnimation>
    </View>

}

function createStyles(theme: Theme, colorScheme: ColorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f0f0f0',
        },


    });
}