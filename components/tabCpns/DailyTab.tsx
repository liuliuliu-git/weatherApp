import {View, Text, Image, StyleSheet} from "react-native";
export default function DailyTab() {

    return <View style={styles.container}>
        <Text>单日</Text>
    </View>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop:20
    },

});