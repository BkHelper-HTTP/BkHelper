import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { getListDiscussionAPI } from "@/utils/api";
import Toast from "react-native-root-toast";

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
    const { forum_id, forum_name, course_code } = useLocalSearchParams()
    const [discussions, setDiscussions] = useState<DiscussionItem[]>([])

    useEffect(() => {
        const fetchListDiscussion = async () => {
            const res = await getListDiscussionAPI(forum_id as string)
            if (res && res.status === "success") {
                setDiscussions(res.data)
            } else {
                Toast.show("Get discussions failed", {
                    duration: Toast.durations.LONG,
                    textColor: "white",
                    backgroundColor: "red",
                    opacity: 1,
                    position: Toast.positions.BOTTOM
                });
            }
        }
        fetchListDiscussion()
    }, [])

    const formatPostTime = (iso: string) => {
        if (!iso) return "";

        // Parse time + cộng 7 tiếng (VN)
        const date = new Date(iso);
        date.setHours(date.getHours() + 7);

        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return "Vừa mới";
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;

        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        if (
            date.getFullYear() === yesterday.getFullYear() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getDate() === yesterday.getDate()
        ) {
            return `Hôm qua · ${date.getHours().toString().padStart(2, "0")}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
        }

        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()} · ${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };


    const renderPost = ({ item }: { item: DiscussionItem }) => (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: "/forum/forum.details.screen",
                params: { discussion_id: item.discussion_id, forum_name: forum_name, course_code: course_code }
            })}
        >
            <View style={styles.postCard}>
                {/* Header */}
                <View style={styles.postHeader}>
                    <Image
                        source={{
                            uri: item.user.avatar_url || "https://ui-avatars.com/api/?name=User"
                        }}
                        style={styles.avatar}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.username}>{`${item.user.last_name} ${item.user.first_name}`}</Text>
                        <Text style={styles.time}>{formatPostTime(item.created_at)}</Text>
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
                        <Text style={styles.actionText}>20</Text>
                    </View>

                    <View style={styles.actionItem}>
                        <Ionicons name="chatbubble-outline" size={18} color="#444" />
                        <Text style={styles.actionText}>20</Text>
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
                        <Feather name="arrow-left" size={30} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {`${forum_name} - ${course_code}`}
                    </Text>
                    <View style={{ width: "auto" }} />
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
                    data={discussions}
                    keyExtractor={(item) => item.discussion_id}
                    renderItem={renderPost}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
                            Chưa có bài thảo luận nào
                        </Text>
                    }
                />

                {/* FLOATING BUTTON */}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push({
                        pathname: "/forum/forum.add.screen",
                        params: { forum_name: forum_name, course_code: course_code }
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
        width: 300,
        textAlign: "center",
        fontSize: 15,
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
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: "#e0e0e0",
        borderWidth: 1,
        borderColor: "#ddd",

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
