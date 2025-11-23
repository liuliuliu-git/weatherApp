import {View, Text, StyleSheet} from "react-native";
import {Colors} from "@/constants/Colors";


export default function Search() {
    const styles = createStyles(Colors.light);
    return <View style={styles.container}>
        <Text>这是设置页</Text>
    </View>

}

function createStyles(theme: typeof Colors.light) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f0f0f0',
        },


    });
}