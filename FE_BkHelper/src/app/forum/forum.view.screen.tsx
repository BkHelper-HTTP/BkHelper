import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image, Modal, ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { getListDiscussionAPI, UpdateDiscussionAPI, DeleteDiscussionAPI } from "@/utils/api";
import Toast from "react-native-root-toast";

const ForumViewScreen = () => {
    const navigation = useNavigation();
    const { title } = useLocalSearchParams();
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const { forum_id, forum_name, course_code } = useLocalSearchParams()
    const [discussions, setDiscussions] = useState<DiscussionItem[]>([])
    const [editingDiscussion, setEditingDiscussion] = useState<DiscussionItem | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // New UI states for consistent actions
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [actionTarget, setActionTarget] = useState<DiscussionItem | null>(null);
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            const fetchListDiscussion = async () => {
                const res = await getListDiscussionAPI(forum_id as string);
                if (!isActive) return;
                if (res && res.status === "success") {
                    setDiscussions(res.data);
                } else {
                    Toast.show("Get discussions failed", {
                        duration: Toast.durations.LONG,
                        textColor: "white",
                        backgroundColor: "red",
                        opacity: 1,
                        position: Toast.positions.BOTTOM
                    });
                }
            };
            fetchListDiscussion();
            return () => { isActive = false; };
        }, [forum_id])
    );

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


    const handleAction = (item: DiscussionItem) => {
        // open our custom bottom modal
        setActionTarget(item);
        setActionModalVisible(true);
    };

    const onPressEditFromAction = (item: DiscussionItem) => {
        setActionModalVisible(false);
        openEditModal(item);
    };

    const onPressDeleteFromAction = (item: DiscussionItem) => {
        setActionModalVisible(false);
        setActionTarget(item);
        setDeleteConfirmVisible(true);
    };

    const confirmDelete = (item: DiscussionItem) => {
        setActionTarget(item);
        setDeleteConfirmVisible(true);
    };

    const deleteDiscussion = async (discussion_id: string) => {
        try {
            setIsProcessing(true);
            const res = await DeleteDiscussionAPI(discussion_id);
            if (res && (res as any).status === 'success') {
                setDiscussions((prev) => prev.filter((d) => d.discussion_id !== discussion_id));
                Toast.show('Xoá thành công', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'green', opacity: 1, position: Toast.positions.BOTTOM });
            } else {
                const msg = (res as any)?.message ?? 'Không thể xoá bài thảo luận';
                Toast.show(msg, { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
            }
        } catch (err: any) {
            if (err?.response?.status === 403) {
                Toast.show('Bạn không có quyền thực hiện thao tác này', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
            } else {
                Toast.show('Lỗi khi xoá bài', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const openEditModal = (item: DiscussionItem) => {
        setEditingDiscussion(item);
        setEditTitle(item.title);
        setEditContent(item.content);
        setEditModalVisible(true);
    };

    const saveEdit = async () => {
        if (!editingDiscussion) return;
        try {
            setIsProcessing(true);
            const forumId = editingDiscussion.forum_id;
            const res = await UpdateDiscussionAPI(editingDiscussion.discussion_id, forumId, editTitle, editContent);
            if (res && res.status === 'success') {
                setDiscussions((prev) => prev.map((d) => d.discussion_id === editingDiscussion.discussion_id ? { ...d, title: editTitle, content: editContent } : d));
                setDiscussionDetailIfOpen(editingDiscussion.discussion_id, editTitle, editContent);
                setEditModalVisible(false);
                Toast.show('Cập nhật thành công', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'green', opacity: 1, position: Toast.positions.BOTTOM });
            } else {
                const msg = (res as any)?.message ?? 'Không thể cập nhật bài thảo luận';
                Toast.show(msg, { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
            }
        } catch (err: any) {
            if (err?.response?.status === 403) {
                Toast.show('Bạn không có quyền thực hiện thao tác này', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
            } else {
                console.log("check", err)
                Toast.show('Lỗi khi cập nhật', { duration: Toast.durations.LONG, textColor: 'white', backgroundColor: 'red', opacity: 1, position: Toast.positions.BOTTOM });
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const setDiscussionDetailIfOpen = (discussion_id: string, title: string, content: string) => {
        // If user is currently viewing detail of this discussion, update local detail cache if exists
        // (forum view screen doesn't have detail state, but we keep this hook for future syncs)
    };

    const renderPost = ({ item }: { item: DiscussionItem }) => (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: "/forum/forum.details.screen",
                params: { discussion_id: item.discussion_id, forum_name: forum_name, course_code: course_code }
            })}
        >
            <View style={styles.postCard}>
                <TouchableOpacity style={styles.moreBtn} onPress={() => handleAction(item)}>
                    <Feather name="more-horizontal" size={18} color="#666" />
                </TouchableOpacity>
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
                        params: { forum_id: forum_id, forum_name: forum_name, course_code: course_code }
                    })}
                >
                    <Feather name="edit-2" size={22} color="#fff" />
                </TouchableOpacity>

                {/* ACTION MODAL (bottom sheet style) */}
                <Modal visible={actionModalVisible} transparent animationType="slide" onRequestClose={() => setActionModalVisible(false)}>
                    <TouchableWithoutFeedback onPress={() => setActionModalVisible(false)}>
                        <View style={styles.actionBackdrop} />
                    </TouchableWithoutFeedback>
                    <View style={styles.actionSheet}>
                        <TouchableOpacity style={styles.actionOptionRow} onPress={() => actionTarget && onPressEditFromAction(actionTarget)}>
                            <Feather name="edit-2" size={18} color="#333" />
                            <Text style={styles.actionOptionText}>Chỉnh sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionOptionRow} onPress={() => actionTarget && onPressDeleteFromAction(actionTarget)}>
                            <Feather name="trash-2" size={18} color="#e53935" />
                            <Text style={[styles.actionOptionText, { color: '#e53935' }]}>Xoá</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionOptionRow, { justifyContent: 'center' }]} onPress={() => setActionModalVisible(false)}>
                            <Text style={{ color: '#777' }}>Huỷ</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                {/* DELETE CONFIRM */}
                <Modal visible={deleteConfirmVisible} transparent animationType="fade" onRequestClose={() => setDeleteConfirmVisible(false)}>
                    <TouchableWithoutFeedback onPress={() => setDeleteConfirmVisible(false)}>
                        <View style={styles.actionBackdrop} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalContent, { width: '90%' }]}>
                            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Xác nhận xoá</Text>
                            <Text style={{ color: '#444', marginBottom: 16 }}>Bạn có chắc muốn xoá bài thảo luận này? Hành động này có thể không khôi phục được.</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                                <TouchableOpacity onPress={() => setDeleteConfirmVisible(false)} disabled={isProcessing}>
                                    <Text style={{ color: '#777' }}>Huỷ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={async () => {
                                    if (!actionTarget) return;
                                    await deleteDiscussion(actionTarget.discussion_id);
                                    setDeleteConfirmVisible(false);
                                }} disabled={isProcessing}>
                                    {isProcessing ? <ActivityIndicator /> : <Text style={{ color: '#e53935', fontWeight: '700' }}>Xoá</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* EDIT MODAL */}
                <Modal
                    visible={editModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setEditModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Chỉnh sửa bài thảo luận</Text>
                            <TextInput value={editTitle} onChangeText={setEditTitle} style={styles.modalInput} editable={!isProcessing} />
                            <TextInput value={editContent} onChangeText={setEditContent} style={[styles.modalInput, { height: 120 }]} multiline editable={!isProcessing} />
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                                <TouchableOpacity onPress={() => setEditModalVisible(false)} disabled={isProcessing}>
                                    <Text style={{ color: '#777' }}>Huỷ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={saveEdit} disabled={isProcessing}>
                                    {isProcessing ? <ActivityIndicator /> : <Text style={{ color: '#007ACC', fontWeight: '600' }}>Lưu</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

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
    moreBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 5,
        padding: 6,
    },
    actionBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
    actionSheet: { backgroundColor: '#fff', paddingVertical: 8, borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 12 },
    actionOptionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
    actionOptionText: { marginLeft: 8, fontSize: 16, color: '#333' },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#eee',
        padding: 8,
        borderRadius: 6,
        marginBottom: 8,
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
