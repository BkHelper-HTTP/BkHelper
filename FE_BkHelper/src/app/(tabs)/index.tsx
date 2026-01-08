import ListCourseModal from "@/components/modal/listcourse.modal";
import { getCourseAPI } from "@/utils/api";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { date } from "yup";

const COURSE_COLORS = [
    "#e57373",
    "#4dd0e1",
    "#9575cd",
    "#4db6ac",
    "#ffb74d",
    "#81c784",
];

const HomeTab = () => {
    const [courses, setCourses] = useState<ICourseItemAPI[]>([]);
    const [visible, setVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] =
        useState<ICourseItemAPI | null>(null);

    useEffect(() => {
        const fetchCourse = async () => {
            const res = await getCourseAPI()
            if (res && res?.status === "success") {
                setCourses(res?.data)
            }
        }
        fetchCourse()
    }, [])


    const renderItem = ({
        item,
        index,
    }: {
        item: ICourseItemAPI;
        index: number;
    }) => {
        const color = COURSE_COLORS[index % COURSE_COLORS.length];

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => {
                    setSelectedCourse(item);
                    setVisible(true);
                }}
            >
                <View style={[styles.colorBox, { backgroundColor: color }]} />

                <View style={{ flex: 1 }}>
                    <Text style={styles.codeText}>
                        | {item.course_code}_{item.class_group ?? "N/A"}
                    </Text>

                    <Text style={styles.titleText}>
                        {item.course_name}
                    </Text>

                    <Text style={styles.deptText}>
                        GV: {item.teacher_last_name} {item.teacher_first_name}
                    </Text>

                    <Text style={styles.subText}>
                        {item.start_time} - {item.end_time} | {item.room_code}
                    </Text>

                    <Text style={styles.subText}>
                        {item.campus}
                    </Text>
                </View>

                <Text style={styles.menuIcon}>⋮</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item.course_id}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                />
            </View>
            <ListCourseModal
                visible={visible}
                setVisible={setVisible}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        // padding: 16
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3
    },
    colorBox: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 10
    },
    codeText: {
        color: "#888",
        fontSize: 12,
        marginBottom: 2
    },
    titleText: {
        fontWeight: "600",
        color: "#007ACC",
        fontSize: 14
    },
    deptText: {
        color: "#444",
        fontSize: 13
    },
    menuIcon: {
        color: "#888",
        fontSize: 22,
        marginLeft: 8
    },
    subText: {

    }
});

export default HomeTab