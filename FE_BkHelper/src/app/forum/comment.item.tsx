import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";

const CommentItem = ({ comment, onReply, onUpdate, onDelete }: { comment: any, onReply?: (parent_comment_id: string, content: string) => Promise<boolean>, onUpdate?: (comment_id: string, content: string) => Promise<boolean>, onDelete?: (comment_id: string) => Promise<boolean> }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content || "");
    const [isActing, setIsActing] = useState(false);

    const hasReplies = comment.replies && comment.replies.length > 0;

    // Count all nested replies recursively
    const countReplies = (c: any): number => {
        if (!c || !c.replies || c.replies.length === 0) return 0;
        return c.replies.reduce((sum: number, r: any) => sum + 1 + countReplies(r), 0);
    };

    const handleSendReply = async () => {
        if (!onReply || !replyText.trim()) return;
        try {
            setIsReplying(true);
            const ok = await onReply(comment.comment_id, replyText.trim());
            if (ok) {
                setReplyText("");
                setShowReplyInput(false);
                setShowReplies(true);
            } else {
                Alert.alert('Lỗi', 'Không thể gửi phản hồi');
            }
        } finally {
            setIsReplying(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!onUpdate) return;
        try {
            setIsActing(true);
            const ok = await onUpdate(comment.comment_id, editText.trim());
            if (ok) {
                setIsEditing(false);
            } else {
                Alert.alert('Lỗi', 'Không thể cập nhật bình luận');
            }
        } finally {
            setIsActing(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá bình luận này?', [
            { text: 'Huỷ', style: 'cancel' },
            {
                text: 'Xoá', style: 'destructive', onPress: async () => {
                    try {
                        setIsActing(true);
                        const ok = await onDelete(comment.comment_id);
                        if (!ok) Alert.alert('Lỗi', 'Không thể xoá bình luận');
                    } finally {
                        setIsActing(false);
                    }
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            {/* ===== COMMENT CHA ===== */}
            <View style={styles.row}>
                <View style={styles.bubble}>
                    <Text style={styles.username}>
                        {comment.user?.last_name ?? 'Người dùng'} {comment.user?.first_name ?? ''}
                    </Text>

                    {isEditing ? (
                        <TextInput value={editText} onChangeText={setEditText} style={styles.editInput} multiline />
                    ) : (
                        <Text style={styles.content}>{comment.content}</Text>
                    )}
                </View>
            </View>

            {/* ===== ACTION ===== */}
            <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => { /* Like placeholder */ }}>
                    <Text style={styles.action}>Thích</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setShowReplyInput((s) => !s); setShowReplies(true); }}>
                    <Text style={styles.action}>Phản hồi</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsEditing((s) => !s)}>
                    <Text style={styles.action}>Sửa</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDelete}>
                    <Text style={[styles.action, { color: '#e53935' }]}>Xoá</Text>
                </TouchableOpacity>
            </View>

            {/* Edit actions */}
            {isEditing && (
                <View style={{ flexDirection: 'row', marginLeft: 42, marginTop: 8 }}>
                    <TouchableOpacity onPress={() => setIsEditing(false)} disabled={isActing}>
                        <Text style={{ color: '#777', marginRight: 12 }}>Huỷ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSaveEdit} disabled={isActing}>
                        {isActing ? <ActivityIndicator /> : <Text style={{ color: '#007ACC' }}>Lưu</Text>}
                    </TouchableOpacity>
                </View>
            )}

            {/* Reply input */}
            {showReplyInput && (
                <View style={{ flexDirection: 'row', marginLeft: 42, marginTop: 8, alignItems: 'center' }}>
                    <TextInput value={replyText} onChangeText={setReplyText} style={styles.replyInput} placeholder="Viết phản hồi..." multiline />
                    <TouchableOpacity onPress={handleSendReply} disabled={isReplying} style={{ marginLeft: 8 }}>
                        {isReplying ? <ActivityIndicator /> : <Feather name="send" size={18} color="#007ACC" />}
                    </TouchableOpacity>
                </View>
            )}

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
                        <CommentItem comment={reply} onReply={onReply} onUpdate={onUpdate} onDelete={onDelete} />
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

    editInput: { borderWidth: 1, borderColor: '#eee', padding: 8, borderRadius: 6, marginTop: 6, width: '80%' },

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

    replyInput: { borderWidth: 1, borderColor: '#eee', padding: 8, borderRadius: 6, width: '80%' },

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
