import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import { useWindowDimensions } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchNotificationsMessageAPI } from "@/utils/api";
import { useCurrentApp } from "@/context/app.context";
import SkeletonNotificationDetail from "@/components/loading/skeleton.notification.[id]";

export default function NotificationDetailScreen() {
    const { width } = useWindowDimensions();
    const { id, message } = useLocalSearchParams();
    const parsedMessages = message ? JSON.parse(message as string) : [];
    const router = useRouter();
    const { appState } = useCurrentApp();

    const [messageData, setMessageData] = useState<any>(null);
    const [allMessages, setAllMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [webviewHeights, setWebviewHeights] = useState<{ [key: number]: number }>({});

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const day = date.getDate();
        const month = date.getMonth() + 1;

        if (isToday) {
            return `${hours}:${minutes} Hôm nay`;
        }
        return `${hours}:${minutes} ${day}/${month}`;
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true);
            if (
                appState?.lms.sesskey &&
                appState?.lms.cookies.MoodleSession &&
                appState?.lms.cookies.MOODLEID1_ &&
                appState?.lms.userid
            ) {
                const res = await fetchNotificationsMessageAPI(
                    appState.lms.sesskey!,
                    appState.lms.cookies.MoodleSession!,
                    appState.lms.cookies.MOODLEID1_,
                    appState.lms.userid,
                    +id!
                );

                if (res.data) {
                    setMessageData(res.data);
                    const combined = [...(res.data.messages || []), ...parsedMessages].sort(
                        (a, b) => b.timecreated - a.timecreated
                    );
                    setAllMessages(combined);
                } else {
                    Toast.show("Không thể tải tin nhắn", {
                        duration: Toast.durations.LONG,
                        backgroundColor: "#e74c3c",
                        textColor: "#fff",
                        position: Toast.positions.BOTTOM,
                    });
                }
            }
            setIsLoading(false);
        };

        fetchNotifications();
    }, [id]);

    const handleWebViewMessage = (msgId: number, height: number) => {
        if (height > 20 && height < 2000) {
            setWebviewHeights((prev) => ({ ...prev, [msgId]: height + 20 }));
        }
    };

    const injectedJavaScript = `
    (function() {
      window.ReactNativeWebView.postMessage(document.body.scrollHeight);
    })();
    true;
  `;

    const buildHtml = (html: string) => `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 15.5px; 
            line-height: 1.6; 
            color: #1a1a1a; 
            margin: 0; 
            padding: 0;
            word-wrap: break-word;
          }
          img { max-width: 100%; height: auto; border-radius: 6px; }
          a { color: #4361ee; text-decoration: underline; }
          p { margin: 8px 0; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `;

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
                <SkeletonNotificationDetail />
            </SafeAreaView>
        );
    }

    const navigateToMessageDetail = (msg: any) => {
        router.push({
            pathname: '/notification/notification.message.detail',
            params: { messageDetail: JSON.stringify(msg) },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER CỐ ĐỊNH VỚI NÚT BACK */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>

                <Image
                    source={require("@/assets/images/avatar.png")}
                    style={styles.avatar}
                />

                <View style={styles.headerInfo}>
                    <Text style={styles.senderName} numberOfLines={1}>
                        {messageData?.members[0]?.fullname || "Giảng viên"}
                    </Text>
                </View>
            </View>

            {/* DANH SÁCH TIN NHẮN */}
            <ScrollView
                contentContainerStyle={styles.messageList}
                showsVerticalScrollIndicator={false}
            >
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },

    // HEADER ĐẸP VỚI NÚT BACK
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        paddingVertical: 16,
        backgroundColor: "#4361ee",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 20,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 27.5,
        marginRight: 12,
        backgroundColor: "#ffffff"
    },
    headerInfo: {
        flex: 1,
    },
    senderName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
    },
    onlineStatus: {
        fontSize: 13.5,
        color: "#e0e7ff",
        marginTop: 2,
    },

    messageList: {
        padding: 16,
        paddingTop: 20,
    },
    messageWrapper: {
        marginBottom: 20,
        alignItems: "flex-start",
    },
    messageTime: {
        fontSize: 12.5,
        color: "#888",
        marginBottom: 6,
        marginLeft: 12,
    },
    messageBubble: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 16,
        maxWidth: "92%",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        borderTopLeftRadius: 4,
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