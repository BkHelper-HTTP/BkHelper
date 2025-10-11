import React from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

// type MessageListScreenNavigationProp = StackNavigationProp<
//     RootStackParamList,
//     "Messages"
// >;

// type Props = {
//     navigation: MessageListScreenNavigationProp;
// };

type MessageItem = {
    id: string;
    name: string;
    preview: string;
    date: string;
};

const messages: MessageItem[] = [
    {
        id: "1",
        name: "Phòng Đào Tạo",
        preview: "THÔNG BÁO VỀ LỊCH THI TO...",
        date: "29/09/25",
    },
    {
        id: "2",
        name: "BÙI HOÀI THẮNG",
        preview: "KIỂM TRA GIỮA KỲ - Thứ 3...",
        date: "28/09/25",
    },
    {
        id: "3",
        name: "Hoàng Lê Hải Thanh",
        preview: "Chào các bạn lớp Mobile A...",
        date: "22/09/25",
    },
];

export default function MessageListScreen() {
    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                    // onPress={() =>
                    //     navigation.navigate("MessageDetail", {
                    //         id: item.id,
                    //         name: item.name,
                    //     })
                    // }
                    >
                        <View style={styles.avatar} />
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.preview}>{item.preview}</Text>
                        </View>
                        <Text style={styles.date}>{item.date}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ccc",
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontWeight: "bold",
        fontSize: 15,
    },
    preview: {
        color: "#666",
        fontSize: 13,
    },
    date: {
        color: "#999",
        fontSize: 12,
    },
});
