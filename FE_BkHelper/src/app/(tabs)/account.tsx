import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import { APP_COLOR } from '@/utils/constant';
import { getUserInfAPI, logOutAPI } from '@/utils/api';
import { useCurrentApp } from '@/context/app.context';
import Toast from 'react-native-root-toast';

const AccountTab = () => {
    const navigation = useNavigation<any>();
    const { appState } = useCurrentApp()
    const [user, setUser] = useState<IUserInformation | null>(null);

    const handleLogOut = async () => {
        if (appState && appState?.lms.sesskey, appState?.lms.cookies.JSESSIONID, appState?.lms.cookies.CASTGC, appState?.lms.cookies.SESSION, appState?.lms.cookies.MoodleSession, appState?.lms.cookies.MOODLEID1_) {
            const res = await logOutAPI(appState?.lms.sesskey, appState?.lms.cookies.JSESSIONID, appState?.lms.cookies.CASTGC, appState?.lms.cookies.SESSION, appState?.lms.cookies.MoodleSession, appState?.lms.cookies.MOODLEID1_)
            if (res && res.status === "success") {
                Toast.show("User logout successfully", {
                    duration: Toast.durations.LONG,
                    textColor: "white",
                    backgroundColor: "green",
                    opacity: 1,
                    position: Toast.positions.BOTTOM
                });
                router.navigate("/(auth)/welcome")
            } else {
                Toast.show("User logout failed", {
                    duration: Toast.durations.LONG,
                    textColor: "white",
                    backgroundColor: "red",
                    opacity: 1,
                    position: Toast.positions.BOTTOM
                });
            }
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            if (appState?.mybk?.token) {
                const res = await getUserInfAPI(appState.mybk.token);
                console.log("check res:", res)
                if (res && res.user_detail) {
                    setUser(res);
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

    const fullName = `${user?.user_detail.data.lastName} ${user?.user_detail.data.firstName}`;

    return (
        <View style={styles.container}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: user?.avatar_url }}
                    style={styles.avatar}
                    resizeMode="cover"         // hoặc "contain" tuỳ hiệu ứng mong muốn
                    resizeMethod="resize"
                />
                <TouchableOpacity style={styles.editIcon}>
                    <Feather name="edit-2" size={14} color="#fff" />
                </TouchableOpacity>
            </View>

            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.role}>{user?.user_detail.data.trainingLevel.nameVi}</Text>

            {/* Menu */}
            <View style={styles.menu}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push({
                        pathname: "/account/view.profile.screen",
                        params: { user: JSON.stringify(user?.user_detail) },
                    })}
                >
                    <View style={styles.menuLeft}>
                        <FontAwesome5 name="user-edit" size={18} color={APP_COLOR.BLUE} />
                        <Text style={styles.menuText}>View Profile</Text>
                    </View>
                    <Entypo name="chevron-right" size={20} color="#555" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.navigate("/(tabs)/notification")}
                >
                    <View style={styles.menuLeft}>
                        <Feather name="bell" size={20} color={APP_COLOR.BLUE} />
                        <Text style={styles.menuText}>Notification</Text>
                    </View>
                    <Entypo name="chevron-right" size={20} color="#555" />
                </TouchableOpacity>
            </View>

            {/* Sign Out */}
            <TouchableOpacity style={styles.signOutBtn} onPress={handleLogOut}>
                <Feather name="log-out" size={18} color="#fff" />
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AccountTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    avatarContainer: {
        alignSelf: 'center',
        position: 'relative',
        marginBottom: 10,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
        borderColor: APP_COLOR.BLUE,
    },
    editIcon: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        backgroundColor: APP_COLOR.BLUE,
        borderRadius: 12,
        padding: 6,
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 6,
    },
    role: {
        textAlign: 'center',
        color: '#888',
        marginBottom: 30,
    },
    menu: {
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    menuText: {
        fontSize: 16,
        color: '#222',
        fontWeight: '500',
    },
    signOutBtn: {
        marginTop: 40,
        backgroundColor: APP_COLOR.BLUE,
        paddingVertical: 14,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    signOutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
