import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function NotificationMessageDetailScreen() {
    const { messageDetail } = useLocalSearchParams();
    const msg = messageDetail ? JSON.parse(messageDetail as string) : {};

    const [webviewHeight, setWebviewHeight] = useState(100);

    const formatFullTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    };

    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-size: 16px; padding: 8px; color: #222; }
            img { max-width: 100%; height: auto; border-radius: 8px; }
            p { line-height: 1.5; }
          </style>
        </head>
        <body>
          ${msg.text || ""}
          <script>
            setTimeout(() => {
              window.ReactNativeWebView.postMessage(document.body.scrollHeight);
            }, 300);
          </script>
        </body>
      </html>
    `;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Chi tiết Message</Text>
            <Text>ID: {msg.id}</Text>
            <Text>Từ người dùng: {msg.useridfrom}</Text>
            <Text>Thời gian: {formatFullTime(msg.timecreated)}</Text>

            <View style={{ marginTop: 10, flex: 1 }}>
                <WebView
                    originWhitelist={["*"]}
                    source={{ html: htmlContent }}
                    style={{ height: webviewHeight }}
                    onMessage={(event) => {
                        const height = Number(event.nativeEvent.data);
                        if (height > 0) setWebviewHeight(height + 20);
                    }}
                    scrollEnabled={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
});
