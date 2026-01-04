import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

const CommentItem = ({ comment }: { comment: any }) => {
    const [showReplies, setShowReplies] = useState(false);

    const hasReplies = comment.replies && comment.replies.length > 0;

    // Count all nested replies recursively
    const countReplies = (c: any): number => {
        if (!c || !c.replies || c.replies.length === 0) return 0;
        return c.replies.reduce((sum: number, r: any) => sum + 1 + countReplies(r), 0);
    };

    return (
        <View style={styles.container}>
            {/* ===== COMMENT CHA ===== */}
            <View style={styles.row}>
                {/* <Image
                    source={{
                        uri:
                            comment.user.avatar_url ||
                            "https://ui-avatars.com/api/?name=User",
                    }}
                    style={styles.avatar}
                /> */}

                <View style={styles.bubble}>
                    <Text style={styles.username}>
                        {/* {comment.user.last_name} {comment.user.first_name} */}
                        THINH
                    </Text>
                    <Text style={styles.content}>{comment.content}</Text>
                </View>
            </View>

            {/* ===== ACTION ===== */}
            <View style={styles.actionRow}>
                <Text style={styles.action}>Thích</Text>
                <Text style={styles.action}>Phản hồi</Text>
            </View>

            {/* ===== XEM REPLY ===== */}
            {hasReplies && !showReplies && (
                <TouchableOpacity
                    onPress={() => setShowReplies(true)}
                    style={styles.viewReplyBtn}
                >
                    <Feather name="corner-down-right" size={14} color="#666" />
                    <Text style={styles.viewReplyText}>
                        Xem {countReplies(comment)} câu trả lời
                    </Text>
                </TouchableOpacity>
            )}

            {/* ===== REPLIES ===== */}
            {showReplies &&
                comment.replies.map((reply: any) => (
                    <View key={reply.comment_id} style={styles.replyContainer}>
                        <CommentItem comment={reply} />
                    </View>
                ))}
        </View>
    );
};

export default CommentItem;

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },

    row: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    avatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        marginRight: 8,
    },

    replyAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
    },

    bubble: {
        backgroundColor: "#f0f2f5",
        padding: 8,
        borderRadius: 10,
        maxWidth: "85%",
    },

    username: {
        fontWeight: "600",
        fontSize: 13,
    },

    content: {
        fontSize: 14,
        marginTop: 2,
    },

    actionRow: {
        flexDirection: "row",
        marginLeft: 42,
        marginTop: 4,
    },

    action: {
        fontSize: 12,
        marginRight: 12,
        color: "#666",
    },

    viewReplyBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 42,
        marginTop: 6,
    },

    viewReplyText: {
        fontSize: 13,
        color: "#555",
        marginLeft: 4,
    },

    replyContainer: {
        flexDirection: "row",
        marginLeft: 42,
        marginTop: 8,
    },
});
