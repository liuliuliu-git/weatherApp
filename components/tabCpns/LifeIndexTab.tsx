import {View, Text, Image, StyleSheet} from "react-native";
export default function LifeIndexTab() {

    return <View style={styles.container}>
        <Text>生活指数</Text>
    </View>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop:20
    },

});