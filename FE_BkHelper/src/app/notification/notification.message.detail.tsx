import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
export default function NotificationMessageDetailScreen() {
  const { messageDetail } = useLocalSearchParams();
  const msg = messageDetail ? JSON.parse(messageDetail as string) : {};
  const router = useRouter();

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.titleText}>Chi tiết tin nhắn</Text>
          <Text style={styles.subtitleText}>Từ giảng viên</Text>
        </View>
      </View>

      {/* NỘI DUNG */}
      <View style={styles.content}>
        <Text style={styles.timeText}>
          {formatFullTime(msg.timecreated)}
        </Text>

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#4361ee",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: { flex: 1 },
  titleText: { fontSize: 18, fontWeight: "700", color: "#fff" },
  subtitleText: { fontSize: 13.5, color: "#c8e1ff", marginTop: 2 },

  content: { flex: 1, padding: 20 },

  timeText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    backgroundColor: "#f0f0f0",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 20,
    fontWeight: "500",
  },

  messageBubble: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },

  footerInfo: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  infoText: {
    fontSize: 13,
    color: "#888",
    marginBottom: 6,
  },
});
