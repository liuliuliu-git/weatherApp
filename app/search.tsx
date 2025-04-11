import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

const hotCities = ["北京", "上海", "广州", "深圳", "杭州", "成都", "泉州", "武汉", "南京"];

export default function Search() {
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState<string[]>(hotCities);

    const router = useRouter();

    useEffect(() => {
        if (search.trim() === '') {
            setFiltered(hotCities);
        } else {
            setFiltered(
                hotCities.filter(city =>
                    city.toLowerCase().includes(search.trim().toLowerCase())
                )
            );
        }
    }, [search]);

    const handleSelect = (city: string) => {
        // 可以用全局状态存选中城市，如 Zustand/Context
        console.log("你选中了城市：", city);
        // 示例跳转到首页并带参数（或保存到全局）
        router.push(`/home?location=${encodeURIComponent(city)}`);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="请输入城市名"
                value={search}
                onChangeText={setSearch}
                style={styles.input}
            />

            <FlatList
                data={filtered}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelect(item)} style={styles.cityItem}>
                        <Text style={styles.cityText}>{item}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.empty}>未找到相关城市</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flex: 1
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16
    },
    cityItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    cityText: {
        fontSize: 16
    },
    empty: {
        textAlign: 'center',
        marginTop: 40,
        color: '#999'
    }
});
