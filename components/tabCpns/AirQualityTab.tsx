import {View, Text, Image, StyleSheet} from "react-native";
export default function AirQualityTab() {

    return <View style={styles.container}>
        <Text>空气质量</Text>
    </View>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop:20
    },

});