// import SkeletonNotificationDetail from "@/components/loading/skeleton.notification.[id]";
import SkeletonNotificationDetail from "@/components/loading/skeleton.notification.[id]";
import { useCurrentApp } from "@/context/app.context";
import { fetchNotificationsMessageAPI } from "@/utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useWindowDimensions } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const messageData1 = {
    id: 1028470,
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
            canmessageevenifblocked: null,
            canmessage: null,
            requirescontact: null,
            contactrequests: [],
        },
    ],
    messages: [
        {
            id: 10156159,
            useridfrom: 11,
            text: "<p>Proj#1 has been released!<br>\nEnjoy <img class=\"icon emoticon\" alt=\"cười\" title=\"cười\" src=\"https://lms.hcmut.edu.vn/theme/image.php/academi/core/1757472925/s/smiley\"></p>",
            timecreated: 1758181538,
        },
        {
            id: 9912176,
            useridfrom: 11,
            text: "<p>Hi all,<br>\nĐể kịp tiến độ học tập, ta sẽ có buổi học bù như sau:<br>\n- Time and date: 16:00 - 17:50, Wed, 03-Sep-2025<br>\n- Venue: H2-301 (BK.B2-301)<br>\n- Content: Chapter 2 - Software Technical Review<br>\n<br>\nCác bạn nhớ tham dự nhé.</p>",
            timecreated: 1756612584,
        },
    ],
};

export default function NotificationDetailScreen() {
    const { width } = useWindowDimensions();
    const { id, message } = useLocalSearchParams();
    const parsedMessages = message ? JSON.parse(message as string) : [];
    const router = useRouter();
    const { appState } = useCurrentApp()

    const [messageData, setMessageData] = useState<IMessageData>()
    const [allMessages, setAllMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [webviewHeights, setWebviewHeights] = useState<{ [key: number]: number }>({});

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return `${date.getHours()}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true)
            if (appState?.sesskey && appState?.cookies.MoodleSession && appState?.cookies.MOODLEID1_ && appState?.userid) {
                const res = await fetchNotificationsMessageAPI(appState?.sesskey!, appState?.cookies.MoodleSession!, appState?.cookies.MOODLEID1_, appState?.userid, +id)
                if (res.data) {
                    setMessageData(res.data)
                    const combinedMessages = [
                        ...(res.data.messages || []),
                        ...parsedMessages
                    ];
                    setAllMessages(combinedMessages);
                } else {
                    Toast.show("Can't get messages", {
                        duration: Toast.durations.LONG,
                        textColor: "white",
                        backgroundColor: "red",
                        opacity: 1,
                        position: Toast.positions.BOTTOM
                    });
                }
            } else {
                Toast.show("Get messages failure", {
                    duration: Toast.durations.LONG,
                    textColor: "white",
                    backgroundColor: "red",
                    opacity: 1,
                    position: Toast.positions.BOTTOM
                });
            }
            setIsLoading(false)
        }
        fetchNotifications()
    }, [])

    const handleWebViewMessage = (id: number, height: number) => {
        if (!isNaN(height) && height > 0) {
            setWebviewHeights((prev) => ({
                ...prev,
                [id]: height,
            }));
        }
    };

    const buildHtml = (html: string) => `
    <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                font-size: 15px;
                line-height: 1.6;
                background-color: #fff;
                padding: 0;
                margin: 0;
                width: ${width - 52}px;
                word-wrap: break-word;
                -webkit-text-size-adjust: 100%;
            }
            img {
                max-width: 20px;
                height: auto;
                vertical-align: middle;
            }
            p { margin: 0 0 10px 0; }
            .failed-image { display: inline-block; font-size: 20px; }
            </style>
        </head>
        <body>
            ${html}
        </body>
        </html>
    `;

    const navigateToMessageDetail = (msg: any) => {
        router.push({
            pathname: '/notification/notification.message.detail',
            params: { messageDetail: JSON.stringify(msg) },
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f4f8" }}>
            {isLoading ? (
                <SkeletonNotificationDetail />
            ) : (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.header}>
                        <Image
                            source={require("@/assets/images/avatar.png")}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.senderName}>{messageData?.members[0].fullname}</Text>
                            <Text style={styles.subText}>Conversation ID: {id}</Text>
                        </View>
                    </View>

                    {allMessages.map((msg) => (
                        <TouchableOpacity
                            key={msg.id}
                            onPress={() => navigateToMessageDetail(msg)}
                            style={styles.messageContainer}
                        >
                            <Text style={styles.timeText}>{formatTime(msg.timecreated)}</Text>
                            <View style={styles.bubble}>
                                <WebView
                                    key={msg.id}
                                    originWhitelist={["*"]}
                                    source={{ html: buildHtml(msg.text) }}
                                    style={{
                                        height: webviewHeights[msg.id] || 150,
                                        backgroundColor: "transparent",
                                    }}
                                    scrollEnabled={false}
                                    automaticallyAdjustContentInsets={false}
                                    onMessage={(event) => {
                                        const height = Number(event.nativeEvent.data);
                                        handleWebViewMessage(msg.id, height);
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        marginRight: 12,
    },
    senderName: {
        fontSize: 17,
        fontWeight: "600",
        color: "#222",
    },
    subText: {
        fontSize: 13,
        color: "#888",
    },
    messageContainer: {
        marginBottom: 20,
    },
    timeText: {
        fontSize: 12,
        color: "#888",
        marginLeft: 10,
        marginBottom: 6,
    },
    bubble: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
});