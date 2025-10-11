import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
type MessageContent = {
    sender: string;
    time: string;
    content: string;
};

const source = {
    html: "<p>KIỂM TRA GIỮA KỲ - Thứ 3, ngày 30/9/2025 tại Phòng học H2-301.<br>\n<br>\nGồm 02 ca kiểm tra:<br>\n- Ca 1: 12:00 - 12:45: Gồm các SV có số cuối của MSSV từ 0 đến 4<br>\n- Ca 2: 13:00 - 13:45: Gồm các SV có số cuối của MSSV từ 5 đến 9<br>\n<br>\nCấu trúc đề kiểm tra<br>\n- Câu 1 (6.0 điểm) - 25'<br>\nTrắc nghiệm: 30 câu hỏi của Chương 1-3. Các câu hỏi bẳng tiếng Anh, tương tự các câu hỏi dùng trong các bài Quiz đã làm..<br>\nLàm bài ngay trên hệ thống LMS.<br>\n<br>\n- Câu 2 (4.0 điểm) - 20'<br>\nBài làm về McCab Basic path, MCC/MCDC, du-/dc-path<br>\nLàm bài trên giấy và nộp ngay sau ca kiểm tra.<br>\n<br>\nCác SV vắng kiểm tra, phải đăng ký với GV và sẽ được bố trí kiểm tra bù.<br>\n<br>\nCheers,</p>"
};

const messagesById: MessageContent[] =
    [
        {
            sender: "BÙI HOÀI THẮNG",
            time: "14:45, 18/09",
            content: "Proj#1 has been released!\nEnjoy 😊",
        },
        {
            sender: "BÙI HOÀI THẮNG",
            time: "14:49, 28/09",
            content:
                "KIỂM TRA GIỮA KỲ - Thứ 3, ngày 30/9/2025 tại Phòng học H2-301.\n\nGồm 02 ca kiểm tra:\n- Ca 1: 12:00 – 12:45 (MSSV 0–4)\n- Ca 2: 13:00 – 13:45 (MSSV 5–9)\n\nCấu trúc đề kiểm tra...",
        },
    ]


export default function MessageDetailScreen() {
    const { width } = useWindowDimensions();
    return (
        <ScrollView style={styles.container}>
            {messagesById.map((msg, index) => (
                <View key={index} style={styles.messageBlock}>
                    <Text style={styles.sender}>{msg.sender}</Text>
                    <Text style={styles.time}>{msg.time}</Text>
                    <View style={styles.bubble}>
                        <RenderHtml
                            contentWidth={width}
                            source={source}
                        />
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 12,
    },
    messageBlock: {
        marginBottom: 20,
    },
    sender: {
        fontWeight: "bold",
        fontSize: 15,
        marginBottom: 4,
    },
    time: {
        color: "#888",
        fontSize: 12,
        marginBottom: 8,
    },
    bubble: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
    },
});
