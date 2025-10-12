import React, { useCallback, useMemo } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import isEmpty from "lodash/isEmpty";

interface ItemProps {
    item: any;
}

const AgendaItem = ({ item }: ItemProps) => {
    const handlePress = useCallback(() => {
        Alert.alert("Chi tiết môn học", item.title);
    }, [item]);

    const getRandomColor = useMemo(() => {
        const colors = [
            "#e0f2fe", // blue
            "#fef3c7", // yellow
            "#dcfce7", // green
            "#fce7f3", // pink
            "#ede9fe", // purple
            "#f3e8ff", // violet
            "#fee2e2", // red
        ];
        const index = Math.floor(Math.random() * colors.length);
        return colors[index];
    }, []);

    if (isEmpty(item)) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không có lịch học hôm nay 🎓</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, { backgroundColor: getRandomColor }]}
            onPress={handlePress}
        >
            <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={18} color="#2563eb" />
                <Text style={styles.timeText}>
                    {item.startTime} - {item.endTime}
                </Text>
            </View>

            <Text style={styles.title}>{item.title}</Text>

            {item.employee && (
                <View style={styles.detailRow}>
                    <MaterialIcons name="person-outline" size={18} color="#6b7280" />
                    <Text style={styles.detailText}>
                        {item.employee.lastName} {item.employee.firstName}
                    </Text>
                </View>
            )}

            {item.room && (
                <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={18} color="#6b7280" />
                    <Text style={styles.detailText}>
                        {item.room.code} ({item.room.building.note})
                    </Text>
                </View>
            )}

            <View style={styles.footer}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.subject?.code}</Text>
                </View>
                <Text style={styles.duration}>Duration: {item.duration}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 14,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    timeText: {
        marginLeft: 6,
        fontSize: 14,
        color: "#2563eb",
        fontWeight: "600",
    },
    title: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 6,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 1,
    },
    detailText: {
        fontSize: 14,
        color: "#374151",
        marginLeft: 6,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    badge: {
        backgroundColor: "#dbeafe",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    badgeText: {
        color: "#1d4ed8",
        fontWeight: "600",
        fontSize: 12,
    },
    duration: {
        color: "#4b5563",
        fontSize: 13,
    },
    emptyContainer: {
        paddingVertical: 20,
        alignItems: "center",
    },
    emptyText: {
        color: "#9ca3af",
        fontSize: 15,
    },
});
