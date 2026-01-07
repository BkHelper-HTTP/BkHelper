import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Directions } from "react-native-gesture-handler";
import SkeletonNotificationList from "@/components/loading/skeleton.notification.list";

interface IProps {
    conversations: ConversationItem[],
    isLoading: boolean,
    setIsLoading: (v: any) => void
}

export default function NotificationListScreen(props: IProps) {
    const { conversations, isLoading, setIsLoading } = props

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return `${date.getDate().toString().padStart(2, "0")}/${(
            date.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}/${date.getFullYear().toString().slice(2)}`;
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <SkeletonNotificationList />
            ) : conversations.length > 0 ? (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        const member = item.members[0];
                        const lastMessage = item.messages[0];

                        return (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() =>
                                    router.navigate({
                                        pathname: "/notification/[id]",
                                        params: {
                                            id: item.id.toString(),
                                            message: JSON.stringify(item.messages),
                                        },
                                    })
                                }
                            >
                                <Image
                                    source={require("@/assets/images/avatar.png")}
                                    style={styles.avatar}
                                />
                                <View style={styles.textContainer}>
                                    <View style={{ flexDirection: "row", gap: 10 }}>
                                        <Text style={[
                                            styles.name,
                                            !item.isread && styles.unreadText,
                                        ]}>{member.fullname}</Text>
                                        {!item.isread && <View style={styles.unreadDot} />}
                                    </View>
                                    <Text
                                        style={[
                                            styles.preview,
                                            !item.isread && styles.unreadText,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {lastMessage?.text.replace(/<[^>]+>/g, "")}
                                    </Text>
                                </View>
                                <View style={styles.rightContainer}>
                                    <Text style={[styles.date, !item.isread && styles.unreadText]}>
                                        {formatDate(lastMessage.timecreated)}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={20} color="#00AEEF" style={{ marginTop: 5, marginRight: 20 }} />
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            ) : (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Không có dữ liệu thông báo</Text>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 20,
        backgroundColor: "#ffffffff",
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
    },
    name: {
        fontWeight: "bold",
        fontSize: 17,
    },
    preview: {
        color: "#666",
        fontSize: 19,
    },
    unreadText: {
        fontWeight: "bold",
        color: "#000",
    },
    rightContainer: {
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 2,
    },
    date: {
        color: "#999",
        fontSize: 17,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#00AEEF",
        marginTop: 4,
        marginRight: 20
    },
});
