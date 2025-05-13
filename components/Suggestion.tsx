import {View, Text, StyleSheet} from 'react-native';
import {Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome6} from '@expo/vector-icons';
import {SuggestionItem} from "@/apis/life";

export default function Suggestion({lifeIndex}: { lifeIndex: SuggestionItem[] }) {
    return (
        <View style={styles.suggestionContainer}>
            <View style={styles.suggestionGrid}>
                {/* 晾晒 */}
                <View style={styles.suggestionItemWrapper}>
                    <View style={styles.flatCard}>
                        <View style={[styles.suggestionIconContainer]}>
                            <Ionicons name="shirt-outline" size={22} color="#4a90e2"/>
                        </View>
                        <View style={styles.suggestionTextContainer}>
                            <Text style={styles.suggestionText}>晾晒</Text>
                            <Text style={styles.suggestionDesc}>{lifeIndex?.[0]?.airing?.brief}</Text>
                        </View>
                    </View>
                </View>
                {/* 过敏 */}
                <View style={styles.suggestionItemWrapper}>
                    <View style={styles.flatCard}>
                        <View style={[styles.suggestionIconContainer]}>
                            <MaterialIcons name="healing" size={22} color="#4a90e2"/>
                        </View>
                        <View style={styles.suggestionTextContainer}>
                            <Text style={styles.suggestionText}>过敏</Text>
                            <Text style={styles.suggestionDesc}>{lifeIndex?.[0]?.allergy?.brief}</Text>
                        </View>
                    </View>
                </View>
                {/* 旅游 */}
                <View style={styles.suggestionItemWrapper}>
                    <View style={styles.flatCard}>
                        <View style={[styles.suggestionIconContainer]}>
                            <MaterialCommunityIcons name="kite" size={24} color="#4a90e2"/>
                        </View>
                        <View style={styles.suggestionTextContainer}>
                            <Text style={styles.suggestionText}>放风筝</Text>
                            <Text style={styles.suggestionDesc}>{lifeIndex?.[0]?.kiteflying?.brief}</Text>
                        </View>


                    </View>
                </View>
                {/* 运动 */}
                <View style={styles.suggestionItemWrapper}>
                    <View style={styles.flatCard}>
                        <View style={[styles.suggestionIconContainer]}>
                            <Ionicons name="fitness-outline" size={22} color="#4a90e2"/>
                        </View>
                        <View style={styles.suggestionTextContainer}>
                            <Text style={styles.suggestionText}>运动</Text>
                            <Text style={styles.suggestionDesc}>{lifeIndex?.[0]?.sport?.brief}</Text>
                        </View>

                    </View>
                </View>
                {/* 钓鱼 */}
                <View style={styles.suggestionItemWrapper}>
                    <View style={styles.flatCard}>
                        <View style={[styles.suggestionIconContainer]}>
                            <FontAwesome6 name="fish-fins" size={22} color="#4a90e2"/>
                        </View>
                        <View style={styles.suggestionTextContainer}>
                            <Text style={styles.suggestionText}>钓鱼</Text>
                            <Text style={styles.suggestionDesc}>{lifeIndex?.[0]?.fishing?.brief}</Text>
                        </View>
                    </View>
                </View>
                {/* 洗车 */}
                <View style={styles.suggestionItemWrapper}>
                    <View style={styles.flatCard}>
                        <View style={[styles.suggestionIconContainer]}>
                            <Ionicons name="car-outline" size={22} color="#4a90e2"/>
                        </View>
                        <View style={styles.suggestionTextContainer}>
                            <Text style={styles.suggestionText}>洗车</Text>
                            <Text style={styles.suggestionDesc}>{lifeIndex?.[0]?.car_washing?.brief}</Text>
                        </View>
                    </View>
                </View>
                {/* 雨伞 */}
                <View style={styles.suggestionItemWrapper}>
                    <View style={styles.flatCard}>
                        <View style={[styles.suggestionIconContainer]}>
                            <Ionicons name="umbrella-outline" size={22} color="#4a90e2"/>
                        </View>
                        <View style={styles.suggestionTextContainer}>
                            <Text style={styles.suggestionText}>雨伞</Text>
                            <Text style={styles.suggestionDesc}>{lifeIndex?.[0]?.umbrella?.brief}</Text>
                        </View>
                    </View>
                </View>
                {/* 感冒 */}
                <View style={styles.suggestionItemWrapper}>
                    <View style={styles.flatCard}>
                        <View style={[styles.suggestionIconContainer]}>
                            <Ionicons name="medical-outline" size={22} color="#4a90e2"/>
                        </View>
                        <View style={styles.suggestionTextContainer}>
                            <Text style={styles.suggestionText}>感冒</Text>
                            <Text style={styles.suggestionDesc}>{lifeIndex?.[0]?.flu?.brief}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    suggestionContainer: {
        paddingHorizontal: 15,
        marginVertical: 30,
        borderRadius: 12,
    },
    suggestionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    suggestionItemWrapper: {
        width: '47.5%',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
        backgroundColor: "#ece7e7",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    flatCard: {
        paddingVertical: 10,
        paddingRight: 10,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    suggestionIconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    suggestionDesc: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    suggestionTextContainer: {
        justifyContent: "center",
        alignItems: "center",

    }
});

