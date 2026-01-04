import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { APP_COLOR } from "@/utils/constant";
import { getUserInfAPI } from "@/utils/api";
import { useCurrentApp } from "@/context/app.context";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";

const UserDetailScreen = () => {
    const navigation = useNavigation();
    const { appState } = useCurrentApp();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (appState?.mybk?.token) {
                const res = await getUserInfAPI(appState.mybk.token);
                if (res && res.user_detail) {
                    setUser(res?.user_detail?.data);
                } else {
                    Toast.show("Get user information failed", {
                        duration: Toast.durations.LONG,
                        textColor: "white",
                        backgroundColor: "red",
                        opacity: 1,
                        position: Toast.positions.BOTTOM
                    });
                }
            }
        };
        fetchUser();
    }, []);

    const InfoRow = ({ icon, label, value }: any) => {
        if (!value) return null;

        return (
            <View style={styles.row}>
                <Feather name={icon} size={18} color={APP_COLOR.BLUE} />
                <View style={styles.rowText}>
                    <Text style={styles.rowLabel}>{label}</Text>
                    <Text style={styles.rowValue}>{value}</Text>
                </View>
            </View>
        );
    };

    const InfoCard = ({ title, children }: any) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            {children}
        </View>
    );

    if (!user) return null;

    const fullName = `${user.lastName} ${user.firstName}`;
    const gender = user.isFemale ? "Female" : "Male";

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={25} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>User Information</Text>
                    <View style={{ width: "auto" }}></View>
                </View>

                <InfoCard title="Personal Information">
                    <InfoRow icon="user" label="Full Name" value={fullName} />
                    <InfoRow icon="hash" label="Student Code" value={user.code} />
                    <InfoRow icon="calendar" label="Date of Birth" value={user.dateOfBirth} />
                    <InfoRow icon="users" label="Gender" value={gender} />
                    <InfoRow icon="credit-card" label="ID Card" value={user.idCardNumber} />
                </InfoCard>

                <InfoCard title="Contact Information">
                    <InfoRow icon="phone" label="Phone Number" value={user.phoneNumber} />
                    <InfoRow icon="mail" label="Personal Email" value={user.personalEmail} />
                    <InfoRow icon="mail" label="Organization Email" value={user.orgEmail} />
                </InfoCard>

                <InfoCard title="Academic Information">
                    <InfoRow icon="book" label="Faculty" value={user.teachingDep?.nameVi} />
                    <InfoRow icon="award" label="Major" value={user.major?.nameVi} />
                    <InfoRow icon="layers" label="Class Code" value={user.classCode} />
                    <InfoRow icon="briefcase" label="Training Level" value={user.trainingLevel?.nameVi} />
                </InfoCard>

                <InfoCard title="Study Status">
                    <InfoRow icon="calendar" label="Start Year" value={user.startYear} />
                    <InfoRow icon="clock" label="Graduation Time" value={user.graduationTime} />
                    <InfoRow icon="activity" label="Status" value={user.status?.name} />
                    <InfoRow icon="map-pin" label="Campus" value={user.campus?.nameVi} />
                </InfoCard>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UserDetailScreen;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 24,

    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: "700",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: APP_COLOR.BLUE,
        marginBottom: 12,
    },
    /* Row */
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 14,
    },
    rowText: {
        marginLeft: 12,
        flex: 1,
    },
    rowLabel: {
        fontSize: 13,
        color: "#777",
        marginBottom: 2,
    },
    rowValue: {
        fontSize: 15,
        fontWeight: "500",
        color: "#111",
    },

});
