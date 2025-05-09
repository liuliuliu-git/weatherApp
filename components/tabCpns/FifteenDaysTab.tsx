import {View, Text, Image, StyleSheet} from "react-native";
export default function FifteenDaysTab() {

    return <View style={styles.container}>
        <Text>未来十五天</Text>
    </View>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop:20
    },

});