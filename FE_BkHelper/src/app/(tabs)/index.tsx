import { router, useNavigation } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ICourse {
    id: string,
    title: string,
    teacher: string,
    code: string,
    department: string,
    color: string
}

const courses = [
    {
        id: "CO3015",
        title: "Kiểm tra Phần mềm",
        teacher: "Bùi Hoài Thắng",
        code: "CQ_HK251",
        department: "Công Nghệ Phần Mềm",
        color: "#e57373"
    },
    {
        id: "CO3029",
        title: "Khai phá Dữ liệu",
        teacher: "Đỗ Thanh Thái",
        code: "CQ_HK251",
        department: "Hệ Thống Thông Tin",
        color: "#4dd0e1"
    },
    {
        id: "CO304313",
        title: "Phát triển Ứng dụng trên Thiết bị Di động",
        teacher: "Hoàng Lê Hải Thanh",
        code: "CQ_HK251",
        department: "Khoa Học Máy Tính",
        color: "#9575cd"
    },
    {
        id: "CO4029",
        title: "Đồ án Chuyên ngành",
        teacher: "Hoàng Lê Hải Thanh",
        code: "CQ_HK251",
        department: "Giáo Vụ Khoa Tin Học",
        color: "#4db6ac"
    },
    {
        id: "CO3044",
        title: "Phát triển Ứng dụng trên Thiết bị Di động",
        teacher: "Hoàng Lê Hải Thanh",
        code: "CQ_HK251",
        department: "Khoa Học Máy Tính",
        color: "#9575cd"
    },
    {
        id: "CO40298",
        title: "Đồ án Chuyên ngành",
        teacher: "Hoàng Lê Hải Thanh",
        code: "CQ_HK251",
        department: "Giáo Vụ Khoa Tin Học",
        color: "#4db6ac"
    }, {
        id: "CO304312",
        title: "Phát triển Ứng dụng trên Thiết bị Di động",
        teacher: "Hoàng Lê Hải Thanh",
        code: "CQ_HK251",
        department: "Khoa Học Máy Tính",
        color: "#9575cd"
    },
    {
        id: "CO402912",
        title: "Đồ án Chuyên ngành",
        teacher: "Hoàng Lê Hải Thanh",
        code: "CQ_HK251",
        department: "Giáo Vụ Khoa Tin Học",
        color: "#4db6ac"
    }, {
        id: "CO30431",
        title: "Phát triển Ứng dụng trên Thiết bị Di động",
        teacher: "Hoàng Lê Hải Thanh",
        code: "CQ_HK251",
        department: "Khoa Học Máy Tính",
        color: "#9575cd"
    },
    {
        id: "CO40291",
        title: "Đồ án Chuyên ngành",
        teacher: "Hoàng Lê Hải Thanh",
        code: "CQ_HK251",
        department: "Giáo Vụ Khoa Tin Học",
        color: "#4db6ac"
    },
];
const HomeTab = () => {
    const navigation = useNavigation()

    const renderItem = ({ item }: { item: ICourse }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({
                pathname: "/forum/forum.details.screen",
                params: { id: item.id, title: item.title }

            })}
        >
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <View style={{ flex: 1 }}>
                <Text style={styles.codeText}>| {item.id}_{item.code}</Text>
                <Text style={styles.titleText}>
                    {item.title} ({item.id})_{item.teacher} ({item.code})
                </Text>
                <Text style={styles.deptText}>{item.department}</Text>
            </View>
            <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 16
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
    }
});

export default HomeTab