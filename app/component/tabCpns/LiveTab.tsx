import {View, Text, Image, StyleSheet} from "react-native";
import {TabViewCpnProps} from "@/app/component/TabViewCpn";

export default function LiveTab( {data}: TabViewCpnProps) {

    return <View style={styles.container}>
        <Text>实况</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20
    },

});