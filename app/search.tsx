import {View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import {searchCity, LocationSearchItem} from "@/apis/location";
import {useLocationStore} from "@/stores/useLocationStore";


export default function Search() {
    const { setLocation } = useLocationStore();
    const [query, setQuery] = useState(""); // 输入框内容
    const [results, setResults] = useState<LocationSearchItem[]>([]); // 搜索结果
    const [loading, setLoading] = useState(false);

    // 监听输入变化，节流调用接口（简化处理，生产可用 useDebounce）
    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }
        const timeout = setTimeout(() => {
            fetchCityResults();
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    const fetchCityResults = async () => {
        try {
            setLoading(true);
            const {data} = await searchCity({
                key: process.env.EXPO_PUBLIC_API_KEY,
                location: query,
            });
            let resFilter = data.results.filter((item) => {
                return item.country === "CN";
            })
            console.log(resFilter)
            setResults(resFilter || []);
        } catch (e) {
            console.error("城市搜索失败：", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item: LocationSearchItem) => {
        setLocation(item);  // 保存到全局
        console.log("你选择了城市：", item);
    };
    const renderItem = (item: LocationSearchItem) => {
        return <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
            <Text style={styles.cityName}>{item.path}</Text>
            <Text style={styles.timezone}>{item.timezone_offset} {item.timezone}</Text>
        </TouchableOpacity>
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="请输入城市名称"
                value={query}
                onChangeText={setQuery}
            />
            {loading && <Text style={styles.loading}>加载中...</Text>}
            <FlatList
                showsVerticalScrollIndicator={false}
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({item})=>renderItem(item)}
                ListEmptyComponent={!loading && query !== "" ? <Text style={styles.empty}>未找到相关城市</Text> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
        marginBottom: 12,
    },
    loading: {
        textAlign: "center",
        marginBottom: 10,
        color: "#888",
    },
    item: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    cityName: {
        fontSize: 16,
    },
    timezone: {
        fontSize: 12,
        color: "#999",
    },
    empty: {
        textAlign: "center",
        marginTop: 20,
        color: "#999",
    },
});
