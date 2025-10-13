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

const conversationstest: ConversationItem[] = [
    {
        id: 1028470,
        name: "",
        subname: null,
        imageurl: null,
        type: 1,
        membercount: 2,
        ismuted: false,
        isfavourite: false,
        isread: false,
        unreadcount: null,
        members: [
            {
                id: 11,
                fullname: "BÙI HOÀI THẮNG",
                profileurl: "https://lms.hcmut.edu.vn/user/profile.php?id=11",
                profileimageurl:
                    "https://lms.hcmut.edu.vn/theme/image.php/academi/core/1757472925/u/f1",
                profileimageurlsmall:
                    "https://lms.hcmut.edu.vn/theme/image.php/academi/core/1757472925/u/f2",
                isonline: false,
                showonlinestatus: true,
                isblocked: false,
                iscontact: false,
                isdeleted: false,
                canmessageevenifblocked: true,
                canmessage: true,
                requirescontact: false,
                contactrequests: [],
            },
        ],
        messages: [
            {
                id: 10186345,
                useridfrom: 11,
                text: "KIỂM TRA GIỮA KỲ - Thứ 3, ngày 30/9/2025 tại Phòng học H2-301",
                timecreated: 1759045745,
            },
        ],
        candeletemessagesforallusers: false,
    },
    {
        id: 139327,
        name: "",
        subname: null,
        imageurl: null,
        type: 1,
        membercount: 2,
        ismuted: false,
        isfavourite: false,
        isread: true,
        unreadcount: null,
        members: [
            {
                id: 31,
                fullname: "Phòng Đào Tạo",
                profileurl: "https://lms.hcmut.edu.vn/user/profile.php?id=31",
                profileimageurl:
                    "https://lms.hcmut.edu.vn/theme/image.php/academi/core/1757472925/u/f1",
                profileimageurlsmall:
                    "https://lms.hcmut.edu.vn/theme/image.php/academi/core/1757472925/u/f2",
                isonline: false,
                showonlinestatus: true,
                isblocked: false,
                iscontact: false,
                isdeleted: false,
                canmessageevenifblocked: true,
                canmessage: true,
                requirescontact: false,
                contactrequests: [],
            },
        ],
        messages: [
            {
                id: 10195032,
                useridfrom: 31,
                text: "THÔNG BÁO VỀ LỊCH THI TOEIC QUỐC TẾ MIỄN PHÍ DÀNH CHO SINH VIÊN KHÓA 22",
                timecreated: 1759140736,
            },
        ],
        candeletemessagesforallusers: false,
    },
];

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
            ) : (
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
                                            !item.isread && styles.unreadText, // in đậm nếu chưa đọc
                                        ]}>{member.fullname}</Text>
                                        {!item.isread && <View style={styles.unreadDot} />}
                                    </View>
                                    <Text
                                        style={[
                                            styles.preview,
                                            !item.isread && styles.unreadText, // in đậm nếu chưa đọc
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
