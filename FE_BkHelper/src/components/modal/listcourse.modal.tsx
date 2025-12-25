import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useNavigation } from "expo-router";
import { APP_COLOR } from "@/utils/constant";

interface IProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    selectedCourse: ICourse | null;
    setSelectedCourse: (selectedCourse: ICourse | null) => void;
}

const ListCourseModal = (props: IProps) => {
    const { visible, setVisible, selectedCourse, setSelectedCourse } = props

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>

                    {/* Close */}
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => setVisible(false)}
                    >
                        <Text style={{ fontSize: 18, textAlign: "center" }}>✕</Text>
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={styles.modalTitle}>
                        Khai phá dữ liệu - CO3029
                    </Text>
                    <Text style={styles.teacherText}>
                        Đỗ Thanh Thái
                    </Text>

                    {/* Info */}
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Lớp:</Text>
                        <Text style={styles.value}>L02</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Giờ học:</Text>
                        <Text style={styles.value}>7:00 - 8:50</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Phòng học:</Text>
                        <Text style={styles.value}>H6-110</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Địa điểm:</Text>
                        <Text style={styles.value}>ĐHBK Cơ Sở 2 - Đông Hoà</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Số tín chỉ:</Text>
                        <Text style={styles.value}>3</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Mã học kỳ:</Text>
                        <Text style={styles.value}>20251</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Học kỳ:</Text>
                        <Text style={styles.value}>Học kỳ 1 Năm học 2025 - 2026</Text>
                    </View>

                    {/* Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: APP_COLOR.DARK_BLUE }]}
                            onPress={() => {
                                setVisible(false);
                                router.push("/chat/chat.screen");
                            }}
                        >
                            <Text style={styles.actionText}>Chat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: APP_COLOR.GREY }]}
                            onPress={() => {
                                setVisible(false);
                                router.push("/forum/forum.view.screen");
                            }}
                        >
                            <Text style={[styles.actionText, { color: APP_COLOR.DARK_BLUE }]}>
                                Forum
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalBox: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
    },
    closeBtn: {
        position: "absolute",
        right: 0,
        top: 0,
        backgroundColor: "red",
        width: 30,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    modalTitle: {
        fontSize: 25,
        fontWeight: "700",
        color: "#007ACC",
        textAlign: "center",
        marginBottom: 4
    },
    teacherText: {
        textAlign: "center",
        fontSize: 25,
        fontWeight: "600",
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 6,
        marginLeft: 26,
        gap: 15
    },
    label: {
        width: 100,
        fontWeight: "600",
        color: "#333"
    },
    value: {
        flex: 1,
        color: "#333"
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 6
    },
    actionText: {
        fontWeight: "700",
        fontSize: 16,
        color: "#fff"
    }
});


export default ListCourseModal