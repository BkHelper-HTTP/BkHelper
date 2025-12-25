import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";

const mockPosts = [
    {
        id: "1",
        user: "User name 1",
        time: "03:00, 28/11/2025",
        title: "Về ForEach statement",
        content:
            "Dạ thưa thầy, theo như trong yêu cầu của đề bài, kích thước (dimension) của một Array literal được định nghĩa là một số nguyên hoặc một mảng số...",
        likes: 28,
        comments: 15,
    },
    {
        id: "2",
        user: "User name",
        time: "03:00, 28/11/2025",
        title: "Bài tập lớn 1",
        content: "Nội dung bài tập lớn 1",
        likes: 28,
        comments: 15,
    },
];

const ForumViewScreen = () => {
    const navigation = useNavigation();
    const { title } = useLocalSearchParams();
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const renderPost = ({ item }: any) => (
        <TouchableOpacity
            // style={styles.card}
            onPress={() => router.push({
                pathname: "/forum/forum.details.screen",
                params: { id: item.id, title: item.title }

            })}
        >
            <View style={styles.postCard}>
                {/* Header */}
                <View style={styles.postHeader}>
                    <View style={styles.avatar} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.username}>{item.user}</Text>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                </View>

                {/* Content */}
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postContent} numberOfLines={3}>
                    {item.content}
                </Text>

                {/* Actions */}
                <View style={styles.actionRow}>
                    <View style={styles.actionItem}>
                        <AntDesign name="like2" size={18} color="#444" />
                        <Text style={styles.actionText}>{item.likes}</Text>
                    </View>

                    <View style={styles.actionItem}>
                        <Ionicons name="chatbubble-outline" size={18} color="#444" />
                        <Text style={styles.actionText}>{item.comments}</Text>
                    </View>

                    <Ionicons name="bookmark-outline" size={18} color="#444" />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={22} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {title || "Khai phá dữ liệu - CO3029"}
                    </Text>
                    <View style={{ width: 22 }} />
                </View>

                {/* FILTER */}
                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[
                            styles.filterBtn,
                            activeTab === "all" && styles.filterActive,
                        ]}
                        onPress={() => setActiveTab("all")}
                    >
                        <Text>Tất cả</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterBtn,
                            activeTab === "saved" && styles.filterActive,
                        ]}
                        onPress={() => setActiveTab("saved")}
                    >
                        <Text>Đã lưu</Text>
                    </TouchableOpacity>

                    <View style={styles.searchBox}>
                        <Feather name="search" size={16} color="#666" />
                        <TextInput
                            placeholder="Tìm kiếm"
                            value={search}
                            onChangeText={setSearch}
                            style={{ marginLeft: 6, flex: 1 }}
                        />
                    </View>
                </View>

                {/* LIST */}
                <FlatList
                    data={mockPosts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPost}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />

                {/* FLOATING BUTTON */}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push({
                        pathname: "/forum/forum.add.screen",
                    })}
                >
                    <Feather name="edit-2" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ForumViewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 12,
    },
    postCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    filterRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        gap: 8,
    },
    filterBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: "#eee",
    },
    filterActive: {
        backgroundColor: "#ddd",
    },
    searchBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eee",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "red",
        marginRight: 10,
    },
    username: {
        fontWeight: "600",
    },
    time: {
        fontSize: 12,
        color: "#777",
    },
    postTitle: {
        fontWeight: "600",
        marginTop: 6,
    },
    postContent: {
        color: "#333",
        marginTop: 4,
    },
    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
    },
    actionItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    actionText: {
        fontSize: 13,
        color: "#444",
    },
    fab: {
        position: "absolute",
        bottom: 24,
        right: 24,
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#2979ff",
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },
});
