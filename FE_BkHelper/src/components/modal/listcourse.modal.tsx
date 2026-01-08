import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useNavigation } from "expo-router";
import { APP_COLOR } from "@/utils/constant";
import { fetchForumAPI } from "@/utils/api";
import Toast from "react-native-root-toast";

interface IProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    selectedCourse: ICourseItemAPI | null;
    setSelectedCourse: (selectedCourse: ICourseItemAPI | null) => void;
}

const ListCourseModal = (props: IProps) => {
    const { visible, setVisible, selectedCourse, setSelectedCourse } = props

    const handleForumCreate = async () => {
        setVisible(false);
        if (selectedCourse && selectedCourse.course_name && selectedCourse.course_id_lms && selectedCourse.course_code &&
            selectedCourse.teacher_last_name && selectedCourse.teacher_first_name && selectedCourse.teacher_email && selectedCourse.semester) {
            const res = await fetchForumAPI(
                selectedCourse.course_name,
                selectedCourse.course_id_lms,
                selectedCourse.course_code,
                selectedCourse.teacher_last_name,
                selectedCourse.teacher_first_name,
                selectedCourse.teacher_email,
                selectedCourse.semester
            );


            if (res && res.status === "success") {
                router.push({
                    pathname: "/forum/forum.view.screen",
                    params: {
                        forum_id: res.forum.forum_id,
                        forum_name: res.forum.forum_name,
                        course_code: res.forum.course_code,
                    },
                });
            } else {
                Toast.show("Forum create failed", {
                    duration: Toast.durations.LONG,
                    textColor: "white",
                    backgroundColor: "red",
                    opacity: 1,
                    position: Toast.positions.BOTTOM,
                });
            }
        }
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalBox}>

                    {/* Close */}
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => {
                            setVisible(false);
                            setSelectedCourse(null);
                        }}
                    >
                        <Text style={{ fontSize: 18 }}>✕</Text>
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={styles.modalTitle}>
                        {selectedCourse?.course_name}
                    </Text>

                    <Text style={styles.teacherText}>
                        {selectedCourse?.teacher_last_name} {selectedCourse?.teacher_first_name}
                    </Text>

                    {/* Info */}
                    <Info label="Mã môn" value={selectedCourse?.course_code!} />
                    <Info label="Lớp" value={selectedCourse?.class_group ?? "N/A"} />
                    <Info
                        label="Giờ học"
                        value={`${selectedCourse?.start_time} - ${selectedCourse?.end_time}`}
                    />
                    <Info label="Phòng học" value={selectedCourse?.room_code!} />
                    <Info label="Địa điểm" value={selectedCourse?.campus!} />
                    <Info label="Số tín chỉ" value={String(selectedCourse?.num_of_credit)} />
                    <Info label="Mã học kỳ" value={selectedCourse?.semester!} />
                    <Info label="Học kỳ" value={selectedCourse?.semester_name!} />

                    {/* Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: APP_COLOR.DARK_BLUE }]}
                            onPress={() => {
                                setVisible(false);
                                router.push({
                                    pathname: "/chat/chat.screen",
                                    params: {
                                        classId: selectedCourse?.course_id!,
                                        className: selectedCourse?.course_name!,
                                    },
                                });
                            }}
                        >
                            <Text style={styles.actionText}>Chat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: APP_COLOR.GREY }]}
                            onPress={handleForumCreate}
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

const Info = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
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
        borderBottomLeftRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#007ACC",
        textAlign: "center",
    },
    teacherText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 6,
        gap: 12,
    },
    label: {
        width: 100,
        fontWeight: "600",
        color: "#333",
    },
    value: {
        flex: 1,
        color: "#333",
    },
    actionRow: {
        flexDirection: "row",
        marginTop: 16,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 6,
    },
    actionText: {
        fontWeight: "700",
        fontSize: 16,
        color: "#fff",
    },
});


export default ListCourseModal