import {View, Text, Image, StyleSheet} from "react-native";
import {TabViewCpnProps} from "@/components/TabViewCpn";

export default function HourlyTab({data}: TabViewCpnProps) {

    return <View style={styles.container}>
        <Text>逐小时内容</Text>
    </View>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop:20
    },

});